const express = require("express");
const { BasisTheory } = require("@basis-theory/basis-theory-js");
const { Pool } = require("pg");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const app = express();
app.use(express.json());

app.post("*", ClerkExpressRequireAuth(), async (req, res) => {
  const bt = await new BasisTheory().init(
    process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
  );

  // Extract the query and the connection string token from the request body
  const { query, connectionStringToken } = req.body;

  if (!query || !connectionStringToken) {
    res
      .status(400)
      .json({ error: "No query or connection string token provided" });
    return;
  }

  try {
    // Use the Basis Theory API to retrieve the real connection string
    const connectionStringObject = await bt.tokens.retrieve(
      connectionStringToken
    );
    const connectionString = connectionStringObject.data; // get raw data from retrieved token

    // Initialize the Postgres connection with the retrieved connection string
    const pool = new Pool({ connectionString });

    // Run the query
    const result = await pool.query(query);
    res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
      message: `${result.rowCount} rows affected by ${result.command} command`,
    });
  } catch (err) {
    console.error(err);
    // Return the error code and message in the response
    res.status(500).json({
      error: "Failed to run query",
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).json({ error: "Unauthenticated!" });
});
module.exports = app;
