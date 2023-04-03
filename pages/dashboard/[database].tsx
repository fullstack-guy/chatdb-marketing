import Layout from "../../components/Layout";
import React, { useEffect, useRef, useState } from 'react';
import { BsDatabase } from 'react-icons/bs';
import { useRouter } from 'next/router';
import TableList from "../../components/dashboard/TableList";
import Sidebar from "../../components/Sidebar";

export default function Page() {
  const router = useRouter();
  const { database } = router.query;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tables');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const isMac = window.navigator.userAgent.indexOf('Mac') !== -1;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (cmdOrCtrl && event.key === 'k') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const dataModel = [
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Tables':
        return <TableList filteredTables={filteredTables} />;
      case 'Chat':
        return <p>Chat content goes here</p>;
      case 'Settings':
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
      <div className="py-8 border-b border-0 border-solid border-b-slate-200">
        <div className="text-black flex flex-col items-start sm:flex-row sm:justify-between">
          <div>
            <div className="text-left">
              POSTGRESQL
            </div>
            <div className="flex text-black items-center">
              <BsDatabase />
              <span className="ml-2 text-3xl font-semibold">EventsDB</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="relative">
                <input
                  type="text"
                  onChange={handleSearchInputChange}
                  value={searchQuery}
                  ref={searchInputRef}
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-64 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Search"
                />
                <p className="absolute top-1/2 transform -translate-y-1/2 right-4 text-xs text-gray-400">
                  <div className="kbd kbd-sm">⌘K</div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="tabs mt-10 tabs-boxed bg-transparent">
          <a className={`tab text-lg text-black ${activeTab === 'Chat' ? 'tab-active' : ''}`} onClick={() => handleTabClick('Chat')}>Chat</a>
          <a className={`tab text-lg text-black ${activeTab === 'Tables' ? 'tab-active' : ''}`} onClick={() => handleTabClick('Tables')}>Tables</a>
          <a className={`tab text-lg text-black ${activeTab === 'Settings' ? 'tab-active' : ''}`} onClick={() => handleTabClick('Settings')}>Settings</a>
        </div>
      </div>
      <div className="bg-gray-100 py-6 flex flex-col sm:py-8">
        <div className="relative w-full py-3 sm:mx-auto">
          <div className="relative px-4 py-8 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
