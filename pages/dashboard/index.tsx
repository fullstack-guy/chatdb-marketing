import { useUser } from "@clerk/nextjs";
import Layout from "../../components/Layout";
import Table from "../../components/dashboard/Table";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const databases = [
    {
      name: "EventsDB",
      type: "PostgreSQL",
      lastUpdated: "Yesterday"
    },
    {
      name: "EventsDB",
      type: "PostgreSQL",
      lastUpdated: "Yesterday"
    },
    {
      name: "EventsDB",
      type: "PostgreSQL",
      lastUpdated: "Yesterday"
    },
    {
      name: "EventsDB",
      type: "PostgreSQL",
      lastUpdated: "Yesterday"
    }
  ];

  return (
    <Layout>
      <div>
        <header className="pt-12 pb-6">
          <h1 className="text-4xl font-bold text-heading">Overview</h1>
        </header>

        <main className="">
          {
            databases.length === 0 ? (<h1>You don't have any databases added.</h1>) : (
              <Table databases={databases} />
            )
          }
        </main>
      </div>
    </Layout>
  );
}
