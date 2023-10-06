import { format } from "sql-formatter";
import { useState, useEffect } from "react";
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
import { BsCodeSlash, BsDownload } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import Modal from "react-modal";
import Chart from "./Chart";

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const Chat = ({ database_uuid }) => {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    sql: "",
    result: "",
    data: null,
  });
  const [showSql, setShowSql] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [indexedField, setIndexedField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [selectedChart, setSelectedChart] = useState("");
  const [isChartConfig, setIsChartConfig] = useState(false);

  const [showTable, setShowTable] = useState(true);
  const [selectedChartName, setSelectedChartName] = useState("");
  const { getToken } = useAuth();

  const toggleSqlVisibility = () => {
    setShowSql((prevShowSql) => !prevShowSql);
  };

  const dataSelectors = [
    "Table",
    "Pie Chart",
    "Bar Chart",
    "Area Chart",
    "Line Chart",
  ];

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
      const token = await auth.getToken();
      const url = "/fastify/api/db/query";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return; // disable function if a query is in progress
    }

    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoading(true);
      setIndexedField("");
      setCategoryField("");
      setShowTable(true);
      setIsChartConfig(false);

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

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleChartConfiguration = (chartName) => {
    // only open modal if neither indexedField nor categoryField have been set
    if (!indexedField && !categoryField) {
      setModalOpen(true);
    }
    setSelectedChartName(chartName);
    setIsChartConfig(true);
    setSelectedChart(chartName);
    setShowTable(false);
  };

  const onOptionChangeHandler = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Table") {
      setShowTable(true);
      return;
    }

    // Only call handleChartConfiguration if indexedField and categoryField are empty
    if (!indexedField && !categoryField) {
      setModalOpen(true);
      setSelectedChartName(selectedValue);
    } else {
      handleChartConfiguration(selectedValue);
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
                {dataSelectors.length && (
                  <select
                    className="select-bordered select mr-2 w-full max-w-xs rounded px-4 py-2 text-black shadow"
                    onChange={onOptionChangeHandler}
                  >
                    {dataSelectors.map((label) => {
                      return (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                )}
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-80"
                contentLabel="Chart Configuration Modal"
              >
                <div className="relative w-full rounded-lg bg-white shadow-xl sm:w-3/4 md:w-1/2 lg:w-1/3">
                  <button
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-800"
                    onClick={() => setModalOpen(false)}
                  >
                    <span className="text-2xl">×</span>
                  </button>

                  <div className="px-8 py-6">
                    <h2 className="mb-4 text-2xl font-semibold text-black">
                      Configure Chart
                    </h2>
                    <p className="mb-6 text-gray-700">
                      {selectedChartName
                        ? `Configure the ${selectedChartName} by selecting data field and label field.`
                        : "Select a chart to configure."}
                    </p>

                    {/* Label Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="indexedField"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Label Field:
                      </label>
                      <select
                        id="indexedField"
                        value={indexedField}
                        required
                        onChange={(e) => {
                          setIndexedField(e.target.value);
                        }}
                        className="mt-1 w-full rounded-md border p-2 text-black focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
                      >
                        {formatDataForGrid(result.data).columns.map(
                          (column) => (
                            <option key={column.key} value={column.name}>
                              {column.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Data Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="categoryField"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data Field:
                      </label>
                      <select
                        id="categoryField"
                        value={categoryField}
                        required
                        onChange={(e) => setCategoryField(e.target.value)}
                        className="mt-1 w-full rounded-md border p-2 text-black focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
                      >
                        {formatDataForGrid(result.data).columns.map(
                          (column) => (
                            <option key={column.key} value={column.name}>
                              {column.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="mt-3 flex justify-end space-x-4">
                      <button
                        onClick={handleCancel}
                        className="rounded px-4 py-2 text-gray-600 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded bg-secondary px-4 py-2 text-white"
                        onClick={() => {
                          setModalOpen(false);
                          setShowTable(false);
                          setSelectedChart(selectedChartName);

                          // if user didn't explicitly set, set default of first column

                          const columns = formatDataForGrid(
                            result.data
                          ).columns;
                          if (!indexedField && columns && columns.length > 0) {
                            setIndexedField(columns[0].name);
                          }
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
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
