import React from 'react';
import Modal from 'react-modal';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

const TablePreviewModal = ({ isOpen, onClose, data, tableName }) => {
    const columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({
        key: key,
        name: key,
        resizable: true,
        sortable: true,
        width: 120,
    })) : [];

    const rows = data.map((row, rowIndex) => ({
        id: rowIndex,
        ...row
    }));

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-full"
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
            </div>
        </Modal>
    );
};

export default TablePreviewModal;
