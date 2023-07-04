import React, { useState } from "react";
import Modal from "react-modal";
import supabase from "../../utils/supabaseClient";
import { Toaster, toast } from "react-hot-toast";
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
  const [isModalOpen, setModalOpen] = useState(false);

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
    setModalOpen(false); // Close the modal
    const response = await fetch(`/api/db/delete?database=${database}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      console.log("Database, schemas, and token deleted successfully:", data);
      router.push("/dashboard"); // Redirect to dashboard after successful deletion
    } else {
      console.error("Error deleting database:", data.error);
      toast.error("We had an issue deleting your database!");
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
        onClick={() => setModalOpen(true)}
        className="mx-1 inline-block rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-700"
      >
        Delete Connection
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="fixed left-1/2 top-1/2 max-w-xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-16 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        contentLabel="Delete Confirmation Modal"
      >
        <h2 className="mb-4 text-center text-black text-2xl font-bold">
          Confirm Deletion
        </h2>
        <p className="mb-8 text-center">
          Are you sure you want to delete this connection?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={deleteDatabase}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Settings;
