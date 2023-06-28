import React, { useState, useCallback, useEffect } from "react";
import DataGrid from "react-data-grid";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import Layout from "../../../components/Layout";
import { AiOutlineCloudDownload } from "react-icons/ai";
import "react-data-grid/lib/styles.css";
import "react-contexify/dist/ReactContexify.css";
import { Toaster, toast } from "react-hot-toast";
import { useContextMenu, Menu, Item, Separator, ItemParams } from "react-contexify";
import TextEditor from "../../../components/spreadsheet/TextEditor";

const Page = () => {
    const [history, setHistory] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const MENU_ID = `cell-menu`;
    const { show } = useContextMenu({
        id: MENU_ID,
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                // 10MB
                toast.error(
                    "File is too large! Please upload a file smaller than 10MB."
                );
                return;
            }

            Papa.parse(file, {
                header: true,
                complete: function (results) {
                    const formattedData = results.data.map((row, idx) => {
                        let rowData = { "#": idx };
                        Object.entries(row).forEach(([key, value]) => {
                            rowData[key] = idx === 0 ? key : value;
                        });
                        return rowData;
                    });

                    // Dynamically generate columns using CSV headers
                    if (formattedData[0]) {
                        const columns = [
                            ...Object.keys(formattedData[0]).map((key) => ({
                                key,
                                name: key,
                                editable: true,
                                width: "max-content",
                                resizable: true,
                                renderEditCell: TextEditor,
                            })),
                        ];
                        setColumns(columns);
                    }

                    setData(formattedData.slice(1));
                },
            });
        }
    };

    const handleDataChange = (newRows, { indexes, column }) => {
        setData(data.map((row, i) => (i === indexes[0] ? newRows[0] : row)));
        setHistory((currentHistory) => [newRows, ...currentHistory]);
    };

    function insertRow(insertRowIdx: number) {
        let newRow = {};
        if (data[insertRowIdx]) {
            newRow = Object.fromEntries(
                Object.keys(data[insertRowIdx]).map((key) => [key, ""])
            );
        } else if (data[insertRowIdx - 1]) {
            newRow = Object.fromEntries(
                Object.keys(data[insertRowIdx - 1]).map((key) => [key, ""])
            );
        }

        setData([
            ...data.slice(0, insertRowIdx),
            newRow,
            ...data.slice(insertRowIdx),
        ]);
    }

    const handleDelete = useCallback(
        (rowIdx) => {
            // Delete the selected row
            const newData = data.filter((_, index) => index !== rowIdx);
            setData(newData);
            setHistory((currentHistory) => [newData, ...currentHistory]);
        },
        [data]
    );

    const displayMenu = (e, row, rowIndex) => {
        show({ event: e.nativeEvent, props: { row, rowIndex } });
        e.stopPropagation();
        e.preventDefault();
    };

    const handleItemClick = ({ event, props, data }: ItemParams<any, any>) => {
        const { rowIndex } = props;
        const id = data;
        switch (id) {
            case "insert-above":
                insertRow(rowIndex);
                break;
            case "insert-below":
                insertRow(rowIndex + 1);
                break;
            case "delete":
                handleDelete(rowIndex);
                break;
        }
    };

    const undo = useCallback(() => {
        setHistory((currentHistory) => {
            if (currentHistory.length > 1) {
                const [lastAction, ...remainingHistory] = currentHistory;
                setRedoStack((currentRedoStack) => [lastAction, ...currentRedoStack]);
                setData(remainingHistory[0]);
                return remainingHistory;
            }
            return currentHistory;
        });
    }, []);

    const redo = useCallback(() => {
        setRedoStack((currentRedoStack) => {
            if (currentRedoStack.length > 0) {
                const [lastRedoAction, ...remainingRedoStack] = currentRedoStack;
                setData(lastRedoAction);
                setHistory((currentHistory) => [lastRedoAction, ...currentHistory]);
                return remainingRedoStack;
            }
            return currentRedoStack;
        });
    }, []);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.ctrlKey || event.metaKey) {
                if (event.key === "z" && !event.shiftKey) {
                    undo();
                } else if (event.key === "z" && event.shiftKey) {
                    redo();
                }
            }
        },
        [undo, redo]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <Layout
            title="CSV Editor and Viewer | ChatDB"
            description="Free online CSV Editor and Viewer by ChatDB. Easily upload, view, and edit your CSV files."
            url="https://www.chatdb.ai/tools/csv-editor"
            oggURL="https://www.chatdb.ai/_next/image?url=images/csv-editor-ogg.png&w=1200&q=75"
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
                            headers={Object.keys(data[0])}
                            data={data.map((row) => Object.values(row))}
                            filename="export.csv"
                            className="mt-4 inline-block flex items-center rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-900 sm:mt-0"
                        >
                            <AiOutlineCloudDownload />
                        </CSVLink>
                    )}
                </div>
                {data.length > 0 && (
                    <div className="mx-10 mt-10 flex max-h-screen w-full items-center justify-center">
                        <DataGrid
                            className="rdg-light"
                            columns={columns}
                            rows={data}
                            onRowsChange={handleDataChange}
                            onCellContextMenu={({ row }, event) => {
                                const rowIndex = data.indexOf(row);
                                displayMenu(event, row, rowIndex);
                            }}
                        />
                    </div>
                )}

                <Menu id={MENU_ID}>
                    <Item id="insert-above" onClick={handleItemClick}>
                        Insert row above
                    </Item>
                    <Item id="insert-below" onClick={handleItemClick}>
                        Insert row below
                    </Item>
                    <Separator />
                    <Item id="delete" onClick={handleItemClick}>
                        Delete row
                    </Item>
                </Menu>
            </div>
            <h2 className="mb-4 mt-20 text-center text-4xl font-bold text-black">
                What is a CSV file?
            </h2>
            <p className="mb-4 text-center text-lg">
                CSV (Comma Separated Values) is a simple file format used to store
                tabular data, like a spreadsheet or database. CSV files can be easily
                imported and exported from various applications including, but not
                limited to databases and spreadsheets.
            </p>
            <Toaster position="bottom-center" />
        </Layout>
    );
};

export default Page;
