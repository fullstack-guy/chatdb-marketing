import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const updateSchemaInVault = async (
  supabase,
  secret_id: string,
  new_schema: string,
  new_name: string,
  new_desc: string
) => {
  const { data, error } = await supabase.rpc("update_schema_data", {
    secret_id: secret_id,
    new_schema: new_schema,
    new_name: `${new_name}-${new Date().getTime()}`,
    new_desc: new_desc,
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
  const { database_uuid, schema_data, user } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!database_uuid || !schema_data || !user) {
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
    const { data, error } = await supabase
      .from("user_schemas")
      .select("schema_data, title")
      .eq("uuid", database_uuid)
      .single();

    if (error) {
      console.log("schema", error);
      return res.status(500).json(error);
    }

    const { data: updatedSchema, error: updateError } =
      await updateSchemaInVault(
        supabase,
        data.schema_data,
        schema_data,
        data.title,
        `Updated schema for ${data.title} created by ${user.id}`
      );

    if (updateError) {
      console.log("vault", updateError);
      return res.status(500).json(updateError);
    }

    return res.status(200).json({ message: "Schema updated!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}
