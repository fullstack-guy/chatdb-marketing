const TableList = ({ filteredTables }) => {
    return (
        <>
            {
                filteredTables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredTables.map((table, tableIndex) => (
                            <div key={tableIndex} className="border rounded-lg shadow-sm p-4">
                                <h3 className="text-xl font-semibold text-black mb-2">{table.tableName}</h3>
                                <div className="table-wrapper max-h-96 overflow-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                                                    Field
                                                </th>
                                                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                                                    Data Type
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {table.fields.map((field, fieldIndex) => (
                                                <tr key={fieldIndex} className={fieldIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{field.fieldName}</div>
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{field.dataType}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {table?.description && (
                                    <p className="text-sm my-4 text-gray-600">{table.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-4 text-gray-700">
                        No matching tables found.
                    </div>
                )
            }
        </>
    );
}

export default TableList;