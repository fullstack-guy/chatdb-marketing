import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { Clerk } from "@clerk/clerk-sdk-node";

export const config = {
  runtime: "edge",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const clerk = Clerk({ apiKey: process.env.CLERK_API_SECRET });
const basisTheoryApiKey = process.env.NEXT_PRIVATE_BASIS_THEORY_KEY;

export default async function handler(req: NextRequest) {
  // This is test to see if we are running on the edge
  if (typeof global.EdgeRuntime === "string") {
    console.log("This code is running on", global.EdgeRuntime);
  }

  const sessionToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthenticated!" }, { status: 401 });
  }

  try {
    await clerk.base.verifySessionToken(sessionToken);
  } catch (error) {
    return NextResponse.json({ error: "Unauthenticated!" }, { status: 401 });
  }

  const { url } = req;
  const database = new URL(url).searchParams.get("database");

  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  if (!database) {
    return NextResponse.json(
      { message: "Database not specified" },
      { status: 400 }
    );
  }

  const { data: tokenData, error: tokenError } = await supabase
    .from("user_databases")
    .select("database_string")
    .eq("uuid", database);

  if (tokenError) {
    console.error("Error fetching database string token:", tokenError);
    return NextResponse.json({ error: tokenError }, { status: 500 });
  }

  const token = tokenData[0]?.database_string;

  // First delete from user_schemas
  const { data: dataSchema, error: errorSchema } = await supabase
    .from("user_schemas")
    .delete()
    .eq("uuid", database);

  if (errorSchema) {
    console.error("Error deleting schemas:", errorSchema);
    return NextResponse.json({ error: errorSchema }, { status: 500 });
  }

  const { data: dataDatabase, error: errorDatabase } = await supabase
    .from("user_databases")
    .delete()
    .eq("uuid", database);

  if (errorDatabase) {
    console.error("Error deleting database:", errorDatabase);
    return NextResponse.json({ error: errorDatabase }, { status: 500 });
  }

  try {
    await axios.delete(`https://api.basistheory.com/tokens/${token}`, {
      headers: {
        "BT-API-KEY": `${basisTheoryApiKey}`,
      },
    });
  } catch (err) {
    console.error("Error deleting Basis Theory token:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ message: "Database deleted" }, { status: 200 });
}
