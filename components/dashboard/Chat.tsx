import { format } from "sql-formatter";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Prism } from "@mantine/prism";
import { Toaster, toast } from "react-hot-toast";
import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import gfm from "remark-gfm";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { useAuth } from "@clerk/clerk-react";
import CodeBlock from "./chat/CodeBlock";
import { CSVLink } from "react-csv";
import { BsCodeSlash, BsDownload, BsTable } from "react-icons/bs";
import {
  AiOutlinePieChart,
  AiOutlineAreaChart,
  AiOutlineLineChart,
  AiOutlineBarChart,
  AiOutlineSetting,
} from "react-icons/ai";
import Modal from "react-modal";
import Chart from "./Chart";

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const Chat = ({ database_uuid }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({ sql: "", result: "", data: null });
  const [showSql, setShowSql] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [indexedField, setIndexedField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [selectedChart, setSelectedChart] = useState("");
  const [isChartConfig, setIsChartConfig] = useState(false);
  const [showTable, setshowTable] = useState(true);
  const [selectedChartName, setSelectedChartName] = useState("");
  const { getToken } = useAuth();

  const toggleSqlVisibility = () => {
    setShowSql((prevShowSql) => !prevShowSql);
  };

  const formatDataForGrid = (data) => {
    if (!data.columns || !data.rows) {
      return { columns: [], rows: [] };
    }

    const columns = data.columns.map((col) => ({
      key: col,
      name: col,
      resizable: true,
      sortable: true,
    }));

    const rows = data.rows.map((row, rowIndex) => {
      let rowObj = {};
      data.columns.forEach((col, colIndex) => {
        // Check if the value is a boolean and convert it to a string if it is
        if (typeof row[colIndex] === "boolean") {
          rowObj[col] = row[colIndex] ? "true" : "false";
        }
        if (typeof row[colIndex] === "object" && row[colIndex] !== null) {
          rowObj[col] = JSON.stringify(row[colIndex]);
        } else {
          rowObj[col] = row[colIndex];
        }
      });
      return { ...rowObj, id: rowIndex };
    });

    return { columns, rows };
  };

  async function sendQueryToEndpoint(code) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/db/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: code,
          database_uuid: database_uuid,
        }),
      });

      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        setResult({
          sql: data.sql,
          result: "",
          data: data.data,
        });

        setIsLoading(false);
      } else {
        toast.error("Sorry, we had an issue running the query.");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Sorry, we had an issue running the query.");
    }
  }

  const handleKeyDown = async (e) => {
    if (isLoading) {
      return; // Disable function if a query is in progress
    }

    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoading(true);

      try {
        const token = await getToken({ template: "supabase" });

        const response = await fetch(
          "https://chatdb-backend-deah4kbsta-uc.a.run.app/ask",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query, uuid: database_uuid }),
          }
        );

        if (!response.ok) {
          throw new Error("Response Error: " + response.status);
        }

        const data = await response.json();

        setResult({
          sql: data.sql,
          result: data.text,
          data: data.data,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Fetch Error :-S", error);
        setIsLoading(false);
        toast.error("Sorry, that is embarrassing. We had an issue 🙈");
      }
    }
  };

  const handleChartConfiguration = (chartName) => {
    if (!isChartConfig) {
      setModalOpen(true);
      setSelectedChartName(chartName);
      setIsChartConfig(true);
    } else {
      setModalOpen(false);
      setSelectedChart(chartName);
      setSelectedChartName(chartName);
      setshowTable(false);
    }
  };

  return (
    <>
      <div className="form-control">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your database..."
          className="input-bordered input-primary input input-lg w-full flex-1 rounded-lg border px-4 py-6 text-lg text-black"
        />
        <label className="label">
          <span className="label-text-alt">
            Note: AI assistant only works with the public schema at the moment.
          </span>
        </label>
      </div>
      {isLoading ? (
        <div className="mt-5 flex items-center justify-center">
          <BeatLoader
            className="mt-2"
            color="#123abc"
            loading={isLoading}
            size={20}
          />
        </div>
      ) : (
        <div>
          {result.result && (
            <>
              <div className="group relative mb-4 flex items-start">
                <div className="flex-1 space-y-2 overflow-hidden px-1">
                  <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[gfm]}
                    components={{
                      p({ children }) {
                        return (
                          <p className="mb-2 text-black last:mb-0">
                            {children}
                          </p>
                        );
                      },
                      code({ node, inline, className, children, ...props }) {
                        if (children.length) {
                          if (children[0] == "▍") {
                            return (
                              <span className="mt-1 animate-pulse cursor-default">
                                ▍
                              </span>
                            );
                          }
                          children[0] = (children[0] as string).replace(
                            "`▍`",
                            "▍"
                          );
                        }
                        const match = /language-(\w+)/.exec(className || "");
                        if (inline) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ""}
                            onRunCode={sendQueryToEndpoint}
                            value={String(children).replace(/\n$/, "")}
                            {...props}
                          />
                        );
                      },
                    }}
                  >
                    {result.result}
                  </MemoizedReactMarkdown>
                  {/* If you want to include message actions as well, uncomment the line below */}
                  {/* <ChatMessageActions message={result} /> */}
                </div>
              </div>
            </>
          )}
          {!showTable ? (
            <>
              <div className="flex justify-end">
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => {
                    setModalOpen(true);
                    setSelectedChartName(selectedChartName);
                  }}
                >
                  <AiOutlineSetting />
                </button>
              </div>
              <Chart
                x_axis={indexedField}
                y_axis={categoryField}
                chartName={selectedChart}
                data={formatDataForGrid(result.data).rows}
              />
            </>
          ) : (
            Object.keys(result?.data || {}).length > 0 && (
              <div className="mt-3">
                <DataGrid
                  className={`rdg-light h-[100%] max-h-[60vh] w-full`}
                  columns={formatDataForGrid(result.data).columns}
                  rows={formatDataForGrid(result.data).rows}
                />
              </div>
            )
          )}
          {result.sql && (
            <div>
              <div className="mt-5 flex justify-end">
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => setshowTable(true)}
                >
                  <BsTable />
                </button>
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => handleChartConfiguration("Area Chart")}
                >
                  <div className="tooltip tooltip-bottom" data-tip="Area Chart">
                    <AiOutlineAreaChart />
                  </div>
                </button>
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => handleChartConfiguration("Line Chart")}
                >
                  <div className="tooltip tooltip-bottom" data-tip="Line Chart">
                    <AiOutlineLineChart />
                  </div>
                </button>
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => handleChartConfiguration("Bar Chart")}
                >
                  <div className="tooltip tooltip-bottom" data-tip="Bar Chart">
                    <AiOutlineBarChart />
                  </div>
                </button>
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={() => handleChartConfiguration("Pie Chart")}
                >
                  <div className="tooltip tooltip-bottom" data-tip="Pie Chart">
                    <AiOutlinePieChart />
                  </div>
                </button>
                <button
                  className="mr-2 rounded px-4 py-2 text-black shadow"
                  onClick={toggleSqlVisibility}
                >
                  <div className="tooltip tooltip-bottom" data-tip="View Code">
                    <BsCodeSlash />
                  </div>
                </button>

                <CSVLink
                  className="rounded px-4 py-2 text-black shadow"
                  filename={"my-data.csv"}
                  data={formatDataForGrid(result.data).rows}
                  headers={formatDataForGrid(result.data).columns.map(
                    (col) => ({
                      label: col.name,
                      key: col.key,
                    })
                  )}
                >
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Download as CSV"
                  >
                    <BsDownload />
                  </div>
                </CSVLink>
              </div>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                className="fixed left-1/2 top-1/2 max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-16 shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-70"
                contentLabel="Chart Configuration Modal"
              >
                <h2 className="mb-4 text-center text-2xl font-bold text-black">
                  Configure Chart
                </h2>
                <p className="mb-8 text-center">
                  {selectedChartName
                    ? `Configure the ${selectedChartName} by selecting indexed field and category field.`
                    : "Select a chart to configure."}
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="indexedField"
                    className="text-md block font-medium text-gray-700"
                  >
                    Indexed Field:
                  </label>
                  <select
                    id="indexedField"
                    value={indexedField}
                    required
                    onChange={(e) => setIndexedField(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    {formatDataForGrid(result.data).columns.map((column) => (
                      <option key={column.key} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="categoryField"
                    className="text-md block font-medium text-gray-700"
                  >
                    Category Field:
                  </label>
                  <select
                    id="categoryField"
                    value={categoryField}
                    required
                    onChange={(e) => setCategoryField(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    {formatDataForGrid(result.data).columns.map((column) => (
                      <option key={column.key} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                    onClick={() => {
                      setModalOpen(false);
                      setshowTable(false);
                      setSelectedChart(selectedChartName);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </Modal>

              {/* Conditionally render the SQL dropdown */}
              {showSql && (
                <div className="sql-dropdown mt-4">
                  <Prism withLineNumbers language="sql">
                    {format(result.sql, { language: "postgresql" })}
                  </Prism>
                </div>
              )}
            </div>
          )}
          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
};

export default Chat;
