import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

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

export default async function handler(req: NextRequest) {
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
    console.error("Error fetching database string token:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  const database_string = data.database_string;
  // First delete from user_schemas
  const { data: dataSchema, error: errorSchema } = await supabase
    .from("user_schemas")
    .delete()
    .eq("uuid", uuid);

  if (errorSchema) {
    console.error("Error deleting schemas:", errorSchema);
    return NextResponse.json({ error: errorSchema }, { status: 500 });
  }

  const { error: errorDatabase } = await supabase
    .from("user_databases")
    .delete()
    .eq("uuid", uuid);

  if (errorDatabase) {
    console.error("Error deleting database:", errorDatabase);
    return NextResponse.json({ error: errorDatabase }, { status: 500 });
  }

  try {
    await axios.delete(
      `https://api.basistheory.com/tokens/${database_string}`,
      {
        headers: {
          "BT-API-KEY": `${basisTheoryApiKey}`,
        },
      }
    );
  } catch (err) {
    console.error("Error deleting Basis Theory token:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ message: "Database deleted" }, { status: 200 });
}
