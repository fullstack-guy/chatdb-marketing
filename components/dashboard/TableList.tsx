import React, { useState } from 'react';
import axios from 'axios';
import TablePreviewModal from './TablePreviewModal';

const colors = [
  '#FADDB4', '#FEE0C5', '#FCE8D7', '#FFF0D2', '#FAF3D4',
  '#D1F2EB', '#C7E9C0', '#DCFCE7', '#FFF4E6', '#FFD8CB',
  '#F9DBE0', '#FCE3D7', '#FFF1DD', '#FFEFB7', '#FDEAC2',
  '#D2FAF7', '#C1ECE6', '#E6F9F2', '#FFF8EC', '#FFE6E1'
];

const TableList = ({ database_token, filteredTables }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTableData, setPreviewTableData] = useState([]);
  const [selectedTableName, setSelectedTableName] = useState('');

  const openPreviewModal = async (tableData) => {
    try {
      const response = await axios.post('/api/preview', {
        connectionStringToken: database_token,
        table_name: tableData.tableName
      });
      const data = response.data;

      setPreviewTableData(data);
      setSelectedTableName(tableData.tableName);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closePreviewModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredTables.map((table, tableIndex) => (
            <div
              key={table.tableName}
              className="relative flex items-center rounded-lg border p-4 shadow-sm cursor-pointer transition-colors duration-200 hover:bg-gray-100 hover:scale-105 transform"
              onClick={() => openPreviewModal(table)}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mr-4"
                style={{ backgroundColor: colors[tableIndex % colors.length] }}
              >
                {/* Placeholder for emoji image */}
                <span className="text-white text-xl"></span>
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
          data={previewTableData}
          tableName={selectedTableName}
        />
      )}
    </>
  );
};

export default TableList;
