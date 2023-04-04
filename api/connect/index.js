const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

app.post("*", async (req, res) => {
  const { connection_string } = req.body;

  const pool = new Pool({
    connectionString: connection_string,
  });

  try {
    const client = await pool.connect();

    // Get list of databases
    const { rows: databaseRows } = await client.query(
      "SELECT datname FROM pg_database WHERE datname NOT IN ('template0', 'template1');"
    );
    const databases = databaseRows.map((row) => row.datname);

    // Get list of tables, columns, and foreign keys in each database
    const databaseInfo = {};
    for (const database of databases) {
      const { rows: tableRows } = await client.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';"
      );
      const tables = tableRows.map((row) => row.tablename);

      const tableInfo = {};
      for (const table of tables) {
      }

      databaseInfo[database] = tableInfo;
    }
    client.release();
    res.json(databaseInfo);
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .json({
        status: "error",
        message: "An unexpected error occurred: " + e.message,
      });
  }
});

module.exports = app;
