import React, { useState, useCallback } from "react";
import Spreadsheet from "react-spreadsheet";
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import Layout from "../../../components/Layout";
import { AiOutlineCloudDownload } from 'react-icons/ai';
import CustomRowIndicator from "../../../components/spreadsheet/CustomRowIndicator"

const Page = () => {
    const [data, setData] = useState([]);
    const [history, setHistory] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            complete: function (results) {
                const formattedData = results.data.map(row => {
                    return Object.keys(row).map(key => ({ value: row[key] }));
                });
                setData(formattedData);
                setHistory([formattedData]); // set initial state in history
            },
        });
    }

    const handleDataChange = useCallback((newData) => {
        setData(newData);
        setHistory((currentHistory) => [newData, ...currentHistory]);
    }, []);

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

    const handleInsertAbove = useCallback((row) => {
        // Insert a new row above the selected row
        const newData = [
            ...data.slice(0, row),
            new Array(data[0].length).fill({ value: '' }),  // assumes rows have same length
            ...data.slice(row),
        ];
        setData(newData);
    }, [data]);

    const handleInsertBelow = useCallback((row) => {
        // Insert a new row below the selected row
        const newData = [
            ...data.slice(0, row + 1),
            new Array(data[0].length).fill({ value: '' }),  // assumes rows have same length
            ...data.slice(row + 1),
        ];
        setData(newData);
    }, [data]);

    const handleDelete = useCallback((row) => {
        // Delete the selected row
        const newData = data.filter((_, index) => index !== row);
        setData(newData);
    }, [data]);

    const handleKeyDown = useCallback(
        (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "z") {
                undo();
            }
        },
        [undo]
    );

    return (
        <Layout>
            <div className="flex flex-col mt-10 items-center p-6" onKeyDown={handleKeyDown}>
                <h1 className="text-5xl text-black font-bold mb-4">CSV Editor</h1>
                <p className="text-lg mb-6 text-center">Upload, view, and edit your CSV files all in one place. When you're done, you can download the edited version.</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full max-w-xs mb-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-md w-full mb-4 sm:mb-0 sm:mr-4"
                    />
                    {data.length > 0 && (
                        <CSVLink
                            data={data.map(row => row.map(cell => cell.value))}
                            filename="export.csv"
                            className="inline-block mt-4 sm:mt-0 bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <AiOutlineCloudDownload />
                        </CSVLink>
                    )}
                </div>
                {data.length > 0 && (
                    <div className="flex justify-center max-h-screen overflow-auto w-full mx-10">
                        <div className="inline-block">
                            <Spreadsheet
                                data={data}
                                onChange={handleDataChange}
                                RowIndicator={props => (
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
                )}
            </div>
        </Layout>
    );
};

export default Page;
