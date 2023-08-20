import { Pool } from "pg";
import { BasisTheory } from "@basis-theory/basis-theory-js";
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

function simplifyDataType(dataType) {
  // TODO: Strong typing dataType
  const dataTypeMapping = {
    "character varying": "text",
    "timestamp without time zone": "timestamp",
  };

  return dataTypeMapping[dataType] || dataType;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { connection_string, uuid } = req.body;

  if (uuid) {
    const { data, error } = await getDatabaseStringFromUUID(uuid);

    if (error) {
      console.error("Error fetching database string token:", error);
      res.status(400).json({ error: error.message });
      return;
    }
    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );

    const connectionStringObject = await bt.tokens.retrieve(
      data.database_string
    );
    connection_string = connectionStringObject.data;
  }

  const pool = new Pool({
    connectionString: connection_string,
  });

  try {
    const client = await pool.connect();

    const excludedSchemas = ["information_schema", "pg_catalog"];
    const { rows: schemaRows } = await client.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN (${excludedSchemas
        .map((_, i) => "$" + (i + 1))
        .join(",")});`,
      excludedSchemas
    );

    const databaseInfo = {};

    for (const schemaRow of schemaRows) {
      const schema = schemaRow.schema_name;
      databaseInfo[schema] = {};

      const { rows: tableRows } = await client.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = $1;",
        [schema]
      );

      for (const tableRow of tableRows) {
        const table = tableRow.tablename;
        databaseInfo[schema][table] = {};

        const { rows: columnRows } = await client.query(
          `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1 AND table_schema = $2;`,
          [table, schema]
        );

        for (const columnRow of columnRows) {
          databaseInfo[schema][table][columnRow.column_name] = {
            type: simplifyDataType(columnRow.data_type),
            nullable: columnRow.is_nullable === "YES",
          };
        }

        const { rows: foreignKeyRows } = await client.query(
          `
          SELECT 
            kcu.column_name, 
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name, 
            ccu.column_name AS foreign_column_name 
          FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1 AND tc.table_schema = $2
          `,
          [table, schema]
        );

        for (const foreignKeyRow of foreignKeyRows) {
          if (!databaseInfo[schema][table].foreignKeys) {
            databaseInfo[schema][table].foreignKeys = [];
          }
          databaseInfo[schema][table].foreignKeys.push({
            column: foreignKeyRow.column_name,
            foreignTableSchema: foreignKeyRow.foreign_table_schema,
            foreignTable: foreignKeyRow.foreign_table_name,
            foreignColumn: foreignKeyRow.foreign_column_name,
          });
        }
      }
    }

    client.release();
    res.status(200).json(databaseInfo);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "error",
      message: "An unexpected error occurred: " + e.message,
    });
  }
}
