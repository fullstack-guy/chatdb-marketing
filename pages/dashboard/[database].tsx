import Layout from "../../components/Layout";
import React, { useEffect, useRef, useState } from 'react';
import { BsDatabase } from 'react-icons/bs';
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter();
  const { database } = router.query;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    },
    {
      tableName: 'Posts',
      description: "These posts are matched with a users and are published in the Wall Street Journal.",
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
    {
      tableName: 'Users',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'username', dataType: 'String' },
        { fieldName: 'email', dataType: 'String' },
        { fieldName: 'password', dataType: 'String' },
      ],
    },
    {
      tableName: 'Posts',
      fields: [
        { fieldName: 'id', dataType: 'Integer' },
        { fieldName: 'title', dataType: 'String' },
        { fieldName: 'content', dataType: 'Text' },
        { fieldName: 'author_id', dataType: 'Integer' },
      ],
    },
  ];

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTables = dataModel.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-12 border-b border-0 border-solid border-b-slate-200">
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
                <div className="kbd kbd-sm">⌘</div> <div className="kbd kbd-sm">K</div>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-6 flex flex-col sm:py-8">
        <div className="relative py-3 sm:mx-auto">
          <div className="relative px-4 py-8 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center space-x-5 mb-4">
              </div>
              {filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredTables.map((table, tableIndex) => (
                    <div key={tableIndex} className="border rounded-lg shadow-sm p-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">{table.tableName}</h3>
                      {table?.description && (<p className="text-sm text-gray-600 mb-4">{table.description}</p>
                      )}
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Field
                            </th>
                            <th className="px-6 py-3  bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data Type
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {table.fields.map((field, fieldIndex) => (
                            <tr key={fieldIndex}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{field.fieldName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{field.dataType}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>) : (<div className="text-center mt-4 text-gray-700">
                  No matching tables found.
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
