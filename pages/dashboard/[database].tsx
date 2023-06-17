import Layout from "../../components/Layout";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";
import { BsDatabase } from "react-icons/bs";
import { useRouter } from "next/router";
import TableList from "../../components/dashboard/TableList";
import Chat from "../../components/dashboard/Chat";
import supabase from "../../utils/supabaseClient";
import Settings from "../../components/dashboard/Settings";

interface Database {
  id: number;
  uuid: string;
  created_at: string;
  user_id: string;
  title: string;
  schema_data: Record<string, unknown> | any;
}

export default function Page() {
  const router = useRouter();

  const { isLoaded, isSignedIn, user } = useUser();
  const { database } = router.query;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [fetchedDatabase, setFetchedDatabase] = useState<Database | null>(null);
  const [databaseToken, setDatabaseToken] = useState<string>("");
  const [selectedSchema, setSelectedSchema] = useState("public");
  const [dataModel, setDataModel] = useState([]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from("user_schemas")
      .select("*")
      .eq("user_id", user.id)
      .eq("uuid", database);

    if (error) {
      console.error("Error fetching tables:", error);
      router.push("/dashboard");
    } else {
      const db = data[0] as Database;
      setFetchedDatabase(db);
      setDataModel(convertJsonToDataModel(db.schema_data));
    }
  };

  const fetchDatabaseString = async () => {
    const { data, error } = await supabase
      .from("user_databases")
      .select("database_string")
      .eq("uuid", database); // Assuming you want to fetch for a specific user

    if (error) {
      console.error("Error fetching connection string:", error);
      router.push("/dashboard");
    } else if (data && data.length > 0) {
      setDatabaseToken(data[0].database_string);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchTables();
      fetchDatabaseString();
    }
  }, [isLoaded, isSignedIn]);

  function convertJsonToDataModel(json) {
    const dataModel = [];

    const schema = json[selectedSchema];
    for (const tableName in schema) {
      const table = schema[tableName];
      const fields = [];
      for (const fieldName in table) {
        const field = table[fieldName];
        fields.push({
          fieldName: fieldName,
          dataType: field.type,
        });
      }
      dataModel.push({
        tableName: tableName,
        fields: fields,
      });
    }

    return dataModel;
  }

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

  const renderContent = () => {
    switch (activeTab) {
      case "Tables":
        return <TableList filteredTables={filteredTables} />;
      case "Chat":
        return <Chat database_token={databaseToken} />;
      case "Flow":
        return <p>Flow content goes here</p>;
      case "Settings":
        return (
          <Settings
            fetchedDatabase={fetchedDatabase}
            setFetchedDatabase={setFetchedDatabase}
            database={Array.isArray(database) ? database[0] : database}
          />
        );
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
      {fetchedDatabase && (
        <div className="border-0 border-b border-solid border-b-slate-200 py-8">
          <div className="flex flex-col items-start text-black sm:flex-row sm:justify-between">
            <div>
              <div className="text-left">POSTGRESQL</div>
              <div className="flex items-center text-black">
                <BsDatabase />
                <span className="ml-2 text-3xl font-semibold">
                  {fetchedDatabase.title}
                </span>
              </div>
            </div>
            {activeTab === "Tables" && (
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
            )}
          </div>
          <div className="tabs tabs-boxed mt-10 bg-transparent">
            <a
              className={`tab text-lg text-black ${
                activeTab === "Chat" ? "tab-active" : ""
              }`}
              onClick={() => handleTabClick("Chat")}
            >
              Chat
            </a>
            <a
              className={`tab text-lg text-black ${
                activeTab === "Tables" ? "tab-active" : ""
              }`}
              onClick={() => handleTabClick("Tables")}
            >
              Tables
            </a>
            <a
              className={`tab text-lg text-black ${
                activeTab === "Flow" ? "tab-active" : ""
              }`}
              onClick={() => handleTabClick("Flow")}
            >
              Flow
            </a>
            <a
              className={`tab text-lg text-black ${
                activeTab === "Settings" ? "tab-active" : ""
              }`}
              onClick={() => handleTabClick("Settings")}
            >
              Settings
            </a>
          </div>
        </div>
      )}
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
