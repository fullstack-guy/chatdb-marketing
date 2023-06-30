import { useEffect, useState } from "react";
import axios from "axios";
import { Resizable } from "re-resizable";
import DataGrid from "react-data-grid";
import Sidebar from "../../components/parser-components/sidebar/Sidebar";
import "react-data-grid/lib/styles.css";
import dynamic from "next/dynamic";
import Checkbox from "../parser-components/checkbox/CheckBox";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";

const Queryarea = dynamic(
  () => import("../../components/parser-components/queryarea/Queryarea"),
  { ssr: false }
);

const Query = ({ database_token, filteredTables }) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rows.length > 0) {
      setColumns(
        Object.keys(rows[0]).map((key) => {
          return { key: key, name: key };
        })
      );
    } else {
      setColumns([]);
    }
  }, [rows]);

  const handleRunQuery = async () => {
    setError(null);
    setMessage("");
    setIsLoading(true);

    try {
      const startTime = Date.now(); // Start time before API call
      const response = await axios.post("/api/db/query", {
        connectionStringToken: database_token,
        query,
      });
      const endTime = Date.now(); // End time after API call

      setExecutionTime(endTime - startTime + "ms"); // Time taken to get response

      if (response.data.error) {
        setError({
          code: response.data.errorCode,
          message: response.data.errorMessage
        });
        setMessage(`[${response.data.errorCode}] ERROR: ${response.data.errorMessage}`);
        setRows([]);
        setColumns([]);
        return;
      }

      switch (response.data.command) {
        case "SELECT":
          let data = [];
          setMessage("");
          response.data.rows.forEach((item, index) => {
            data.push({
              id: index,
              ...item,
            });
          });
          setRows(data);
          setColumns(
            Object.keys(data[0]).map((key) => {
              return { key: key, name: key };
            })
          );
          break;
        case "INSERT":
        case "DELETE":
        case "CREATE":
          setRows([]);
          setColumns([]);
          setMessage(response.data.message);
          break;
        default:
          setMessage("");
      }
    } catch (error) {
      setError({
        message: `ERROR: ${error.message}`
      });
      setMessage(`ERROR: ${error.message}`);
      if (error.response) {
        setMessage(`[${error.response.status}] ERROR: ${error.response.data.errorMessage}`);
      }
    } finally {
      setIsLoading(false); // Set loading state to false when API call finishes
    }
  };

  const handleQueryChange = (query) => {
    setQuery(query);
    setAnnotations([]);
  };

  return (
    <div className="container m-auto mt-3 rounded-lg bg-white p-3 shadow-lg">
      <div className="flex">
        <Sidebar filteredTables={filteredTables} />
        <div className="w-4/5">
          <Queryarea annotations={annotations} query={query} onChange={handleQueryChange} />
          <div>
            <div className="ml-9 flex pt-2">
              <button
                onClick={handleRunQuery}
                disabled={!query.trim()}
                className={`
    flex 
    items-center 
    justify-center 
    space-x-2 
    ${query.trim() && !isLoading
                    ? "cursor-pointer bg-gray-500 hover:bg-gray-800"
                    : "cursor-not-allowed bg-gray-300"
                  } 
mr-5 
rounded 
border 
px-4 
py-2 
font-bold 
text-white
`}
              >
                {isLoading ? <div>Loading...</div> : <><FaPlay /><span>Run Query</span></>}
              </button>
              <Checkbox />
            </div>
            <hr className="my-2 w-full" />
            <div className="ml-9 mt-3 flex items-center">
              {!error && <AiOutlineCheckCircle color="green" className="self-center" />}
              {!error && <span className="px-2 font-bold">{`${rows.length} Rows`}</span>}
              <span className="px-2">{executionTime}</span>
            </div>
            {message && (
              <div className="ml-9 mt-3 flex">
                <span className={`px-2 font-bold ${error ? 'text-red-500' : 'text-green-500'}`}>{message}</span>
              </div>
            )}
            <hr className="my-2 w-full" />
          </div>
          <Resizable
            maxWidth={"100%"}
            maxHeight={"100%"}
            enable={{
              top: true,
              right: true,
            }}
          >
            <DataGrid
              className="rdg-light"
              style={{ width: "100%", height: "100%" }}
              rows={rows}
              columns={columns}
            />
          </Resizable>
        </div>
      </div>
    </div>
  );
};

export default Query;
