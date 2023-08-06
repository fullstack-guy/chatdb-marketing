const express = require("express");
const { BasisTheory } = require("@basis-theory/basis-theory-js");
const { Pool } = require("pg");
const { DataSource } = require("typeorm");
const { OpenAI } = require("langchain/llms/openai");
const { SqlDatabase } = require("langchain/sql_db");
const { SqlDatabaseChain } = require("langchain/chains");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const app = express();
app.use(express.json());

app.post("*", ClerkExpressRequireAuth(), async (req, res) => {
  // Extract the query and the connection string token from the request body
  const { query, connectionStringToken } = req.body;

  if (!query || !connectionStringToken) {
    return res
      .status(400)
      .json({ error: "No query or connection string token provided" });
  }

  try {
    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );

    // Use the Basis Theory API to retrieve the real connection string
    const connectionStringObject = await bt.tokens.retrieve(
      connectionStringToken
    );
    const connectionString = connectionStringObject.data; // get raw data from retrieved token

    // Initialize the Postgres connection with the retrieved connection string
    const pool = new Pool({ connectionString });

    const datasource = new DataSource({
      type: "postgres",
      url: connectionString,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    const chain = new SqlDatabaseChain({
      llm: new OpenAI({
        temperature: 0,
        openAIApiKey: process.env.OPEN_AI_KEY,
      }),
      database: db,
      sqlOutputKey: "sql",
    });

    const result = await chain.call({ query });

    res.status(200).json({
      result,
    });
  } catch (err) {
    console.error(err);
    // Return the error code and message in the response
    res.status(500).json({
      error: "Failed to process query",
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
