import React, { useEffect, useState } from "react";
import useSupabase from "../../../hooks/useSupabaseClient.js";

interface Query {
  id: number;
  database_uuid: string;
  query: string;
  sql: string;
}

interface SavedQueriesProps {
  database_uuid: string;
  runQuery: (query: string) => void;
}

const SavedQueries: React.FC<SavedQueriesProps> = ({
  database_uuid,
  runQuery,
}) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchQueries = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("favorite_queries")
        .select("*")
        .eq("database_uuid", database_uuid)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching queries:", error);
      } else if (data) {
        setQueries(data);
      }
    };

    fetchQueries();
  }, [supabase]);

  // If there are no queries, return null
  if (queries.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col items-center">
      {queries.map((query) => (
        <div
          className="relative inline-flex transform transition-all duration-300 hover:scale-105"
          key={query.id}
          onClick={() => runQuery(query.sql)}
        >
          <div className="absolute z-0 h-full w-full rounded-lg opacity-0 transition-all duration-300 hover:opacity-100"></div>
          <div
            className="relative z-10 m-2 w-full flex-none cursor-pointer rounded-lg border p-3 shadow-md"
            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
          >
            <h4 className="text-center text-sm text-black">{query.query}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedQueries;
