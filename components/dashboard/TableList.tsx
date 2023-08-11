import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

const colors = [
  "#FADDB4",
  "#FEE0C5",
  "#FCE8D7",
  "#FFF0D2",
  "#FAF3D4",
  "#D1F2EB",
  "#C7E9C0",
  "#DCFCE7",
  "#FFF4E6",
  "#FFD8CB",
  "#F9DBE0",
  "#FCE3D7",
  "#FFF1DD",
  "#FFEFB7",
  "#FDEAC2",
  "#D2FAF7",
  "#C1ECE6",
  "#E6F9F2",
  "#FFF8EC",
  "#FFE6E1",
];

const spinnerColors = [
  "#D19E6F",
  "#D5AB83",
  "#D2A18B",
  "#D9B682",
  "#D4C875",
  "#97BCAA",
  "#9FB17E",
  "#A9D6A9",
  "#D9BE95",
  "#D5A58B",
  "#D0A0B3",
  "#D1AB95",
  "#D9C17A",
  "#D9CE77",
  "#D4B685",
  "#95C2CE",
  "#8EB9B2",
  "#AED8BF",
  "#D9C29A",
  "#D1A0A3",
];

const TableList = ({ filteredTables, onTableClick }) => {
  const [tableColorIndexes, setTableColorIndexes] = useState({});
  const [loadingTable, setLoadingTable] = useState(null);

  useEffect(() => {
    const newColorIndexes = { ...tableColorIndexes };
    filteredTables.forEach((table, tableIndex) => {
      if (!newColorIndexes[table.tableName]) {
        newColorIndexes[table.tableName] = tableIndex % colors.length;
      }
    });
    setTableColorIndexes(newColorIndexes);
  }, [filteredTables]);

  const sortedFilteredTables = filteredTables.sort((a, b) => {
    return a.schemaName.localeCompare(b.schemaName);
  });

  console.log(filteredTables)

  return (
    <>
      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {sortedFilteredTables.map((table) => (
            <div
              key={table.tableName}
              className="relative flex transform cursor-pointer items-center rounded-lg border p-4 shadow-sm transition-colors duration-200 hover:scale-105 hover:bg-gray-100"
              onClick={() => onTableClick(`${table.schemaName}.${table.tableName}`)}
            >
              <div
                className="mr-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors[tableColorIndexes[table.tableName]],
                }}
              >
                {loadingTable === table.tableName && (
                  <TailSpin
                    height={50}
                    width={50}
                    color={spinnerColors[tableColorIndexes[table.tableName]]}
                    radius={2}
                    visible={true}
                    ariaLabel="tail-spin-loading"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-semibold text-black">
                  {table.tableName}
                </h3>
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {table.schemaName}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-700">
          No matching tables found.
        </div>
      )}
      <Toaster position="bottom-center" />
    </>
  );
};

export default TableList;
