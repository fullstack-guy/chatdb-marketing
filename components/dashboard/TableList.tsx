import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

const colors = [
  "#C1ECE6",
  "#C7E9C0",
  "#FEE0C5",
  "#FCE8D7",
  "#FFF0D2",
  "#FAF3D4",
  "#D1F2EB",
  "#DCFCE7",
  "#FFF4E6",
  "#FFD8CB",
  "#F9DBE0",
  "#FCE3D7",
  "#FADDB4",
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
    const schemaNames = filteredTables
      .map((table) => table.schemaName)
      .filter((schema, index, self) => self.indexOf(schema) === index);

    const newColorIndexes = schemaNames.reduce(
      (acc: Record<string, number>, schema, index) => {
        acc[schema] = index % colors.length;
        return acc;
      },
      {}
    );

    setTableColorIndexes(newColorIndexes);
  }, [filteredTables]);

  const sortedFilteredTables = filteredTables.sort((a, b) => {
    // Prioritize public schema
    if (a.schemaName === "public" && b.schemaName !== "public") {
      return -1;
    } else if (a.schemaName !== "public" && b.schemaName === "public") {
      return 1;
    }

    // Otherwise, do a regular alphanumeric sort
    return a.schemaName.localeCompare(b.schemaName);
  });

  const getSchemaSections = (
    tables: Array<{ schemaName: string; tableName: string }>
  ) => {
    const sections: Record<string, any[]> = {};

    tables.forEach((table) => {
      if (!sections[table.schemaName]) {
        sections[table.schemaName] = [];
      }
      sections[table.schemaName].push(table);
    });

    return sections;
  };

  const schemaSections = getSchemaSections(sortedFilteredTables);

  return (
    <>
      {filteredTables.length > 0 ? (
        Object.entries(schemaSections).map(([schema, tables]) => (
          <div key={schema} className="my-6">
            <h2 className="mb-4 text-2xl font-bold text-black">{schema}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {tables.map((table) => (
                <div
                  key={table.tableName}
                  className="relative flex transform cursor-pointer items-center rounded-lg border p-4 shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-gray-100"
                  onClick={() =>
                    onTableClick(`${table.schemaName}.${table.tableName}`)
                  }
                >
                  <div
                    className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        colors[tableColorIndexes[table.schemaName]],
                    }}
                  >
                    {loadingTable === table.tableName && (
                      <TailSpin
                        height={50}
                        width={50}
                        color={
                          spinnerColors[tableColorIndexes[table.schemaName]]
                        }
                        radius={2}
                        visible={true}
                        ariaLabel="tail-spin-loading"
                      />
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-lg font-semibold text-black">
                      {table.tableName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
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
