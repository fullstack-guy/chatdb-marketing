import React, { useState, useEffect } from 'react';
import TablePreviewModal from './TablePreviewModal';
import { Toaster, toast } from "react-hot-toast";
import { TailSpin } from 'react-loader-spinner'
import axios from 'axios';

const colors = [
  '#FADDB4', '#FEE0C5', '#FCE8D7', '#FFF0D2', '#FAF3D4',
  '#D1F2EB', '#C7E9C0', '#DCFCE7', '#FFF4E6', '#FFD8CB',
  '#F9DBE0', '#FCE3D7', '#FFF1DD', '#FFEFB7', '#FDEAC2',
  '#D2FAF7', '#C1ECE6', '#E6F9F2', '#FFF8EC', '#FFE6E1'
];

const spinnerColors = [
  '#D19E6F', '#D5AB83', '#D2A18B', '#D9B682', '#D4C875',
  '#97BCAA', '#9FB17E', '#A9D6A9', '#D9BE95', '#D5A58B',
  '#D0A0B3', '#D1AB95', '#D9C17A', '#D9CE77', '#D4B685',
  '#95C2CE', '#8EB9B2', '#AED8BF', '#D9C29A', '#D1A0A3'
];

const TableList = ({ database_token, filteredTables }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTableData, setPreviewTableData] = useState([]);
  const [selectedTableName, setSelectedTableName] = useState('');
  const [tableColorIndexes, setTableColorIndexes] = useState({});

  // table loading state
  const [loadingTable, setLoadingTable] = useState(null);
  const [error, setError] = useState(null);

  const openPreviewModal = async (tableData) => {
    setLoadingTable(tableData.tableName);
    setError(null);

    try {
      const response = await axios.post('/api/db/preview', {
        connectionStringToken: database_token,
        table_name: tableData.tableName
      });
      const data = response.data;

      setPreviewTableData(data);
      setSelectedTableName(tableData.tableName);
      setModalOpen(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Sorry, you we couldn't read from the database. Try refreshing the page.");
        setError("Unauthorized");
      } else {
        toast.error("Sorry, we had an issue querying the database!")
        setError(error.message);
      }
    } finally {
      setLoadingTable(null);
    }
  };

  useEffect(() => {
    const newColorIndexes = { ...tableColorIndexes };
    filteredTables.forEach((table, tableIndex) => {
      if (!newColorIndexes[table.tableName]) {
        newColorIndexes[table.tableName] = tableIndex % colors.length;
      }
    });
    setTableColorIndexes(newColorIndexes);
  }, [filteredTables]);

  const closePreviewModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredTables.map((table) => (
            <div
              key={table.tableName}
              className="relative flex items-center rounded-lg border p-4 shadow-sm cursor-pointer transition-colors duration-200 hover:bg-gray-100 hover:scale-105 transform"
              onClick={() => openPreviewModal(table)}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mr-4"
                style={{ backgroundColor: colors[tableColorIndexes[table.tableName]] }}
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
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {table.tableName}
                </h3>
                <p className="text-sm text-gray-600">
                  {table.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-700">
          No matching tables found.
        </div>
      )}
      {modalOpen && (
        <TablePreviewModal
          isOpen={modalOpen}
          onClose={closePreviewModal}
          tableRows={previewTableData}
          tableName={selectedTableName}
        />
      )}
      <Toaster position="bottom-center" />
    </>
  )
};

export default TableList;
