import Layout from "../../components/Layout";
import { useUser, useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { BsDatabase } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import QuickSearch from "../../components/dashboard/QuickSearch";
import DatabaseNav from "../../components/dashboard/DatabaseNav";
import DeleteDatabasesModal from "../../components/dashboard/DeleteDatabasesModal";
import dynamic from 'next/dynamic'
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../../components/LoadingSpinner";

const DatabaseControl = dynamic(() => import("../../components/dashboard/DatabaseControl"), {
  ssr: true, loading: () => <LoadingSpinner />,
})
interface Database {
  id: number;
  uuid: string;
  created_at: string;
  user_id: string;
  title: string;
  schema_data: Record<string, unknown> | any;
}

export default function Page() {
  const auth = useAuth();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { database_uuid } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [fetchedDatabase, setFetchedDatabase] = useState<Database | null>(null);
  const [title, setTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dataModel, setDataModel] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isDeleteDatabasesModalOpened, setIsDeleteDatabasesModalOpened] =
    useState(false);
  const {
    isLoading,
    isError,
    data: subscriptionStatus,
  } = trpc.subscriptions.status.useQuery(null, {
    refetchOnWindowFocus: false,
    retry: 3,
    retryOnMount: false,
  });

  useEffect(() => {
    setSearchQuery(""); // clear the searchQuery when activeTab changes
  }, [activeTab]);

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/db/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          database_uuid: database_uuid,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setTitle(data.title);
        setFetchedDatabase(data);
        setDataModel(convertJsonToDataModel(data.tables));
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      router.push("/dashboard");
    }
  };

  const updateDatabase = async (data, user, toast) => {
    try {
      const response = await fetch("/api/db/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          database_uuid, // Assuming you have fetchedDatabase available in this context
          schema_data: data,
          user: user,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error updating data in database:", responseData);
        toast.error("Error updating data in database");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error updating data in database:", error);
      toast.error("Error updating data in database");
    }
  };

  const refreshAndSaveDatabase = async () => {
    setRefreshing(true);
    const token = await auth.getToken();
    const url = "/fastify/api/db/connect";
    const body = {
      database_uuid,
    };

    try {
      console.log("token", token);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          await updateDatabase(data, user, toast);
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

  useEffect(() => {
    if (
      user &&
      (user.publicMetadata.isActive === false ||
        Object.keys(user.publicMetadata).length === 0)
    ) {
      router.push("/pricing");
    }
    if (isLoaded && isSignedIn) {
      fetchTables();
    }

    if (
      !isLoading &&
      !isError &&
      subscriptionStatus?.isUserExceedingAllowedNumberOfDatabases
    ) {
      setIsDeleteDatabasesModalOpened(true);
    }
  }, [isLoaded, isSignedIn, subscriptionStatus]);

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
                  <span className="ml-2 text-3xl font-semibold">{title}</span>
                </div>
                <div>
                  <BiRefresh
                    className="mx-2 cursor-pointer text-2xl"
                    onClick={refreshAndSaveDatabase}
                  />
                </div>
              </div>
            </div>
            {(activeTab === "Query" || activeTab === "Tables") && (
              <QuickSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </div>
          <DatabaseNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
      <div className="flex flex-col bg-gray-100 sm:py-4">
        <div className="relative w-full py-3 sm:mx-auto">
          <div className="relative mx-8 rounded-3xl bg-white px-4 py-8 shadow sm:p-10 md:mx-0">
            <div className="mx-auto max-w-7xl">
              <DatabaseControl
                activeTab={activeTab}
                database_uuid={database_uuid}
                filteredTables={filteredTables}
                fetchedDatabase={fetchedDatabase}
                setFetchedDatabase={setFetchedDatabase}
                setTitle={setTitle}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
      <DeleteDatabasesModal
        open={isDeleteDatabasesModalOpened}
        setOpen={setIsDeleteDatabasesModalOpened}
      />
    </Layout>
  );
}
