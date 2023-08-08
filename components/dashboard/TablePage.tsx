import React, { useState } from 'react';
import TableEditor from './TableEditor';
import TableList from './TableList';

const TablePage = ({ filteredTables, database_token }) => {
    const [tabs, setTabs] = useState([
        { id: 0, type: 'TableList', tableName: '' }
    ]);

    const [activeTab, setActiveTab] = useState(0);

    const addTab = () => {
        const newTabId = tabs.length;
        setTabs([
            ...tabs,
            { id: newTabId, type: 'TableList', tableName: '' }
        ]);
        setActiveTab(newTabId);
    };

    const deleteTab = (id) => {
        const newTabs = tabs.filter(tab => tab.id !== id);
        setTabs(newTabs);
        if (activeTab === id) {
            setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
    };

    const handleTableClick = (tableName) => {
        setTabs(tabs.map(tab =>
            tab.id === activeTab
                ? { ...tab, type: 'TableEditor', tableName }
                : tab
        ));
    };

    return (
        <div>
            <div className="tabs">
                {tabs.map(tab => (
                    <div key={tab.id}>
                        <a className={`tab tab-lifted ${activeTab === tab.id ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}>
                            {tab.type === 'TableEditor' ? tab.tableName : 'Tab ' + (tab.id + 1)}
                        </a>
                    </div>
                ))}
                <button onClick={addTab}>Add Tab</button>
            </div>

            {tabs.map((tab, index) => {
                if (tab.type === 'TableEditor') {
                    return (
                        <div style={{ display: activeTab === index ? 'block' : 'none' }} key={tab.id}>
                            <TableEditor tableName={tab.tableName} database_token={database_token} />
                        </div>
                    );
                } else {
                    return (
                        <div style={{ display: activeTab === index ? 'block' : 'none' }} key={tab.id}>
                            <TableList filteredTables={filteredTables} onTableClick={handleTableClick} />
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default TablePage;
