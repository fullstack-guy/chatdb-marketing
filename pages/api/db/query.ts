import { getAuth } from "@clerk/nextjs/server";
import { Pool } from "pg";
import { BasisTheory } from "@basis-theory/basis-theory-js";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Parser } from 'node-sql-parser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const parser = new Parser();

type UUIDSupabaseResponse = { data: { database_string: string }; error: any };
const getDatabaseStringFromUUID = async (
  supabase,
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
  const { query, database_uuid } = req.body;
  if (!query || !database_uuid) {
    res.status(400).json({ error: "No query or database uuid provided" });
    return;
  }

  // Parse the SQL query to AST
  const ast = parser.astify(query);

  // Check if AST is an array (multiple queries) or a single object
  if (Array.isArray(ast)) {
    res.status(400).json({ error: "Multiple queries are not allowed" });
    return;
  } else if (ast.type !== 'select') {
    res.status(400).json({ error: "Only SELECT queries are allowed" });
    return;
  }

  const auth = getAuth(req);
  const token = await auth.getToken({ template: "supabase" });

  const supabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
  try {
    const { data, error } = await getDatabaseStringFromUUID(
      supabase,
      database_uuid
    );

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );
    const connectionStringObject = await bt.tokens.retrieve(
      data.database_string
    );
    const connection_string = "postgres://" + connectionStringObject.data;

    const pool = new Pool({
      connectionString: connection_string,
    });

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    // Extracting columns and rows in the desired format
    const columns = result.fields.map((field) => field.name);
    const rows = result.rows.map((row) => columns.map((column) => row[column]));

    return res.status(200).json({
      sql: query,
      data: {
        columns,
        rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to run query",
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
}
