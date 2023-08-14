import Layout from "../../components/Layout";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";
import { BsDatabase } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import { useRouter } from "next/router";
import TablePage from "../../components/dashboard/TablePage";
import Chat from "../../components/dashboard/Chat";
import Settings from "../../components/dashboard/Settings";
import DatabaseFlow from "../../components/DatabaseFlow";
import { Toaster, toast } from "react-hot-toast";
import { useBasisTheory } from "@basis-theory/basis-theory-react";
import useSupabase from "../../hooks/useSupabaseClient";

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
  const [refreshing, setRefreshing] = useState(false);
  const [dataModel, setDataModel] = useState([]);
  const [saving, setSaving] = useState(false);
  const supabase = useSupabase();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_KEY, {
    elements: true,
  });

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

  const updateDatabase = async (data, user, databaseToken, name, toast) => {
    try {
      const { data: existingSchemas, error: schemaError } = await supabase
        .from("user_schemas")
        .select("uuid")
        .eq("user_id", user.id)
        .eq("title", fetchedDatabase.title);

      if (schemaError) {
        console.error("Error querying Supabase:", schemaError);
        toast.error("Error querying Supabase");
        return;
      }

      if (existingSchemas.length > 0) {
        // Found matching schema, now update it
        const schemaID = existingSchemas[0].uuid; // Get the id of the existing schema

        const { error: databaseError } = await supabase
          .from("user_schemas")
          .update({
            schema_data: data,
          })
          .eq("uuid", schemaID);

        if (databaseError) {
          console.error("Error saving data to database:", databaseError);
          toast.error("Error saving database string to database");
          return false;
        } else {
          return true;
        }
      } else {
        toast.error("No matching schema found!");
        return false;
      }
    } catch (error) {
      console.error("Error updating data in database:", error);
      toast.error("Error updating data in database");
    }
  };

  const refreshAndSaveDatabase = async () => {
    setRefreshing(true);

    const url = "/api/connect";
    const body = {
      database_token: databaseToken,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the response
        toast.error(errorData.message);
        setRefreshing(false);
      } else {
        const data = await response.json();
        try {
          await updateDatabase(data, user, databaseToken, name, toast);
          await fetchTables();
          toast.success("Database refreshed!");
        } catch (error) {
          toast.error("There was an error saving the database!");
        } finally {
          setSaving(false);
        }
        return data;
      }
    } catch (error) {
      setRefreshing(false);
      toast.error(error.message); // Show network error message
    }
  };

  const fetchDatabaseString = async () => {
    const { data, error } = await supabase
      .from("user_databases")
      .select("database_string")
      .eq("uuid", database);

    if (error) {
      console.error("Error fetching connection string:", error);
      router.push("/dashboard");
    } else if (data && data.length > 0) {
      setDatabaseToken(data[0].database_string);
    }
  };

  useEffect(() => {
    if (supabase && isLoaded && isSignedIn) {
      fetchTables();
      fetchDatabaseString();
    }
  }, [isLoaded, isSignedIn, supabase]);

  function convertJsonToDataModel(json) {
    const dataModel = [];

    for (const schemaName in json) {
      const schema = json[schemaName];
      for (const tableName in schema) {
        const table = schema[tableName];
        const fields = [];
        let foreignKeys = []; // Initialize foreignKeys array
        for (const fieldName in table) {
          if (fieldName === "foreignKeys") {
            foreignKeys = table[fieldName]; // Assign foreign keys if they exist
          } else {
            const field = table[fieldName];
            fields.push({
              fieldName: fieldName,
              dataType: field.type,
            });
          }
        }
        dataModel.push({
          schemaName: schemaName,
          tableName: tableName,
          fields: fields,
          foreignKeys: foreignKeys, // Include foreignKeys in the data model
        });
      }
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
        return (
          <TablePage
            database_token={databaseToken}
            filteredTables={filteredTables}
          />
        );
      case "Chat":
        return <Chat database_token={databaseToken} />;
      case "Flow":
        return <DatabaseFlow dbSchema={fetchedDatabase.schema_data} />;
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

  const filteredTables = dataModel.filter(
    (table) =>
      table.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.schemaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {fetchedDatabase && (
        <div className="border-0 border-b border-solid border-b-slate-200 py-4">
          <div className="flex flex-col items-start text-black sm:flex-row sm:justify-between">
            <div>
              <div className="text-left">POSTGRESQL</div>
              <div className="flex items-center justify-between text-black">
                <div className="flex items-center">
                  <BsDatabase />
                  <span className="ml-2 text-3xl font-semibold">
                    {fetchedDatabase.title}
                  </span>
                </div>
                <div>
                  <BiRefresh
                    className="mx-2 cursor-pointer text-2xl"
                    onClick={refreshAndSaveDatabase}
                  />
                </div>
              </div>
            </div>
            {activeTab === "Query" && (
              <div className="mt-4 sm:mt-0">
                <div className="mt-4 flex items-center sm:mt-0">
                  <div className="relative">
                    <input
                      type="text"
                      onChange={handleSearchInputChange}
                      value={searchQuery}
                      ref={searchInputRef}
                      className="focus:ring-primary-600 w-64 flex-1 appearance-none rounded-lg border border-gray-300 border-transparent bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2"
                      placeholder="Search"
                    />
                    <p className="absolute right-4 top-1/2 -translate-y-1/2 transform text-xs text-gray-400">
                      <div className="kbd kbd-sm">⌘K</div>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Tables" && (
              <div className="mt-4 sm:mt-0">
                <div className="mt-4 flex items-center sm:mt-0">
                  <div className="relative">
                    <input
                      type="text"
                      onChange={handleSearchInputChange}
                      value={searchQuery}
                      ref={searchInputRef}
                      className="focus:ring-primary-600 w-64 flex-1 appearance-none rounded-lg border border-gray-300 border-transparent bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2"
                      placeholder="Search"
                    />
                    <p className="absolute right-4 top-1/2 -translate-y-1/2 transform text-xs text-gray-400">
                      <div className="kbd kbd-sm">⌘K</div>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="tabs tabs-boxed mt-7 bg-transparent p-0">
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
      <div className="flex flex-col bg-gray-100 sm:py-4">
        <div className="relative w-full py-3 sm:mx-auto">
          <div className="relative mx-8 rounded-3xl bg-white px-4 py-8 shadow sm:p-10 md:mx-0">
            <div className="mx-auto max-w-7xl">{renderContent()}</div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}
