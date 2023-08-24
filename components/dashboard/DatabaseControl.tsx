import React from 'react'
import TablePage from './TablePage';
import Chat from './Chat';
import DatabaseFlow from '../DatabaseFlow';
import Settings from './Settings';

export default function DatabaseControl({ activeTab, database_uuid, filteredTables, fetchedDatabase, setFetchedDatabase }) {

    const renderContent = () => {
        switch (activeTab) {
            case "Tables":
                return (
                    <TablePage
                        database_uuid={database_uuid}
                        filteredTables={filteredTables}
                    />
                );
            case "Chat":
                return <Chat database_uuid={database_uuid} />;
            case "Flow":
                const { title, ...restOfDatabase } = fetchedDatabase;
                return <DatabaseFlow dbSchema={restOfDatabase} />;
            case "Settings":
                return (
                    <Settings
                        fetchedDatabase={fetchedDatabase}
                        setFetchedDatabase={setFetchedDatabase}
                        database_uuid={Array.isArray(database_uuid) ? database_uuid[0] : database_uuid}
                    />
                );
            default:
                return <Chat database_uuid={database_uuid} />;
        }
    };
    return (
        renderContent()
    )
}
