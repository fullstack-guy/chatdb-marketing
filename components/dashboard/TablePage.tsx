import React, { useState } from 'react';
import TableEditor from './TableEditor';
import TableList from './TableList';
import TableTabs from './TableTabs';

const TablePage = ({ filteredTables, database_token }) => {

    const [tabs, setTabs] = useState([]);

    const [activeTab, setActiveTab] = useState(null); // initialize to null, to indicate TableList view

    const showTableList = () => {
        setActiveTab(null);
    };

    const deleteTab = (id) => {
        const newTabs = tabs.filter(tab => tab.id !== id);
        setTabs(newTabs);
        if (activeTab === id) {
            setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
    };

    const handleTableClick = (tableName) => {
        const existingTab = tabs.find(tab => tab.tableName === tableName);

        if (existingTab) {
            setActiveTab(existingTab.id); // This should set only the ID
        } else {
            const newTabId = tabs.length;
            const newTab = { id: newTabId, type: 'TableEditor', tableName };
            setTabs([...tabs, newTab]);
            setActiveTab(newTabId); // This should set only the ID
        }
    };

    return (
        <div>
            {!!tabs?.length &&
                <TableTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    handleAddTabs={showTableList}
                    setActiveTab={setActiveTab}
                    deleteTab={deleteTab}
                />
            }

            {activeTab === null &&
                <TableList filteredTables={filteredTables} onTableClick={handleTableClick} />
            }

            {tabs.map((tab) => {
                if (tab.type === 'TableEditor') {
                    return (
                        <div style={{ display: activeTab === tab.id ? 'block' : 'none' }} key={tab.id}>
                            <TableEditor tableName={tab.tableName} database_token={database_token} />
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default TablePage;
