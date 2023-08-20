import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { Roboto_Mono } from "next/font/google";
import { PuffLoader } from "react-spinners";
import debounce from "lodash/debounce";

const roboto = Roboto_Mono({ subsets: ["latin"] });

const TableEditor = ({ tableName, database_token, database_uuid }) => {
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
      const response = await axios.post("/api/db/preview", {
        table_name: tableName,
        connectionStringToken: database_token,
        order_by: sortColumn
          ? `${sortColumn} ${sortDirection.toUpperCase()}`
          : undefined,
        pageNumber: pageNumber,
        where_clause: whereClause,
      });

      if (response && response.data) {
        setTableRows(response.data);
        const columns =
          response.data.length > 0
            ? Object.keys(response.data[0]).map((key) => ({
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
    <div className="max-h-full w-full h-full overflow-x-auto flex flex-col"> {/* Added flex and flex-col */}
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
            className={`rdg-light w-full h-[60vh] ${roboto.className}`}
            columns={columns}
            rows={transformedRows}
          />

          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center"> {/* Added items-center */}
              <div className="join-item btn-sm text-black btn btn-outline mx-2" onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}>«</div>
              <span className="mx-2 text-black">Page {pageNumber}</span>
              <button className="join-item btn-sm text-black btn btn-outline mx-2" onClick={() => setPageNumber(prev => prev + 1)}>»</button>
            </div>
            <span className="mt-2 text-sm">Showing {transformedRows.length} results</span>
          </div>


          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <CSVLink
                className="rounded px-4 py-2 text-black shadow"
                filename={`${tableName}.csv`}
                data={transformedRows}
                headers={columns.map((column) => ({
                  label: column.name,
                  key: column.key,
                }))}
              >
                Export CSV
              </CSVLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableEditor;
