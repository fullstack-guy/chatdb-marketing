import React from "react";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { CSVLink } from "react-csv";
import { Roboto_Mono } from "next/font/google";

const roboto = Roboto_Mono({ subsets: ["latin"] });

const TableEditor = ({ tableRows, tableName }) => {
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

  const rows = tableRows.map((row, rowIndex) => {
    let newRow = { ...row }; // Make a copy of the row
    // Loop over each key in the row
    for (let key in newRow) {
      // If the value of a key is an object, convert it to a JSON string
      if (typeof newRow[key] === "object" && newRow[key] !== null) {
        newRow[key] = JSON.stringify(newRow[key]);
      }
    }

    return {
      id: rowIndex,
      ...newRow,
    };
  });

  const rowCount = rows.length;

  const headers = columns.map((column) => ({
    label: column.name,
    key: column.key,
  }));

  return (
    <div className="max-h-full w-full overflow-x-auto">
      <DataGrid
        className={`rdg-light w-100% ${roboto.className}`}
        columns={columns}
        rows={rows}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <CSVLink
            className="rounded px-4 py-2 text-black shadow"
            filename={`${tableName}.csv`}
            data={rows}
            headers={headers}
          >
            Export CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
