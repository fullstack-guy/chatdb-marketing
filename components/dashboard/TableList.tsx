import { BsThreeDots } from "react-icons/bs";

const TableList = ({ filteredTables }) => {
  return (
    <>
      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredTables.map((table, tableIndex) => (
            <div
              key={tableIndex}
              className="relative rounded-lg border p-4 shadow-sm"
            >
              <div className="absolute top-2 right-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <BsThreeDots size={20} />
                </button>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-black">
                {table.tableName}
              </h3>
              <div className="table-wrapper max-h-96 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="sticky top-0 bg-gray-700 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">
                        Field
                      </th>
                      <th className="sticky top-0 bg-gray-700 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100">
                        Data Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.fields.map((field, fieldIndex) => (
                      <tr
                        key={fieldIndex}
                        className={
                          fieldIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }
                      >
                        <td className="whitespace-nowrap px-6 py-3">
                          <div className="text-sm text-gray-900">
                            {field.fieldName}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <div className="text-sm text-gray-900">
                            {field.dataType}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table?.description && (
                <p className="my-4 text-sm text-gray-600">
                  {table.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-700">
          No matching tables found.
        </div>
      )}
    </>
  );
};

export default TableList;
