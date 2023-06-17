import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import {
  BasisTheoryProvider,
  BasisTheoryApiError,
  BasisTheoryValidationError,
  useBasisTheory,
} from "@basis-theory/basis-theory-react";
import supabase from "../../../utils/supabaseClient";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionString, setConnectionString] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [connectionStringError, setConnectionStringError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [databaseInfo, setDatabaseInfo] = useState(null);
  const { user } = useUser();
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_KEY, {
    elements: true,
  });

  const saveDatabase = async () => {
    setSaving(true);
    try {
      await handleApiResponse(
        databaseInfo,
        user,
        connectionString,
        name,
        toast,
        bt
      );
      toast.success("Database saved successfully!");
    } catch (error) {
      toast.error("There was an error saving the database!");
    } finally {
      setSaving(false);
    }
  };

  const handleApiResponse = async (
    data,
    user,
    connectionString,
    name,
    toast,
    bt
  ) => {
    try {
      // Check if the database already exists
      const { data: existingDatabases, error: dbError } = await supabase
        .from("user_databases")
        .select("*")
        .eq("user_id", user.id)
        .eq("database_string", "postgres://" + connectionString);

      if (dbError) {
        console.error(
          "Error checking for existing databases in Supabase:",
          dbError
        );
        toast.error("Error checking for existing databases in Supabase");
        return;
      }

      if (existingDatabases.length > 0) {
        toast("Database already exists!");
        return;
      }

      // Proceed with inserting data if the database doesn't exist
      const { data: insertedSchemas, error: schemaError } = await supabase
        .from("user_schemas")
        .insert([
          {
            user_id: user.id,
            schema_data: data,
            title: name,
          },
        ])
        .select("uuid"); // Include the 'id' in the response

      if (schemaError) {
        console.error("Error saving data to Supabase:", schemaError);
        toast.error("Error saving data to Supabase");
        return;
      }

      const userID = insertedSchemas[0].uuid; // Get the id of the inserted schema

      try {
        const databaseTokens = await bt.tokenize({
          database_string: "postgres://" + connectionString,
        });

        const { error } = await supabase
          .from("user_databases")
          .insert([{ ...databaseTokens, user_id: user.id, uuid: userID }]);

        if (error) {
          console.error("Error saving data to Supabase:", error);
          toast.error("Error saving database string to Supabase");
        } else {
          toast.success("Woo! You have a new database!");
          router.push("/dashboard");
        }
      } catch (error) {
        if (error instanceof BasisTheoryValidationError) {
          console.log(error);
          toast.error("BasisTheory Validation Error");
        } else if (error instanceof BasisTheoryApiError) {
          console.log(error);
          toast.error("BasisTheory API Error");
        }
      }
    } catch (error) {
      console.error("Error saving data to Supabase:", error);
      toast.error("Error saving data to Supabase");
    }
  };

  const connectionStringChange = (event) => {
    const result = event.target.value.replace(/^postgres:\/\//, "");
    setConnectionString(result);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name || name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!connectionString || connectionString.trim() === "") {
      setConnectionStringError("Connection URL is required");
      isValid = false;
    } else {
      setConnectionStringError(null);
    }

    return isValid;
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const connectToDatabase = async () => {
    if (!validateInputs()) {
      return;
    }

    setConnecting(true);

    const url = "/api/connect";
    const body = {
      id: "bugatti",
      connection_string: "postgres://" + connectionString,
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
        setConnecting(false);
        toast.error("There was an error connecting to the database!");
      } else {
        const data = await response.json();
        setDatabaseInfo(data);

        toast("Successfully Connected", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "hsl(var(--su))",
            color: "#fff",
            fontWeight: "500",
          },
        });
        setConnected(true);
        setConnecting(false);
        return data;
      }
    } catch (error) {
      console.error(error);
      setConnecting(false);
      toast.error("There was an error connecting to the database!");
    }
  };

  return (
    <Layout>
      {/* BreadCrumbs */}
      <div className="breadcrumbs ml-10 text-sm">
        <ul>
          <li className="text-black">
            <Link href="/dashboard">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                Databases
              </a>
            </Link>
          </li>
          <li className="text-black">Postgres</li>
        </ul>
      </div>

      {/* Select Options */}
      <div className="m-auto lg:mx-[20%]">
        <div className="w-full text-center">
          <div className="container my-auto mx-auto">
            <h1 className="mt-10 text-3xl font-bold text-black">
              Take a Snapshot
            </h1>

            <h1 className="text-sm text-black">
              We will not store or modify any of the data in your tables!
            </h1>
          </div>
          <div className="m-10 items-center justify-center">
            <div className="flex w-full flex-col border-opacity-50">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="w-full">
                  <BasisTheoryProvider bt={bt}>
                    <label
                      htmlFor="url"
                      className="m-2 block text-xl font-semibold text-black"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="My Fresh Database 🤘"
                      className="input-bordered input w-[50%] text-black"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {nameError && (
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {nameError}
                      </p>
                    )}
                    <label
                      htmlFor="url"
                      className="m-3 block text-xl font-semibold text-black"
                    >
                      Connection URL
                    </label>
                    <label className="input-group mb-5 justify-center">
                      <span className="bg-gray-700 px-2 font-semibold text-white">
                        postgresql://
                      </span>
                      <input
                        type="text"
                        placeholder="localhost:5432/db"
                        className="input-bordered input w-[50%] text-black"
                        value={connectionString}
                        onChange={connectionStringChange}
                      />
                      <span
                        className={`btn hidden sm:flex ${connecting || saving ? "loading" : ""
                          } cursor-pointer border-none bg-success font-semibold text-black hover:bg-success`}
                        onClick={connected ? saveDatabase : connectToDatabase}
                      >
                        {connecting ? (
                          <>Connecting</>
                        ) : connected ? (
                          saving ? (
                            <>Saving...</>
                          ) : (
                            <>
                              Save{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className=" ml-1 h-6 w-6"
                              >
                                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </>
                          )
                        ) : (
                          <>Connect</>
                        )}
                      </span>
                    </label>
                    {connectionStringError && (
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {connectionStringError}
                      </p>
                    )}
                    <div className="my-2 w-full">
                      <button
                        className={`btn ${connecting && "loading"
                          } mx-auto my-2 flex w-[75%] bg-success font-semibold text-black hover:bg-success sm:hidden`}
                        onClick={connectToDatabase}
                        type="submit"
                      >
                        {connecting ? (
                          <>Connecting</>
                        ) : connected ? (
                          <>
                            Connected{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className=" ml-1 h-6 w-6"
                            >
                              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </>
                        ) : (
                          <>Connect</>
                        )}
                      </button>
                    </div>
                  </BasisTheoryProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="invisible">Picture Here</div>
      </div>
      <Toaster position="bottom-center" />
    </Layout>
  );
}
