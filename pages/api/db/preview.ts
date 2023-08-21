import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { BasisTheory } from "@basis-theory/basis-theory-js";
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
  const { database_uuid, table_name, pageNumber, where_clause, order_by } =
    req.body;

  try {
    if (!database_uuid) {
      res.status(400).json({
        status: "error",
        message: "No database uuid provided",
      });
      return;
    }

    const { data, error } = await getDatabaseStringFromUUID(database_uuid);

    if (error) {
      console.error("Error fetching database string:", error);
      res.status(400).json({ error: error.message });
      return;
    }

    const { database_string } = data;
    const offset = (pageNumber - 1) * 500;

    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );

    const connectionStringObject = await bt.tokens.retrieve(database_string);
    const connection_string = "postgres://" + connectionStringObject.data;

    const pool = new Pool({
      connectionString: connection_string,
    });

    const client = await pool.connect();

    let query = `SELECT * FROM ${table_name}`;
    let params = [];

    if (where_clause) {
      query += ` WHERE ${where_clause.statement}`;
      params = [...params, ...where_clause.values];
    }

    if (order_by) {
      query += ` ORDER BY ${order_by}`;
    }

    query += ` LIMIT $${params.length + 1}`;
    params.push(500);

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const { rows: tableData } = await client.query(query, params);

    client.release();
    res.status(200).json(tableData);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "error",
      message: "An unexpected error occurred: " + e.message,
    });
  }
  return;
}
