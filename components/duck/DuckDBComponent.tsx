import { useState, useEffect } from "react";
import Link from "next/link";
import * as duckdb from "@duckdb/duckdb-wasm";
import AceEditor from "react-ace";
import DataGrid from "react-data-grid";
import { Toaster, toast } from "react-hot-toast";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "react-data-grid/lib/styles.css";
import { BsMagic } from "react-icons/bs"
import { format } from 'sql-formatter';
import { Prism } from '@mantine/prism';

const DuckDBComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("SELECT * FROM my_csv LIMIT 10;");
  const [connection, setConnection] = useState(null);
  const [db, setDb] = useState(null);
  const [isFileReady, setIsFileReady] = useState(false);
  const [columns, setColumns] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  //ai assistant states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantSQL, setAssistantSQL] = useState("");
  const [tableMetadata, setTableMetadata] = useState([]);
  const [sqlGenerated, setSqlGenerated] = useState(false);

  useEffect(() => {
    initializeDuckDB();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const columnNames = Object.keys(data[0]);
      const newColumns = columnNames.map((colName) => ({
        key: colName,
        name: colName,
        resizable: true,
      }));
      setColumns(newColumns);
    }
  }, [data]);

  const handleAssistantClick = () => {
    setModalIsOpen(true);
  };

  const handleAssistantQueryChange = (event) => {
    setAssistantQuery(event.target.value);
  };

  const handleAssistantSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const transformedData = tableMetadata.map(({ name, type }) => ({ name, type }));

    try {
      const response = await fetch('/api/csv', {  // replace with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metadata: transformedData, message: assistantQuery })
      });
      const data = await response.json();
      console.log(data)
      setAssistantSQL(data.sql);
      setSqlGenerated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const initializeDuckDB = async () => {
    setLoading(true);
    // Select a bundle based on browser checks
    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker!}");`], {
        type: "text/javascript",
      })
    );

    // Instantiate the async version of DuckDB-wasm
    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger();
    const newDb = new duckdb.AsyncDuckDB(logger, worker);
    await newDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);

    // Connect to the database
    const newConnection = await newDb.connect();
    setDb(newDb);
    setConnection(newConnection);
    setLoading(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (evt) {
        const csvData = evt.target.result;
        await loadData(csvData);
      };
      reader.readAsText(file);
    }
  };

  const loadData = async (csvData) => {
    setLoading(true);
    const tempFile = "my_data.csv";
    const tableName = "my_csv";
    await db.reset();
    console.log("resetting db")
    const connection = await db.connect();
    setConnection(connection);
    await db.registerFileText(tempFile, csvData);
    await connection.insertCSVFromPath(tempFile, {
      name: tableName,
      schema: "main",
      header: true,
      detect: true,
    });

    // Fetch table schema using SQL
    const schemaQuery = `PRAGMA table_info(${tableName});`;
    const schemaResult = await connection.query(schemaQuery);

    // Convert the result to an array of objects
    const schema = [];
    for (let row of schemaResult) {
      const rowObj = {};

      for (let field of schemaResult.schema.fields) {
        let cell = row[field.name];
        if (typeof cell === "bigint") {
          cell = Number.isSafeInteger(cell) ? Number(cell) : cell.toString();
        }
        rowObj[field.name] = cell;
      }
      schema.push(rowObj);
    }

    setTableMetadata(schema);

    setIsFileReady(true);
    setLoading(false);
  };

  const runQuery = async () => {
    try {
      if (!isFileReady) {
        console.error("File is not ready");
        toast("Sorry, it looks like you don't have a file uploaded.");
        return;
      }
      const arrowTable = await connection.query(query);
      if (!arrowTable) {
        console.error("No data returned from the query");
        return;
      }

      const rows = [];

      for (let row of arrowTable) {
        const rowObj = {};

        for (let field of arrowTable.schema.fields) {
          let cell = row[field.name];

          if (typeof cell === "bigint") {
            cell = Number.isSafeInteger(cell) ? Number(cell) : cell.toString();
          }

          // Check if cell is a timestamp
          if (field.name === "BirthDate" || field.name === "HireDate") {
            cell = new Date(Number(cell)).toISOString();
          }

          rowObj[field.name] =
            cell == null
              ? "null"
              : !Array.isArray(cell)
                ? cell
                : "[" +
                cell
                  .map((value) => (value == null ? "null" : value))
                  .join(", ") +
                "]";
        }
        rows.push(rowObj);
      }

      setData(rows);
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred: " + err.message);
    }
  };

  return (
    <>
      <div className="mt-10 flex flex-col items-center p-6">
        <h1 className="relative mb-4 flex items-center justify-center text-center text-5xl font-bold text-black">
          Query CSV with SQL
          <span className="ml-4 rounded-full bg-green-500 px-3 py-1 text-lg font-bold text-white">
            BETA
          </span>
        </h1>
        <p className="mb-4 text-center text-lg">
          Upload your CSV, write an SQL query, and interact with your data.{" "}
          <br></br>Easy to use and completely in the browser.
        </p>
        <div className="mb-10 mt-10 flex w-full max-w-xs flex-col items-start sm:flex-row sm:items-center">
          <input
            accept=".csv"
            className="file-input-bordered file-input file-input-md mb-4 w-full sm:mb-0 sm:mr-4"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <AceEditor
          mode="sql"
          theme="ace"
          onChange={(newQuery) => setQuery(newQuery)}
          value={query}
          fontSize={18}
          name="sqlEditor"
          placeholder="SELECT * FROM my_csv LIMIT 10;"
          editorProps={{ $blockScrolling: true }}
          setOptions={{ showLineNumbers: true }}
          style={{ width: "100%", height: "10rem" }}
        />
        <p className="mt-2 text-sm text-gray-500">
          Note: The table name to query is 'my_csv'
        </p>
        <div className="flex">
          <button
            className="font-bold my-3 rounded-lg bg-gray-700 px-4 py-2 text-white mr-2"  // Added mr-2 to add spacing between buttons
            onClick={runQuery}
          >
            Run Query
          </button>
          <button
            className="my-3 font-bold rounded-lg bg-gray-700 px-4 py-2 text-white"
            onClick={handleAssistantClick}
          >
            <div className="flex">
              Assistant <BsMagic className="ml-1 my-auto" />
            </div>
          </button>
        </div>
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
        {data.length > 0 && (
          <div className="w-full overflow-x-scroll">
            <DataGrid
              columns={columns}
              className="rdg-light mt-10"
              rows={data}
            />
          </div>
        )}
        <div className="my-20 w-full px-6">
          <h2 className="text-center text-4xl font-bold text-black">
            Why Querying a CSV file with SQL Is Great
          </h2>
          <p className="mt-6 text-center text-lg">
            SQL provides a powerful, flexible syntax for querying data. By using
            SQL on CSV files, you can quickly extract complex insights from your
            data without needing to import it into a database or use a more
            complex data analysis tool.
          </p>
        </div>
        <div className="my-20 w-full px-6">
          <h2 className="text-center text-4xl font-bold text-black">
            How it works
          </h2>
          <p className="mt-6 text-center text-lg">
            We package an OLAP database that runs in the browser via WebAssembly so that we never touch any of your data. All of your data stays on your machine and never leaves the browser!
          </p>
        </div>
        <div className="mb-20 w-full px-6">
          <h2 className="text-center text-2xl font-bold text-black">
            Want to edit your CSV like a spreadsheet?
          </h2>
          <p className="mt-6 text-center text-lg">
            If you prefer working with a spreadsheet-like interface, check out
            our{" "}
            <Link
              href="/tools/csv-editor"
              className="text-xl font-bold text-gray-700"
            >
              CSV Editor tool
            </Link>
            . It provides an intuitive, easy-to-use interface for viewing and
            editing your CSV data.
          </p>
        </div>
        {modalIsOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <form onSubmit={handleAssistantSubmit} className="modal-box m-auto">
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Ask the Assistant
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={assistantQuery}
                        onChange={handleAssistantQueryChange}
                        className="input input-bordered w-full text-black"
                      />
                    </div>
                    {
                      assistantSQL && (
                        <div className='mt-4'>
                          <Prism withLineNumbers language="sql">{format(assistantSQL, { language: 'mysql' })}</Prism>
                        </div>
                      )
                    }

                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <div className="flex">
                      {sqlGenerated && (
                        <>
                          <button
                            onClick={() => {
                              setQuery(assistantSQL);
                              setModalIsOpen(false);
                              setSqlGenerated(false);
                              setAssistantQuery("");
                              setAssistantSQL("");
                            }}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Use
                          </button></>
                      )}
                      <button
                        type="submit"
                        onClick={handleAssistantSubmit}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Generate
                        <BsMagic className="ml-1 my-auto" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setModalIsOpen(false);
                        setAssistantQuery("");
                        setAssistantSQL("");
                        setSqlGenerated(false);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div >
        )}


      </div >
      <Toaster position="bottom-center" />
    </>
  );
};

export default DuckDBComponent;