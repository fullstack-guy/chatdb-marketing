import Layout from "../../components/Layout";
import React, { useEffect, useRef, useState } from "react";
import { BsDatabase } from "react-icons/bs";
import { useRouter } from "next/router";
import TableList from "../../components/dashboard/TableList";
import Chat from "../../components/dashboard/Chat";

export default function Page() {
  const router = useRouter();
  const { database } = router.query;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const isMac = window.navigator.userAgent.indexOf("Mac") !== -1;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (cmdOrCtrl && event.key === "k") {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const dataModel = [
    {
      tableName: "Users",
      fields: [
        { fieldName: "id", dataType: "Integer" },
        { fieldName: "username", dataType: "String" },
        { fieldName: "email", dataType: "String" },
        { fieldName: "password", dataType: "String" },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Tables":
        return <TableList filteredTables={filteredTables} />;
      case "Chat":
        return <Chat />;
      case "Flow":
        return <p>Flow content goes here</p>;
      case "Settings":
        return <p>Settings content goes here</p>;
      default:
        return <p>Invalid tab selected</p>;
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTables = dataModel.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="border-0 border-b border-solid border-b-slate-200 py-8">
        <div className="flex flex-col items-start text-black sm:flex-row sm:justify-between">
          <div>
            <div className="text-left">POSTGRESQL</div>
            <div className="flex items-center text-black">
              <BsDatabase />
              <span className="ml-2 text-3xl font-semibold">EventsDB</span>
            </div>
          </div>
          {
            activeTab === "Tables" && (
              <div className="mt-4 sm:mt-0">
                <div className="mt-4 flex items-center sm:mt-0">
                  <div className="relative">
                    <input
                      type="text"
                      onChange={handleSearchInputChange}
                      value={searchQuery}
                      ref={searchInputRef}
                      className="focus:ring-primary-600 w-64 flex-1 appearance-none rounded-lg border border-transparent border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2"
                      placeholder="Search"
                    />
                    <p className="absolute top-1/2 right-4 -translate-y-1/2 transform text-xs text-gray-400">
                      <div className="kbd kbd-sm">⌘K</div>
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="tabs tabs-boxed mt-10 bg-transparent">
          <a
            className={`tab text-lg text-black ${activeTab === "Chat" ? "tab-active" : ""
              }`}
            onClick={() => handleTabClick("Chat")}
          >
            Chat
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
        </div>
      </div>
      <div className="flex flex-col bg-gray-100 py-6 sm:py-8">
        <div className="relative w-full py-3 sm:mx-auto">
          <div className="relative mx-8 rounded-3xl bg-white px-4 py-8 shadow sm:p-10 md:mx-0">
            <div className="mx-auto max-w-7xl">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
