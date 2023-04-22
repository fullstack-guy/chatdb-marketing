import { useUser } from "@clerk/nextjs";
import Layout from "../../components/Layout";
import Table from "../../components/dashboard/Table";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../../utils/supabaseClient";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchDatabases();
    }
  }, [isLoaded, isSignedIn]);

  const [fetchedDatabases, setFetchedDatabases] = useState([]);

  const [newDatabases, setNewDatabases] = useState([
    {
      name: "PostgreSQL",
      path: "/dashboard/postgres",
      selected: false,
      img: "/images/postgres-icon.png",
    },
  ]);

  const fetchDatabases = async () => {
    const { data, error } = await supabase
      .from("user_schemas")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching databases:", error);
    } else {
      setFetchedDatabases(data.map(db => ({
        name: db.title,
        path: "/dashboard/postgres",
        selected: false,
        img: "/images/postgres-icon.png",
        uuid: db.uuid,
        created_at: db.created_at,
      })));
    }
  };

  if (!isLoaded || !isSignedIn || process.env.NODE_ENV === "production") {
    return null;
  }

  const continueToDatabase = () => {
    const selectedDatabase = newDatabases.find((db) => db.selected);
    handleNavigation(selectedDatabase.path || "/dashboard");
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
        <header className="pt-12 pb-6">
          <h1 className="text-4xl font-bold text-heading">Overview</h1>
        </header>

        <main className="">
          <label
            htmlFor="database-modal"
            style={{
              background:
                "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgb(121 87 255 / 80%) 75%)",
            }}
            className="btn-md btn mx-4 inline-flex cursor-pointer items-center justify-center rounded-xl border-none px-4 text-base font-semibold capitalize text-white shadow-sm hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80"
          >
            Add Database
          </label>
          {fetchedDatabases.length === 0 ? (
            <h1>You don't have any databases added.</h1>
          ) : (
            <Table databases={fetchedDatabases} />
          )}
        </main>
      </div>
      <input type="checkbox" id="database-modal" className="modal-toggle" />
      <label htmlFor="database-modal" className="modal cursor-pointer">
        <label className="modal-box relative w-11/12 max-w-5xl" htmlFor="">
          <h3 className="text-2xl font-bold text-black">Add a Database</h3>
          <div className="my-4">
            {newDatabases.length > 0 &&
              newDatabases.map((database, index) => (
                <div
                  key={index}
                  onClick={() => selectDatabase(index)}
                  className={`mb-4 flex cursor-pointer items-center rounded-lg p-4 shadow-md ${database.selected ? "border-4 border-[#0fe0b6]" : ""
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
    </Layout>
  );
}