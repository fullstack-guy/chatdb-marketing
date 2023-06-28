'use client'
import { useState } from 'react';
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import ArrowRightIcon from '../../../assets/icons/RightIcon';
import TableCellIcon from '../../../assets/icons/TableCellIcon';
import Datasource from '../datasource/Datasource';

const Sidebar = ({ tables }) => {
  const [isTablesDropdownOpen, setTablesDropdownOpen] = useState(false);
  const [isSavedQueriesOpen, setSavedQueriesOpen] = useState(false);
  const [openLists, setOpenLists] = useState([]);

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

  const renderList = (tableName, tableFields, key) => {
    const isOpen = openLists.includes(tableName);
    const handleClick = () => toggleList(tableName);
    const IconComponent = isOpen ? ArrowDownIcon : ArrowRightIcon;

    return (
      <>
        <a
          key={key}
          href="#"
          className="flex items-center text-gray-900 transition duration-75 dark:text-white group"
          onClick={handleClick}
        >
          <IconComponent className="text-gray-400" fill="none" />
          <TableCellIcon className="ml-3 text-sm font-xs text-gray-400" />
          <span className="ml-3 text-sm font-xs text-gray-400">{tableName}</span>
        </a>
        {isOpen && (
          <div className="pl-7 m-2">
            <div className="flex items-center">
              <div className="left-1/2 -ml-0.5 w-0.5 bg-gray-400" style={{ height: tableFields?.length * 20 }}></div>
              <div className="flex flex-col">
                {tableFields?.length > 0 && tableFields?.map((field, index) => (
                  <span key={index} className="ml-3 text-sm font-xs text-gray-400">{field?.fieldName}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const staticTables = [
    {
      tableName: 'Artist',
      fields: [
        { fieldName: 'ArtistId' },
        { fieldName: 'Name' },
      ],
    },
  ]

  return (
    <>
      <aside
        id="separator-sidebar"
        className="top-0 left-0 z-40 w-64 h-auto transition-transform -translate-x-full sm:translate-x-0 border-r-2 border-stone-300"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <span className="ml-3 text-sm font-medium text-gray-400">DATA SOURCE</span>

          <Datasource />

          <div className="flex items-center justify-between pt-4 mt-4 space-y-2 border-t border-gray-200 p-2 text-gray-900 transition duration-75 dark:text-white group">
            <a onClick={toggleTablesDropdown} className="flex items-center hover:cursor-pointer">
              {isTablesDropdownOpen ? (
                <ArrowDownIcon className="text-gray-400" fill="none" />
              ) : (
                <ArrowRightIcon className="text-gray-400" fill="none" />
              )}
              <span className="ml-3 text-sm font-medium text-gray-400">TABLES</span>
            </a>
            <a className="ml-auto hover:cursor-pointer">
              <RefreshIcon />
            </a>
          </div>

          {isTablesDropdownOpen && (
            <div className="pl-6">
              {staticTables?.length > 0 && staticTables?.map((table, index) => renderList(table?.tableName, table?.fields, index))}
            </div>
          )}

          <a
            href="#"
            className="flex items-center pt-4 mt-4 space-y-2 border-t border-gray-200 p-2 text-gray-900 transition duration-75 dark:text-white group"
            onClick={toggleSavedQueries}
          >
            {isSavedQueriesOpen ? (
              <ArrowDownIcon className="mt-2 text-gray-400" fill="none" />
            ) : (
              <ArrowRightIcon className="mt-2 text-gray-400" fill="none" />
            )}
            <span className="ml-3 text-sm font-medium text-gray-400">SAVED QUERIES</span>
          </a>
          {isSavedQueriesOpen && (
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
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;