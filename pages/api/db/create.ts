import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { BasisTheory } from "@basis-theory/basis-theory-js";
import { getAuth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const storeSchemaInVault = async (
  supabase,
  schema_data: any,
  name: string,
  user
) => {
  const { data, error } = await supabase.rpc("insert_schema_data", {
    // let's add a time stamp to make the name unique
    name: `${name}-${new Date().getTime()}`,
    secret: schema_data,
    description: `Schema for ${name} created by ${user.id}`,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, schema_data, user, databaseString, name } = req.body;

  console.log("req.body", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!schema_data || !user || !name || !databaseString || !type) {
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
    const { data: schemaVaultID, error: vaultError } = await storeSchemaInVault(
      supabase,
      schema_data,
      name,
      user
    );

    if (vaultError) {
      console.log("vault", vaultError);
      return res.status(500).json(vaultError);
    }

    const { data: insertedSchemas, error: schemaError } = await supabase
      .from("user_schemas")
      .insert([
        {
          user_id: user.id,
          schema_data: schemaVaultID,
          title: name,
        },
      ])
      .select("uuid")
      .single();

    if (schemaError) {
      console.error("Error saving data to Supabase:", schemaError);
      return res.status(500).json(schemaError);
    }

    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );

    const databaseStringObject = await bt.tokenize({
      database_string: databaseString,
    });
    const database_string = databaseStringObject as { database_string: string };

    const { data, error } = await supabase
      .from("user_databases")
      .insert([
        {
          database_string: database_string.database_string,
          user_id: user.id,
          uuid: insertedSchemas.uuid,
          db_type: type,
        },
      ])
      .select("uuid");

    if (error) {
      console.error("Error saving data to Supabase:", error);
      res.status(500).json(error);
    }

    res.status(200).json(data);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
