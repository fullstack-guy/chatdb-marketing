import React from "react";
import TablePage from "./TablePage";
import Chat from "./Chat";
import DatabaseFlow from "../DatabaseFlow";
import Settings from "./Settings";

export default function DatabaseControl({
  activeTab,
  database_uuid,
  filteredTables,
  fetchedDatabase,
  setFetchedDatabase,
  setTitle,
  dbType
}) {
  const renderContent = () => {
    switch (activeTab) {
      case "Tables":
        return (
          <TablePage
            dbType={dbType}
            database_uuid={database_uuid}
            filteredTables={filteredTables}
          />
        );
      case "Chat":
        return <Chat database_uuid={database_uuid} dbType={dbType} />;
      case "Flow":
        const { title, tables } = fetchedDatabase;
        return <DatabaseFlow dbSchema={tables} />;
      case "Settings":
        return (
          <Settings
            fetchedDatabase={fetchedDatabase}
            setFetchedDatabase={setFetchedDatabase}
            database_uuid={
              Array.isArray(database_uuid) ? database_uuid[0] : database_uuid
            }
            setTitle={setTitle}
          />
        );
      default:
        return <Chat database_uuid={database_uuid} dbType={dbType} />;
    }
  };
  return renderContent();
}
