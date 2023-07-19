import { useState } from "react";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { BsTable } from "react-icons/bs";
import Link from "next/link";

const Sidebar = ({ filteredTables }) => {
  const [openLists, setOpenLists] = useState([]);
  const [isTablesDropdownOpen, setTablesDropdownOpen] = useState(false);
  const [isSavedQueriesOpen, setSavedQueriesOpen] = useState(false);

  const toggleTablesDropdown = () => {
    setTablesDropdownOpen(!isTablesDropdownOpen);
    setOpenLists([]);
  };

  const toggleList = (list) => {
    if (openLists.includes(list)) {
      setOpenLists(openLists.filter((item) => item !== list));
    } else {
      setOpenLists([...openLists, list]);
    }
  };
  const toggleSavedQueries = () => {
    setSavedQueriesOpen(!isSavedQueriesOpen);
  };

  const renderList = (tableData, key) => {
    const tableName = tableData.tableName;
    const tableFields = tableData.fields;

    const isOpen = openLists.includes(tableName);
    const handleClick = () => toggleList(tableName);
    const IconComponent = isOpen ? AiOutlineDown : AiOutlineRight;

    return (
      <>
        <Link
          key={key}
          href=""
          className="group flex items-center text-gray-900 transition duration-75 dark:text-white"
          onClick={handleClick}
        >
          {/* <IconComponent className="text-gray-400" size={12} /> */}
          <span className="text-md font-md ml-3 text-black">
            {tableName}
          </span>
        </Link>
        {/* {isOpen && (
          <div className="m-2">
            <div className="flex items-center">
              <div
                className="left-1/2 -ml-0.5 w-0.5 bg-gray-400"
                style={{ height: tableFields?.length * 20 }}
              ></div>
              <div className="flex flex-col">
                {tableFields?.length > 0 &&
                  tableFields?.map((field, index) => (
                    <span
                      key={index}
                      className="font-xs ml-3 text-sm text-black"
                    >
                      <strong className="text-sm font-bold text-gray-700">
                        {field.fieldName}
                      </strong>
                      <span
                        className={`badge badge-sm ml-2 bg-[gray-700] text-white`}
                      >
                        {field.dataType}
                      </span>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )} */}
      </>
    );
  };

  const renderSchema = (schema, tables) => {
    const isOpen = openLists.includes(schema);
    const handleClick = () => toggleList(schema);
    const IconComponent = isOpen ? AiOutlineDown : AiOutlineRight;

    return (
      <div key={schema}>
        <button
          className="group flex items-center justify-left w-full py-3 px-3 rounded bg-gray-600 my-1 transition duration-75 text-white dark:text-white"
          onClick={handleClick}
        >
          <div className="ml-2 flex items-center">
            <BsTable className="mr-2 text-white" />
            <span className="text-md font-medium">{schema}</span>
          </div>
        </button>
        {isOpen && (
          <div className="pl-6">
            {tables.map((table, index) => renderList(table, index))}
          </div>
        )}
      </div>
    );
  };

  const tablesBySchema = filteredTables.reduce((acc, table) => {
    const { schemaName } = table;
    if (!acc[schemaName]) {
      acc[schemaName] = [];
    }
    acc[schemaName].push(table);
    return acc;
  }, {});

  return (
    <aside
      id="separator-sidebar"
      className="left-0 top-0 z-40 h-auto w-64 -translate-x-full border-r-2 border-stone-300 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800 d-flex flex-column justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="mb-3 text-xl font-medium text-gray-800">
            SCHEMAS
          </span>
        </div>

        {Object.entries(tablesBySchema).map(([schema, tables]) =>
          renderSchema(schema, tables)
        )}
        <Link
          href="#"
          className="group mt-4 flex items-center space-y-2 border-t border-gray-200 p-2 pt-4 text-gray-900 transition duration-75 dark:text-white"
          onClick={toggleSavedQueries}
        >
          {/* {isSavedQueriesOpen ? (
            <AiOutlineDown color='gray' fontSize={12} />
          ) : (
            <AiOutlineRight color='gray' fontSize={12} />
          )} */}
          {/* <span className="ml-3 text-md font-medium text-gray-800">SAVED QUERIES</span> */}
        </Link>
        {/* {isSavedQueriesOpen && (
          <div className="pl-6">
            <div className="flex items-center text-gray-900 transition duration-75 dark:text-white group">
              <div className="w-8 h-4 bg-orange-500 flex-shrink-0">
                <span className="flex items-center justify-center text-xs font-semibold text-white">SQL</span>
              </div>
              <span className="ml-3 text-sm font-xs text-gray-400">All Active User</span>
            </div>
            <div className="flex items-center text-gray-900 transition duration-75 dark:text-white group">
              <div className="w-8 h-4 bg-orange-500 flex-shrink-0">
                <span className="flex items-center justify-center text-xs font-semibold text-white">SQL</span>
              </div>
              <span className="ml-3 text-sm font-xs text-gray-400">Top Projects</span>
            </div>
          </div>
        )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
