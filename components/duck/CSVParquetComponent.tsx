import { useState, useEffect } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { Toaster, toast } from "react-hot-toast";

const CSVParquetComponent = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
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
        const tempFile = "my_data.csv";
        const tableName = "my_csv";

        if (db) {
            await db.reset();
        } else {
            return;
        }

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

    const convertCsvToParquet = async () => {
        const tableName = "my_csv";
        await connection.query(`COPY (SELECT * FROM ${tableName}) TO '/tmp/duckdbexportparquet/export.parquet' (FORMAT 'parquet', CODEC 'GZIP')`);

        // Check if the parquet file is successfully exported
        const results = await db.globFiles('/tmp/duckdbexportparquet/*');

        if (results.length === 0) {
            console.error("Error: No exported files found.");
            toast("An error occurred while exporting to Parquet.");
            return;
        }

        const parquetBuffer = await db.copyFileToBuffer('/tmp/duckdbexportparquet/export.parquet');

        // Convert the buffer to a Blob and trigger a download
        const blob = new Blob([parquetBuffer], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "output.parquet";

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="mb-10 mt-10 flex w-full max-w-xs flex-col items-start sm:flex-row sm:items-center">
                <input
                    accept=".csv"
                    className="file-input-bordered file-input file-input-md mb-4 w-full sm:mb-0 sm:mr-4"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>

            {
                isFileReady && (
                    <div className="flex">
                        <button
                            className="my-3 mr-2 rounded-lg bg-gray-700 px-4 py-2 font-bold text-white" // Added mr-2 to add spacing between buttons
                            onClick={convertCsvToParquet}
                        >
                            Save as Parquet
                        </button>
                    </div>
                )
            }

            {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
            <Toaster position="bottom-center" />
        </>
    );
};

export default CSVParquetComponent;
