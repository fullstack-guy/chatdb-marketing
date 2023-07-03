import React, { useEffect } from "react";
import Modal from "react-modal";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { CSVLink } from "react-csv";
import { Roboto_Mono } from 'next/font/google'

const roboto = Roboto_Mono({ subsets: ['latin'] })

const TablePreviewModal = ({ isOpen, onClose, tableRows, tableName }) => {
  useEffect(() => {
    // Keep the original overflow value
    const originalOverflow = document.body.style.overflow;

    // disable body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const columns =
    tableRows.length > 0
      ? Object.keys(tableRows[0]).map((key) => ({
        key: key,
        name: key,
        resizable: true,
        sortable: true,
        width: 120,
        headerRenderer: ({ column }) => (
          <div className="header-cell">
            <div className="name">{column.name}</div>
            <div className="data-type">{typeof tableRows[0][column.key]}</div>
          </div>
        ),
      }))
      : [];

  const rows = tableRows.map((row, rowIndex) => ({
    id: rowIndex,
    ...row,
  }));

  const handleQueryClick = () => {
    onClose();
  };

  const rowCount = rows.length;

  const headers = columns.map((column) => ({
    label: column.name,
    key: column.key,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed left-1/2 top-1/2 max-w-5xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      contentLabel="Table Preview"
    >
      <div className="max-h-full w-full overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-center text-xl font-bold text-black">
            {tableName} Preview
          </h2>
          <button
            className="ml-auto text-gray-500 hover:text-gray-700"
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

        <DataGrid className={`rdg-light w-100% ${roboto.className}`} columns={columns} rows={rows} />
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="mb-2 text-gray-600 md:mb-0">
            Showing {rowCount} rows.
          </div>
          <div className="flex flex-wrap gap-4">
            <CSVLink
              className="rounded px-4 py-2 text-black shadow"
              filename={`${tableName}.csv`}
              data={rows}
              headers={headers}
            >
              Export CSV
            </CSVLink>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white shadow"
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
