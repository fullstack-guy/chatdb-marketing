import React, { useState } from 'react';
import TableEditor from './TableEditor';
import TableList from './TableList';

const TablePage = ({ filteredTables, database_token }) => {
    const [tabs, setTabs] = useState([
        { id: 0, type: 'TableList', tableRows: [], tableName: '' }
    ]);

    const [activeTab, setActiveTab] = useState(0);

    const addTab = () => {
        const newTabId = tabs.length;
        setTabs([
            ...tabs,
            { id: newTabId, type: 'TableList', tableRows: [], tableName: '' }
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

    const handleTableClick = (tableRows, tableName) => {
        setTabs(tabs.map(tab =>
            tab.id === activeTab
                ? { ...tab, type: 'TableEditor', tableRows, tableName }
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
            {tabs.length > 0 && tabs[activeTab].type === 'TableEditor' ? (
                <TableEditor tableRows={tabs[activeTab].tableRows} tableName={tabs[activeTab].tableName} />
            ) : (
                <TableList database_token={database_token} filteredTables={filteredTables} onTableClick={handleTableClick} />
            )}
        </div>
    );
};

export default TablePage;
