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
  const { getToken } = useAuth();

  const toggleSqlVisibility = () => {
    setShowSql(prevShowSql => !prevShowSql);
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
        if (typeof row[colIndex] === 'boolean') {
          rowObj[col] = row[colIndex] ? 'true' : 'false';
        } else {
          rowObj[col] = row[colIndex];
        }
      });
      return { ...rowObj, id: rowIndex };
    });

    return { columns, rows };
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoading(true);

      try {
        const token = await getToken({ template: "supabase" });

        const response = await fetch("http://localhost:8080/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ query, uuid: database_uuid }),
        });

        if (!response.ok) {
          throw new Error("Response Error: " + response.status);
        }

        const data = await response.json();

        setResult({
          sql: data.sql,
          result: data.text,
          data: data.data
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Fetch Error :-S", error);
        setIsLoading(false);
        toast.error("Sorry, that is embarrassing. We had an issue 🙈");
      }
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
            <div className="mt-10">
              <div className="answer-box mb-4 rounded-lg p-4">
                <MemoizedReactMarkdown
                  className="prose break-words text-black dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                  remarkPlugins={[gfm]}
                  components={{
                    p({ children }) {
                      return (
                        <p className="mb-2 text-black last:mb-0">{children}</p>
                      );
                    },
                  }}
                >
                  {result.result}
                </MemoizedReactMarkdown>
              </div>
            </div>
          )}
          {Object.keys(result?.data || {}).length > 0 && (
            <div className="mt-5">
              <DataGrid
                className={`rdg-light w-full h-[100%] max-h-[60vh]`}
                columns={formatDataForGrid(result.data).columns}
                rows={formatDataForGrid(result.data).rows}
              />
            </div>
          )}
          {result.sql && (
            <div>
              {/* The View Code Button */}
              <button
                className="mt-5 btn btn-primary"
                onClick={toggleSqlVisibility}
              >
                View Code
              </button>

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
