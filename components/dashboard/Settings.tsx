import React, { useState } from "react";
import supabase from "../../utils/supabaseClient";
import { useRouter } from "next/router";

interface SettingsProps {
  fetchedDatabase: {
    id: number;
    uuid: string;
    created_at: string;
    user_id: string;
    title: string;
    schema_data: Record<string, unknown> | any;
  };
  setFetchedDatabase: (data: any) => void;
  database: string | string[];
}

const Settings: React.FC<SettingsProps> = ({
  fetchedDatabase,
  setFetchedDatabase,
  database,
}) => {
  const router = useRouter();
  const [newDatabaseName, setNewDatabaseName] = useState<string>(
    fetchedDatabase.title
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDatabaseName(e.target.value);
  };

  const updateDatabaseName = async () => {
    const { data, error } = await supabase
      .from("user_schemas")
      .update({ title: newDatabaseName })
      .eq("uuid", database);

    if (error) {
      console.error("Error updating database name:", error);
    } else {
      setFetchedDatabase({
        ...fetchedDatabase,
        title: newDatabaseName,
      });
    }
  };

  const deleteDatabase = async () => {
    // First delete from user_schemas
    const { data: dataSchema, error: errorSchema } = await supabase
      .from("user_schemas")
      .delete()
      .eq("uuid", database);

    if (errorSchema) {
      console.error("Error deleting schemas:", errorSchema);
      return;
    } else {
      console.log("Schemas deleted successfully:", dataSchema);
    }

    // Then delete from user_databases
    const { data: dataDatabase, error: errorDatabase } = await supabase
      .from("user_databases")
      .delete()
      .eq("uuid", database);

    if (errorDatabase) {
      console.error("Error deleting database:", errorDatabase);
    } else {
      console.log("Database deleted successfully:", dataDatabase);
      router.push("/dashboard"); // Redirect to dashboard after successful deletion
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={newDatabaseName}
        onChange={handleNameChange}
        className="focus:shadow-outline-blue block rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:outline-none"
        placeholder="Database Name"
      />
      <button
        onClick={updateDatabaseName}
        className="mx-1 inline-block rounded-md border border-black px-4 py-1 text-black"
      >
        Update
      </button>
      <button
        onClick={deleteDatabase}
        className="mx-1 inline-block rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-700"
      >
        Delete Database
      </button>
    </div>
  );
};

export default Settings;
