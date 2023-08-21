import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const basisTheoryApiKey = process.env.NEXT_PRIVATE_BASIS_THEORY_KEY;

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

const deleteSchemaFromVault = async (secret_id: string) => {
  const { data, error } = await supabase.rpc("delete_secret_by_id", {
    secret_id: secret_id,
  });

  if (error) {
    return {
      data: null,
      error,
    };
  } else {
    return {
      data,
      error: null,
    };
  }
};

export default async function handler(req: NextRequest) {
  try {
    const { url } = req;
    const uuid = new URL(url).searchParams.get("uuid");

    if (req.method !== "DELETE") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    if (!uuid) {
      return NextResponse.json(
        { message: "Database not specified" },
        { status: 400 }
      );
    }

    const { data, error } = await getDatabaseStringFromUUID(uuid);

    if (error) {
      NextResponse.json({ error: error.message }, { status: 500 });
    }

    const database_string = data.database_string;

    const { data: dataSchema, error: errorSchema } = await supabase
      .from("user_schemas")
      .select("schema_data")
      .eq("uuid", uuid)
      .single();

    if (errorSchema) {
      throw new Error(`Error deleting schemas: ${errorSchema}`);
    }

    const { error: errorVault } = await deleteSchemaFromVault(
      dataSchema.schema_data
    );

    if (errorVault) {
      throw new Error(`Error deleting schema from vault: ${errorVault}`);
    }

    const { error: errorSchemaDelete } = await supabase
      .from("user_schemas")
      .delete()
      .eq("uuid", uuid);

    if (errorSchemaDelete) {
      throw new Error(`Error deleting schema: ${errorSchemaDelete}`);
    }

    const { error: errorDatabase } = await supabase
      .from("user_databases")
      .delete()
      .eq("uuid", uuid);

    if (errorDatabase) {
      throw new Error(`Error deleting database: ${errorDatabase}`);
    }

    const response = await fetch(
      `https://api.basistheory.com/tokens/${database_string}`,
      {
        method: "DELETE",
        headers: {
          "BT-API-KEY": `${basisTheoryApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        `Error deleting Basis Theory token: ${
          responseData.error || "Unknown error"
        }`
      );
    }

    return NextResponse.json({ message: "Database deleted" }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
