import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import * as duckdb from "@duckdb/duckdb-wasm";
import AceEditor from "react-ace";
import DataGrid from "react-data-grid";
import { Toaster, toast } from "react-hot-toast";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "react-data-grid/lib/styles.css";

const DuckDBComponent = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("SELECT * FROM my_csv LIMIT 10;");
    const [connection, setConnection] = useState(null);
    const [db, setDb] = useState(null);
    const [isFileReady, setIsFileReady] = useState(false);
    const [columns, setColumns] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

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
        const tempFile = "my_data";
        const tableName = "my_csv";
        await db.reset();
        const connection = await db.connect();
        setConnection(connection);
        await db.registerFileText(tempFile, csvData);
        await connection.insertCSVFromPath(tempFile, {
            name: tableName,
            schema: "main",
            header: true,
            detect: true,
        });
        setIsFileReady(true);
        setLoading(false);
    };

    const runQuery = async () => {
        try {
            if (!isFileReady) {
                console.error("File is not ready");
                toast("Sorry, the file is not ready!");
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
        <Layout
            title="CSV Editor and Viewer | ChatDB"
            description="Use ChatDB to query, view, and edit your CSV files using SQL. Upload your CSV, write an SQL query, and interact with your data. Easy to use and completely in the browser."
            url="https://www.chatdb.ai/tools/csv-editor"
            oggURL="https://www.chatdb.ai/_next/image?url=images/CSVSQL.png&w=1200&q=75"
        >
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
                <button
                    className="my-3 rounded-lg bg-gray-700 px-4 py-2 text-white"
                    onClick={runQuery}
                >
                    Run Query
                </button>
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
            </div>
            <Toaster position="bottom-center" />
        </Layout>
    );
};

export default DuckDBComponent;
