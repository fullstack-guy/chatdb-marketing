import React from 'react'

export default function DatabaseNav({ activeTab, setActiveTab }) {

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    return (
        <div className="tabs tabs-boxed mt-7 bg-transparent p-0">
            <a
                className={`tab text-lg text-black ${activeTab === "Chat" ? "tab-active" : ""
                    }`}
                onClick={() => handleTabClick("Chat")}
            >
                Ask
            </a>
            <a
                className={`tab text-lg text-black ${activeTab === "Tables" ? "tab-active" : ""
                    }`}
                onClick={() => handleTabClick("Tables")}
            >
                Tables
            </a>
            <a
                className={`tab text-lg text-black ${activeTab === "Flow" ? "tab-active" : ""
                    }`}
                onClick={() => handleTabClick("Flow")}
            >
                Flow
            </a>
            <a
                className={`tab text-lg text-black ${activeTab === "Settings" ? "tab-active" : ""
                    }`}
                onClick={() => handleTabClick("Settings")}
            >
                Settings
            </a>
        </div>)
}
