import React, { useState, useEffect, useRef } from "react";
import TableEditor from "./TableEditor";
import TableList from "./TableList";
import TableTabs from "./TableTabs";

const TablePage = ({ dbType, filteredTables, database_uuid }) => {
  // Check for tabs in localStorage
  const initialTabs = JSON.parse(localStorage.getItem("tabs")) || [];
  const initialActiveTab =
    JSON.parse(localStorage.getItem("activeTab")) || null;

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  //to store tabs and activeTab in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [tabs, activeTab]);

  const showTableList = () => {
    setActiveTab(null);
  };

  const deleteTab = (index) => {
    setTabs((prevTabs) => {
      if (index < 0 || index >= prevTabs.length) {
        // Index out of range
        return prevTabs;
      }

      // Use the splice method to remove the tab at the given index
      const updatedTabs = [...prevTabs];
      updatedTabs.splice(index, 1);

      // If the active tab is the one being deleted
      const deletedTabId = prevTabs[index].id;
      if (activeTab === deletedTabId) {
        setActiveTab(
          updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1].id : null
        );
      }

      return updatedTabs;
    });
  };
  // Using a ref to hold the next tab ID
  const nextTabId = useRef(initialTabs.length);

  const handleTableClick = (tableName) => {
    const existingTab = tabs.find((tab) => tab.tableName === tableName);

    if (existingTab) {
      setActiveTab(existingTab.id); // This should set only the ID
    } else {
      const newTabId = nextTabId.current++;
      const newTab = { id: newTabId, type: "TableEditor", tableName };
      setTabs([...tabs, newTab]);
      setActiveTab(newTabId); // This should set only the ID
    }
  };

  return (
    <div>
      {!!tabs?.length && (
        <TableTabs
          tabs={tabs}
          activeTab={activeTab}
          handleAddTabs={showTableList}
          setActiveTab={setActiveTab}
          deleteTab={deleteTab}
        />
      )}

      {activeTab === null && (
        <TableList
          filteredTables={filteredTables}
          onTableClick={handleTableClick}
        />
      )}

      {tabs.map((tab) => {
        if (tab.type === "TableEditor") {
          return (
            <div
              style={{ display: activeTab === tab.id ? "block" : "none" }}
              key={tab.id}
            >
              <TableEditor
                dbType={dbType}
                tableName={tab.tableName}
                database_uuid={database_uuid}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default TablePage;
