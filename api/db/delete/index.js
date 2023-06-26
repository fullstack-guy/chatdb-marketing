const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const basisTheoryApiKey = process.env.NEXT_PRIVATE_BASIS_THEORY_KEY;

const app = express();

app.use(express.json());

app.delete("*", ClerkExpressRequireAuth(), async (req, res) => {
  const database = req.query.database;

  // Fetch the database_string token before deleting the record
  const { data: tokenData, error: tokenError } = await supabase
    .from("user_databases")
    .select("database_string")
    .eq("uuid", database);

  if (tokenError) {
    console.error("Error fetching database string token:", tokenError);
    return res.status(500).send({ error: tokenError });
  }

  const token = tokenData[0]?.database_string;

  // First delete from user_schemas
  const { data: dataSchema, error: errorSchema } = await supabase
    .from("user_schemas")
    .delete()
    .eq("uuid", database);

  if (errorSchema) {
    console.error("Error deleting schemas:", errorSchema);
    return res.status(500).send({ error: errorSchema });
  }

  // Then delete from user_databases
  const { data: dataDatabase, error: errorDatabase } = await supabase
    .from("user_databases")
    .delete()
    .eq("uuid", database);

  if (errorDatabase) {
    console.error("Error deleting database:", errorDatabase);
    return res.status(500).send({ error: errorDatabase });
  }

  // Now delete the basis theory token
  try {
    await axios.delete(`https://api.basistheory.com/tokens/${token}`, {
      headers: {
        "BT-API-KEY": `${basisTheoryApiKey}`,
      },
    });
  } catch (err) {
    console.error("Error deleting Basis Theory token:", err);
    return res.status(500).send({ error: err.message });
  }

  // If everything is fine, send a success response
  res.status(200).send({
    message: "Success",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).json({ error: "Unauthenticated!" });
});

module.exports = app;
