import React, { useState, useCallback, useEffect } from "react";
import Spreadsheet from "react-spreadsheet";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import Layout from "../../../components/Layout";
import { AiOutlineCloudDownload } from "react-icons/ai";
import CustomRowIndicator from "../../../components/spreadsheet/CustomRowIndicator";

const Page = () => {
    const initialData = Array.from({ length: 20 }, () =>
        Array.from({ length: 10 }, () => ({ value: "" }))
    );
    const [data, setData] = useState(initialData);
    const [history, setHistory] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            Papa.parse(file, {
                complete: function (results) {
                    const formattedData = results.data.map((row) => {
                        return Object.keys(row).map((key) => ({ value: row[key] }));
                    });
                    setData(formattedData);
                    setHistory([formattedData]); // set initial state in history
                },
            });
        }
    };

    const handleDataChange = useCallback((newData) => {
        setData(newData);
        setHistory((currentHistory) => [newData, ...currentHistory]);
    }, []);

    const handleInsertAbove = useCallback(
        (row) => {
            // Insert a new row above the selected row
            const newData = [
                ...data.slice(0, row),
                new Array(data[0].length).fill({ value: "" }), // assumes rows have same length
                ...data.slice(row),
            ];
            setData(newData);
            setHistory((currentHistory) => [newData, ...currentHistory]);
        },
        [data]
    );

    const handleInsertBelow = useCallback(
        (row) => {
            // Insert a new row below the selected row
            const newData = [
                ...data.slice(0, row + 1),
                new Array(data[0].length).fill({ value: "" }), // assumes rows have same length
                ...data.slice(row + 1),
            ];
            setData(newData);
            setHistory((currentHistory) => [newData, ...currentHistory]);
        },
        [data]
    );

    const handleDelete = useCallback(
        (row) => {
            // Delete the selected row
            const newData = data.filter((_, index) => index !== row);
            setData(newData);
            setHistory((currentHistory) => [newData, ...currentHistory]);
        },
        [data]
    );

    const undo = useCallback(() => {
        setHistory((currentHistory) => {
            if (currentHistory.length > 1) {
                const [, ...remainingHistory] = currentHistory;
                setData(remainingHistory[0]);
                return remainingHistory;
            }
            return currentHistory;
        });
    }, []);

    const handleKeyDown = useCallback(
        (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "z") {
                undo();
            }
        },
        [undo]
    );

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "z") {
                undo();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [undo]);

    return (
        <Layout
            title="CSV Editor and Viewer | ChatDB"
            description="Free online CSV Editor and Viewer by ChatDB. Easily upload, view, and edit your CSV files."
            url="https://www.chatdb.ai/tools/csv-editor"
        >
            <div
                className="mt-10 flex flex-col items-center p-6"
                onKeyDown={handleKeyDown}
            >
                <h1 className="mb-4 text-5xl font-bold text-black">
                    CSV Viewer and Editor
                </h1>
                <p className="mb-4 text-center text-lg">
                    Upload, view, and edit your CSV files all in one place. When you're
                    done, you can download the edited version.
                </p>
                <div className="mb-4 flex w-full max-w-xs flex-col items-start sm:flex-row sm:items-center">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="file-input-bordered file-input file-input-md mb-4 w-full sm:mb-0 sm:mr-4"
                    />
                    {data.length > 0 && (
                        <CSVLink
                            data={data.map((row) => row.map((cell) => cell.value))}
                            filename="export.csv"
                            className="mt-4 inline-block flex items-center rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-900 sm:mt-0"
                        >
                            <AiOutlineCloudDownload />
                        </CSVLink>
                    )}
                </div>
                {data.length > 0 && (
                    <div className="mx-10 mt-10 flex max-h-screen w-full items-center justify-center">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                maxHeight: "80vh",
                                overflow: "auto",
                                width: "100%",
                            }}
                        >
                            <div className="inline-block" style={{ width: "80%" }}>
                                <Spreadsheet
                                    data={data}
                                    onChange={handleDataChange}
                                    RowIndicator={(props) => (
                                        <CustomRowIndicator
                                            {...props}
                                            onInsertAbove={handleInsertAbove}
                                            onInsertBelow={handleInsertBelow}
                                            onDelete={handleDelete}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <h2 className="mb-4 mt-20 text-center text-4xl font-bold text-black">
                What is a CSV?
            </h2>
            <p className="mb-4 text-center text-lg">
                CSV (Comma Separated Values) is a simple file format used to store
                tabular data, like a spreadsheet or database. CSV files can be easily
                imported and exported from various applications including, but not
                limited to databases and spreadsheets.
            </p>
        </Layout>
    );
};

export default Page;
