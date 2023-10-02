import { useUser } from "@clerk/nextjs";
import Layout from "../../components/Layout";
import Table from "../../components/dashboard/Table";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSupabase from "../../hooks/useSupabaseClient";
import DeleteDatabasesModal from "../../components/dashboard/DeleteDatabasesModal";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DatabaseObjectArray } from "../../components/dashboard/Table";

export default function Page() {
  const {
    isLoading,
    isError,
    data: subscriptionStatus,
  } = trpc.subscriptions.status.useQuery(null, {
    refetchOnWindowFocus: false,
    retry: 3,
    retryOnMount: false,
  });
  const {
    isLoading: isDatabasesLoading,
    isError: isDatabasesError,
    refetch: refetchDatabases,
    data: databases,
  } = trpc.databases.getAll.useQuery(null, {
    refetchOnWindowFocus: false,
    retry: 3,
    retryOnMount: false,
  });
  const [isDeleteDatabasesModalOpened, setIsDeleteDatabasesModalOpeneded] =
    useState(false);
  const [newDatabases, setNewDatabases] = useState([
    {
      name: "PostgreSQL",
      path: "/dashboard/postgres",
      selected: false,
      img: "/images/postgres-icon.png",
    },
  ]);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const supabase = useSupabase();
  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      subscriptionStatus?.isUserExceedingAllowedNumberOfDatabases
    ) {
      setIsDeleteDatabasesModalOpeneded(true);
    }
  }, [isLoaded, isSignedIn, supabase, subscriptionStatus]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const continueToDatabase = () => {
    const selectedDatabase = newDatabases.find((db) => db.selected);
    if (selectedDatabase) {
      handleNavigation(selectedDatabase.path || "/dashboard");
    }
  };

  // set database as selected
  const selectDatabase = (index) => {
    setNewDatabases((prevDatabases) =>
      prevDatabases.map((db, i) => ({
        ...db,
        selected: i === index ? !db.selected : db.selected,
      }))
    );
  };

  return (
    <Layout>
      <div>
        <header className="flex items-center justify-between pb-6 pt-12">
          <h1 className="text-4xl font-bold text-heading">Overview</h1>
          <label
            htmlFor="database-modal"
            className="btn-md btn mx-4 inline-flex cursor-pointer items-center justify-center rounded-xl border-none px-4 py-1 text-base font-semibold capitalize text-white shadow-sm hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80"
          >
            Add Data Source
          </label>
        </header>

        <main className="">
          {isDatabasesLoading && <LoadingSpinner />}
          {databases && (
            <Table
              databases={databases as DatabaseObjectArray}
              refetch={refetchDatabases}
            />
          )}
          {databases && databases.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-heading">
                You don't have any databases yet
              </h1>
            </div>
          )}
          {isDatabasesError && (
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-heading">
                Error fetching databases
              </h1>
            </div>
          )}
        </main>
      </div>
      <input type="checkbox" id="database-modal" className="modal-toggle" />
      <label htmlFor="database-modal" className="modal cursor-pointer">
        <label className="modal-box relative w-11/12 max-w-5xl" htmlFor="">
          <div className="my-4">
            {newDatabases.length > 0 &&
              newDatabases.map((database, index) => (
                <div
                  key={index}
                  onClick={() => selectDatabase(index)}
                  className={`mb-4 flex cursor-pointer items-center rounded-lg p-4 shadow-md ${
                    database.selected ? "border-4 border-[#0fe0b6]" : ""
                  }`}
                >
                  <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#0fe0b6]">
                    <Image
                      className="m-auto"
                      width={40}
                      height={40}
                      src={database.img}
                      alt={`${database.name} Image`}
                    />
                  </div>
                  <div>
                    <h1 className="mb-2 text-xl font-bold text-black">
                      {database.name}
                    </h1>
                  </div>
                </div>
              ))}
          </div>
          <div className="modal-action">
            <label htmlFor="database-modal" className="btn-ghost btn">
              Cancel
            </label>
            <label className="btn" onClick={continueToDatabase}>
              Continue
            </label>
          </div>
        </label>
      </label>
      <DeleteDatabasesModal
        open={isDeleteDatabasesModalOpened}
        setOpen={setIsDeleteDatabasesModalOpeneded}
      />
    </Layout>
  );
}
