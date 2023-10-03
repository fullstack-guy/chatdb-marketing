import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import {
  BasisTheoryProvider,
  useBasisTheory,
} from "@basis-theory/basis-theory-react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import UpdateSubscriptionModal from "../../../components/UpdateSubscriptionModal";

export default function Page() {
  const router = useRouter();
  const [
    isUpdateSubscriptionModalOpeneded,
    setIsUpdateSubscriptionModalOpened,
  ] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionString, setConnectionString] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [connectionStringError, setConnectionStringError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("url");

  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("postgres");
  const [port, setPort] = useState("5432");
  const [ssl, setSSL] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!name || name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (activeTab === "url") {
      if (!connectionString || connectionString.trim() === "") {
        setConnectionStringError("Connection URL is required");
        isValid = false;
      } else {
        setConnectionStringError(null);
      }
    } else {
      if (!host || host.trim() === "") {
        setError("Host is required");
        isValid = false;
      } else {
        setError(null);
      }

      if (!username || username.trim() === "") {
        setError("Username is required");
        isValid = false;
      } else {
        setError(null);
      }

      if (!password || password.trim() === "") {
        setError("Password is required");
        isValid = false;
      } else {
        setError(null);
      }

      if (!database || database.trim() === "") {
        setError("Database name is required");
        isValid = false;
      } else {
        setError(null);
      }
    }

    return isValid;
  };

  const [databaseInfo, setDatabaseInfo] = useState(null);
  const { user } = useUser();
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_KEY, {
    elements: true,
  });
  const {
    isLoading,
    isError,
    data: subscriptionStatus,
  } = trpc.subscriptions.status.useQuery(null, {
    refetchOnWindowFocus: false,
    retry: 3,
    retryOnMount: false,
  });
  const upgradeSubscription = trpc.subscriptions.update.useMutation({
    onMutate: () => {
      toast.loading("Updating plan...", {
        duration: 2000,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 2000,
      });
      saveDatabase(getConnectionString());
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 2000,
      });
    },
  });
  useEffect(() => {
    if (connected) {
      setConnected(false);
    }
  }, [connectionString]);

  const saveDatabase = async (connectionStr) => {
    setSaving(true);
    try {
      await handleApiResponse(
        databaseInfo,
        user,
        connectionStr,
        name,
        toast,
        bt
      );
    } catch (error) {
      toast.error("There was an error saving the database!");
    } finally {
      setSaving(false);
    }
  };

  const handleApiResponse = async (
    data,
    user,
    database_string,
    name,
    toast,
    bt
  ) => {
    try {
      // Send a POST request to /api/db/create
      const response = await fetch("/api/db/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schema_data: data,
          user: user,
          databaseString: database_string,
          name: name,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      // Assuming the API returns an error in the response when something goes wrong
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      toast.success("Woo! You have a new database!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred");
    }
  };

  const connectionStringChange = (event) => {
    const result = event.target.value
      .replace(/^postgres:\/\//, "")
      .replace(/^postgresql:\/\//, "");
    setConnectionString(result);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const getConnectionString = (fromDetails = false) => {
    let baseString = "";
    if (fromDetails) {
      baseString = `${username}:${password}@${host}:${port}/${database}`;

      // Append SSL configuration if SSL is enabled
      if (ssl) {
        baseString += "?sslmode=require";
      }
    } else {
      baseString = connectionString;
    }

    return baseString;
  };

  const connectToDatabase = async (connectionStr) => {
    if (!validateInputs()) {
      return;
    }

    setConnecting(true);

    const url = "/fastify/api/db/connect";
    const body = {
      connection_string: "postgres://" + connectionStr,
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
        const errorData = await response.json();
        setError(errorData.message);
        setConnecting(false);
      } else {
        const data = await response.json();
        setDatabaseInfo(data);
        setError(null);

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
      setError(error.message);
    }
  };

  const renderUpdateSubcriptionModal = (subscriptionStatus: {
    remainingDatabases: number;
  }) => {
    if (
      subscriptionStatus.remainingDatabases !== null &&
      subscriptionStatus.remainingDatabases <= 0
    ) {
      return (
        <UpdateSubscriptionModal
          open={isUpdateSubscriptionModalOpeneded}
          setOpen={setIsUpdateSubscriptionModalOpened}
          description={
            " You have reached the maximum number of databases allowed on your current plan. Please upgrade your plan to create more databases."
          }
          title={"Maximum number of databases reached"}
          actionDescription={"Upgrade"}
          action={() =>
            upgradeSubscription.mutateAsync({
              plan: "chatDB Pro Plan",
            })
          }
        />
      );
    } else if (subscriptionStatus.remainingDatabases === null) {
      return (
        <UpdateSubscriptionModal
          open={isUpdateSubscriptionModalOpeneded}
          setOpen={setIsUpdateSubscriptionModalOpened}
          description={
            "You are not subscribed to any plan. Please choose a plan to start creating databases."
          }
          title={"Choose a Plan"}
          actionDescription={"View Pricing"}
          action={() => router.push("/pricing")}
        />
      );
    }
  };

  return (
    <Layout>
      {/* BreadCrumbs */}
      <div className="breadcrumbs ml-10 text-sm">
        <ul>
          <li className="text-black">
            <Link href="/dashboard">
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
            </Link>
          </li>
          <li className="text-black">Postgres</li>
        </ul>
      </div>

      {/* Select Options */}
      <div className="m-auto lg:mx-[20%]">
        <div className="w-full text-center">
          <div className="container mx-auto my-auto">
            <h1 className="mt-10 text-3xl text-black">Connect your Database</h1>
            <h1 className="text-sm text-black">
              We will not store or modify any of the data in your tables!
            </h1>
          </div>
          <div className="m-10 items-center justify-center">
            <div className="flex w-full flex-col border-opacity-50">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="w-full">
                  <BasisTheoryProvider bt={bt}>
                    <div className="flex items-center justify-center rounded-lg bg-gray-100 px-2 py-2">
                      <button
                        className={`ml-3 mr-2 flex-1 rounded-lg px-4 py-2 text-center transition duration-300 ease-in-out ${activeTab === "url"
                          ? "bg-[#3D4451] text-white"
                          : "bg-white text-black hover:bg-gray-200"
                          }`}
                        onClick={() => setActiveTab("url")}
                      >
                        Connect with URL
                      </button>
                      <button
                        className={`ml-2 mr-3 flex-1 rounded-lg px-4 py-2 text-center transition duration-300 ease-in-out ${activeTab === "details"
                          ? "bg-[#3D4451] text-white"
                          : "bg-white text-black hover:bg-gray-200"
                          }`}
                        onClick={() => setActiveTab("details")}
                      >
                        Connect with Details
                      </button>
                    </div>
                    <label
                      htmlFor="url"
                      className="m-2 mt-5 block text-xl font-semibold text-black"
                    >
                      Connection Name
                    </label>
                    <input
                      type="text"
                      placeholder="My Fresh Database 🤘"
                      className="input-bordered input w-[50%] font-bold text-black"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {nameError && (
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {nameError}
                      </p>
                    )}

                    {/* Render the appropriate form based on the active tab */}
                    {activeTab === "url" ? (
                      <>
                        <label
                          htmlFor="url"
                          className="m-3 block text-xl font-semibold text-black"
                        >
                          Connection URL
                        </label>
                        <div className="input-group mb-5 justify-center">
                          <span className="input-group-text bg-gray-700 text-white">
                            postgresql://
                          </span>
                          <input
                            type="text"
                            placeholder="localhost:5432/db"
                            className="form-control text-black"
                            value={connectionString}
                            onChange={connectionStringChange}
                          />
                          <button
                            className={`btn ${connecting || saving ? "btn-loading" : ""
                              } cursor-pointer border-none bg-success text-black hover:bg-success`}
                            onClick={
                              connected
                                ? () => saveDatabase(getConnectionString())
                                : () => connectToDatabase(getConnectionString())
                            }
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
                          </button>
                        </div>
                        {connectionStringError && (
                          <p className="mt-1 text-sm font-bold text-red-600">
                            {connectionStringError}
                          </p>
                        )}
                        <div className="my-2 w-full">
                          <button
                            className={`btn ${connecting && "btn-loading"
                              } mx-auto my-2 flex w-[75%] bg-success text-black hover:bg-success sm:hidden`}
                            onClick={
                              connected
                                ? () => saveDatabase(getConnectionString())
                                : () => connectToDatabase(getConnectionString())
                            }
                            type="submit"
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
                          </button>
                        </div>
                      </>
                    ) : (
                      // New form for connection with host, username, password, and database
                      <>
                        <div className="mt-5 flex space-x-4">
                          <div className="w-1/2 space-y-4">
                            <label
                              htmlFor="host"
                              className="block text-lg font-semibold text-black"
                            >
                              Host
                            </label>
                            <input
                              type="text"
                              id="host"
                              className="input-bordered input w-full text-black"
                              value={host}
                              onChange={(e) => setHost(e.target.value)}
                              placeholder="db.example.com"
                            />
                            <label
                              htmlFor="username"
                              className="block text-lg font-semibold text-black"
                            >
                              User
                            </label>
                            <input
                              type="text"
                              id="username"
                              className="input-bordered input w-full text-black"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="postgres"
                            />
                            <label
                              htmlFor="port"
                              className="block text-lg font-semibold text-black"
                            >
                              Port
                            </label>
                            <input
                              type="number"
                              id="port"
                              className="input-bordered input w-full text-black"
                              value={port}
                              onChange={(e) => setPort(e.target.value)}
                              placeholder="5432"
                            />{" "}
                            {/* 5432 is a common default for PostgreSQL */}
                          </div>

                          <div className="w-1/2 space-y-4">
                            <label
                              htmlFor="password"
                              className="block text-lg font-semibold text-black"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              className="input-bordered input w-full text-black"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter Password"
                            />

                            <label
                              htmlFor="database"
                              className="block text-lg font-semibold text-black"
                            >
                              Database
                            </label>
                            <input
                              type="text"
                              id="database"
                              className="input-bordered input w-full text-black"
                              value={database}
                              onChange={(e) => setDatabase(e.target.value)}
                              placeholder="postgres"
                            />

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={ssl}
                                onChange={(e) => setSSL(e.target.checked)}
                              />
                              <label
                                htmlFor="ssl"
                                className="ml-2 text-lg font-semibold text-black"
                              >
                                Use SSL
                              </label>
                            </div>
                          </div>
                        </div>

                        <button
                          className={`btn ${connecting || saving ? "loading" : ""
                            } mt-5 w-[75%] cursor-pointer border-none bg-success text-black hover:bg-success`}
                          onClick={
                            connected
                              ? () => saveDatabase(getConnectionString(true))
                              : () =>
                                connectToDatabase(getConnectionString(true))
                          }
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
                        </button>
                      </>
                    )}
                    {error && (
                      <p className="mt-1 text-sm font-semibold text-red-600">
                        {error}
                      </p>
                    )}
                    <div className="mb-2 mt-10 rounded-md border-l-4 border-gray-50 bg-gray-300 p-2">
                      <p className="text-sm font-semibold text-black">
                        We recommend{" "}
                        <Link
                          href="/post/how-to-create-read-only-postgres-user"
                          className="text-black underline"
                          target="_blank"
                        >
                          creating a read-only account with specific permissions
                        </Link>
                        .
                      </p>
                    </div>
                  </BasisTheoryProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
      {subscriptionStatus && renderUpdateSubcriptionModal(subscriptionStatus)}
    </Layout>
  );
}
