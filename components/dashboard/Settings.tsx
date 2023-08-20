import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";
import UsageChart from "./UsageChart";
import useSupabase from "../../hooks/useSupabaseClient";

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
  const [showSample, setShowSample] = useState(false);
  const supabase = useSupabase();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDatabaseName(e.target.value);
  };

  const showSampleRef = useRef(null); // This ref will hold the initial value of showSample

  useEffect(() => {
    const fetchAndUpdateSetting = async () => {
      if (showSampleRef.current === null) {
        // If it's the initial load
        const result = await getDatabaseSampleSetting(database);
        setShowSample(result);
        showSampleRef.current = result; // Store the initial value in the ref
      } else if (showSample !== showSampleRef.current) {
        // If the value has changed after the initial load
        await updateDatabaseSampleSetting(database, showSample);
      }
    };

    if (supabase) {
      fetchAndUpdateSetting();
    }
  }, [database, showSample, supabase]);

  //fetch show_sample_rows field from user_databases table where uuid matches
  const getDatabaseSampleSetting = async (uuid) => {
    const { data, error } = await supabase
      .from("user_databases")
      .select("show_sample")
      .eq("uuid", uuid);

    if (error) {
      throw error;
    }

    return data[0].show_sample;
  };

  // Update show_sample_rows field in user_databases table where uuid matches
  const updateDatabaseSampleSetting = async (database, newValue) => {
    const { data, error } = await supabase
      .from("user_databases")
      .update({ show_sample: newValue })
      .eq("uuid", database);

    if (error) {
      toast.error(`We had an issue updating sample setting.`);
      return null;
    }

    return data;
  };

  const updateDatabaseName = async () => {
    const { data, error } = await supabase
      .from("user_schemas")
      .update({ title: newDatabaseName })
      .eq("uuid", database);

    if (error) {
      console.error("Error updating database name:", error);
      toast.error(`We had an issue updating database name.`);
    } else {
      setFetchedDatabase({
        ...fetchedDatabase,
        title: newDatabaseName,
      });
    }
  };

  const deleteDatabase = async () => {
    setModalOpen(false); // Close the modal
    const response = await fetch(`/api/db/delete?uuid=${database}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      router.push("/dashboard"); // Redirect to dashboard after successful deletion
    } else {
      console.error("Error deleting database:", data.error);
      toast.error("We had an issue deleting your database!");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start space-y-8 px-8">
      {/* Database Settings Section */}
      <div className="w-full max-w-2xl space-y-4 rounded-md bg-white p-6 shadow-md">
        <h2 className="sfont-semibold text-2xl text-black">
          Database Settings
        </h2>

        <div className="form-control">
          <label className="mb-1 block text-lg text-black">Database Name</label>
          <div className="input-group flex items-center">
            <input
              type="text"
              value={newDatabaseName}
              onChange={handleNameChange}
              className="focus:shadow-outline-blue input-bordered input flex-grow rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:outline-none"
              placeholder="Database Name"
            />
            <button
              onClick={updateDatabaseName}
              className="btn rounded-md border border-black px-4 py-1 text-white"
            >
              Update
            </button>
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="text-lg text-black">Show Sample</span>
            <input
              type="checkbox"
              checked={showSample}
              className="checkbox"
              onChange={() => setShowSample((prev) => !prev)}
            />
          </label>
          <p className="text-md mt-1">
            Let AI see sample of 3 rows of data in tables to improve AI results
          </p>
        </div>
      </div>

      {/* Usage Section */}
      <div className="w-full max-w-2xl space-y-4 rounded-md p-6 shadow-md">
        <UsageChart />
      </div>

      {/* Danger Zone Section */}
      <div className="w-full max-w-xl space-y-4 rounded-md bg-red-50 p-6 shadow-md">
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-block w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete Connection
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="fixed left-1/2 top-1/2 max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-16 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        contentLabel="Delete Confirmation Modal"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-black">
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
