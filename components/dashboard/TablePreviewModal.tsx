import React, { useEffect } from 'react';
import Modal from 'react-modal';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { CSVLink } from "react-csv";

const TablePreviewModal = ({ isOpen, onClose, data, tableName }) => {
    useEffect(() => {
        // disable body scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);
    const columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({
        key: key,
        name: key,
        resizable: true,
        sortable: true,
        width: 120,
        headerRenderer: ({ column }) => (
            <div className="header-cell">
                <div className="name">{column.name}</div>
                <div className="data-type">{typeof data[0][column.key]}</div>
            </div>
        ),
    })) : [];

    const rows = data.map((row, rowIndex) => ({
        id: rowIndex,
        ...row
    }));

    const handleQueryClick = () => {
        onClose();
    }

    const rowCount = rows.length;

    const headers = columns.map(column => ({ label: column.name, key: column.key }));

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            contentLabel="Table Preview"
        >
            <div className="w-full max-h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-center text-black text-xl font-bold">{tableName} Preview</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 ml-auto"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <DataGrid className="rdg-light" columns={columns} rows={rows} />
                <div className="flex flex-wrap justify-between mt-4 items-center">
                    <div className="text-gray-600 mb-2 md:mb-0">
                        Showing {rowCount} rows.
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <CSVLink
                            className="py-2 px-4 text-black rounded shadow"
                            filename={`${tableName}.csv`}
                            data={rows}
                            headers={headers}
                        >
                            Export CSV
                        </CSVLink>
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded shadow"
                            onClick={handleQueryClick}
                        >
                            Query
                        </button>
                    </div>
                </div>
            </div>

        </Modal>
    );
};

export default TablePreviewModal;
