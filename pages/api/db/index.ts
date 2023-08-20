import { BasisTheory } from "@basis-theory/basis-theory-js";
import { Pool } from "pg";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

type UUIDSupabaseResponse = { data: { database_string: string }; error: any };
const getDatabaseStringFromUUID = async (
  database_uuid: string
): Promise<{
  data?: { database_string: string };
  error?: any;
}> => {
  try {
    const { data, error }: UUIDSupabaseResponse = await supabase
      .from("user_databases")
      .select("database_string")
      .eq("uuid", database_uuid)
      .single();

    if (error || !data || Object.keys(data).length === 0) {
      console.log("Error:", error);
      throw new Error(error.message || "Error fetching database string");
    }

    return { data: { database_string: data.database_string }, error: null };
  } catch (e) {
    return { error: e, data: null };
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bt = await new BasisTheory().init(
    process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
  );

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { query, connectionStringToken, uuid } = req.body;

  if (!query || !connectionStringToken) {
    res
      .status(400)
      .json({ error: "No query or connection string token provided" });
    return;
  }

  try {
    const { data, error } = await getDatabaseStringFromUUID(uuid);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const connectionStringObject = await bt.tokens.retrieve(
      data.database_string
    );
    const connectionString = connectionStringObject.data;

    const pool = new Pool({
      connectionString,
    });

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to run query",
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
}
