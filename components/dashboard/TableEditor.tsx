import React, { useState, useEffect } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { Roboto_Mono } from "next/font/google";
import { FaSync } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { PuffLoader } from "react-spinners";
import debounce from "lodash/debounce";
import { useAuth } from "@clerk/nextjs";

const roboto = Roboto_Mono({ subsets: ["latin"] });

const TableEditor = ({ tableName, database_uuid }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const initialTableEditorState = {
    sortColumn: null,
    sortDirection: null,
    whereClause: "",
  };

  const [sortColumn, setSortColumn] = useState(
    initialTableEditorState.sortColumn
  );
  const [sortDirection, setSortDirection] = useState(
    initialTableEditorState.sortDirection
  );
  const [whereClause, setWhereClause] = useState(
    initialTableEditorState.whereClause
  );

  //to store TableEditor state in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      `tableEditorState_${tableName}`,
      JSON.stringify({
        sortColumn,
        sortDirection,
        pageNumber,
        whereClause,
      })
    );
  }, [sortColumn, sortDirection, pageNumber, whereClause, tableName]);

  const fetchDataDebounced = debounce(async () => {
    setIsLoading(true);

    try {
      const token = await auth.getToken();
      const url = "/fastify/api/db/preview";
      const data = {
        database_uuid,
        table_name: tableName,
        order_by: sortColumn
          ? `${sortColumn} ${sortDirection.toUpperCase()}`
          : undefined,
        pageNumber: pageNumber,
        where_clause: whereClause,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData) {
        setTableRows(responseData);
        const columns =
          responseData.length > 0
            ? Object.keys(responseData[0]).map((key) => ({
              key: key,
              name: key,
              sortable: true,
              editable: key === "id" ? false : true,
              headerRenderer: (props) => (
                <div
                  onClick={() =>
                    handleSort(key, sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  {props.column.name}{" "}
                  {sortDirection &&
                    sortColumn === key &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountDownAlt />
                    ) : (
                      <FaSortAmountUpAlt />
                    ))}
                </div>
              ),
              resizable: true,
            }))
            : [];
        setColumns(columns);
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }, 500); // 500ms delay

  useEffect(() => {
    fetchDataDebounced();

    // Clean up: cancel the debounced call if the component is unmounted before the call is made
    return () => {
      fetchDataDebounced.cancel();
    };
  }, [sortColumn, sortDirection, pageNumber, whereClause]);

  const handleSort = (columnKey, direction) => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  const transformRows = (tableRows) => {
    return tableRows.map((row, rowIndex) => {
      let newRow = { ...row };
      for (let key in newRow) {
        if (typeof newRow[key] === "object" && newRow[key] !== null) {
          newRow[key] = JSON.stringify(newRow[key]);
        } else if (typeof newRow[key] === "boolean") {
          newRow[key] = newRow[key] ? "true" : "false";
        }
      }
      return {
        id: rowIndex,
        ...newRow,
      };
    });
  };

  const transformedRows = transformRows(tableRows);

  return (
    <div className="flex h-full max-h-full w-full flex-col overflow-hidden">
      {" "}
      {/* Added flex and flex-col */}
      {isLoading ? (
        <div className="m-auto">
          <PuffLoader
            className="m-auto mt-2"
            color="#123abc"
            loading={true}
            size={50}
          />
        </div>
      ) : (
        <>
          <DataGrid
            className={`rdg-light h-[100%] max-h-[60vh] w-full ${roboto.className}`}
            columns={columns}
            rows={transformedRows}
          />

          <div className="m-4 flex items-center justify-between px-4">
            <div className="flex items-center">
              <div
                className="join-item btn-outline btn-sm btn mx-2 text-black"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              >
                «
              </div>
              <span className="mx-2 text-black">Page {pageNumber}</span>
              <button
                className="join-item btn-outline btn-sm btn mx-2 text-black"
                onClick={() => setPageNumber((prev) => prev + 1)}
              >
                »
              </button>
            </div>
            <span className="mt-2 text-sm">
              Showing {transformedRows.length} results
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchDataDebounced}
                className="rounded px-4 py-2 text-black shadow"
              >
                <div className="tooltip tooltip-bottom" data-tip="Refresh">
                  <FaSync />
                </div>
              </button>
              <CSVLink
                className="rounded px-4 py-2 text-black shadow"
                filename={`${tableName}.csv`}
                data={transformedRows}
                headers={columns.map((column) => ({
                  label: column.name,
                  key: column.key,
                }))}
              >
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Download as CSV"
                >
                  <BsDownload />
                </div>
              </CSVLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableEditor;
