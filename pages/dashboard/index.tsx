import { useUser } from "@clerk/nextjs";
import Layout from "../../components/Layout";
import DatabaseCard from "../../components/DatabaseCard";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Layout>
      <div>
        <header className="mx-10 px-6 pt-12 pb-6">
          <h1 className="text-5xl font-bold text-heading">Dashboard</h1>
        </header>

        <main className="mx-6 mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <DatabaseCard
            name="EventsDB"
            description="The Database that holds Car Events! 🚗"
            tags={[]}
            updatedAt={"Yesterday"}
          />
        </main>
      </div>
    </Layout>
  );
}
