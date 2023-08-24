import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const getSchemaFromVault = async (supabase, secret_id: string) => {
  const { data, error } = await supabase.rpc("read_schema_data", {
    secret_id: secret_id,
  });

  if (error) {
    return {
      data: null,
      error,
    };
  } else {
    return {
      data: JSON.parse(data),
      error: null,
    };
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { database_uuid } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!database_uuid) {
    return res.status(400).json({ message: "Missing fields" });
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
    const { data: schema_id, error: schemaError } = await supabase
      .from("user_schemas")
      .select("*")
      .eq("uuid", database_uuid)
      .single();

    if (schemaError) {
      console.log("schema", schemaError);
      return res.status(500).json(schemaError);
    }

    const { data, error } = await getSchemaFromVault(
      supabase,
      schema_id.schema_data
    );

    if (error) {
      console.log("vault", error);
      return res.status(500).json(error);
    }
    return res.status(200).json({ title: schema_id.title, ...data });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}
