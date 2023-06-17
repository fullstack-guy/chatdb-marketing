const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

function simplifyDataType(dataType) {
  const dataTypeMapping = {
    "character varying": "text",
    "timestamp without time zone": "timestamp",
  };

  return dataTypeMapping[dataType] || dataType;
}

app.post("*", async (req, res) => {
  const { connection_string } = req.body;

  const pool = new Pool({
    connectionString: connection_string,
  });

  try {
    const client = await pool.connect();

    // Get schemas and exclude certain schemas
    const excludedSchemas = ["information_schema", "pg_catalog"];
    const { rows: schemaRows } = await client.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN (${excludedSchemas
        .map((_, i) => "$" + (i + 1))
        .join(",")});`,
      excludedSchemas
    );

    const databaseInfo = {};

    for (const schemaRow of schemaRows) {
      const schema = schemaRow.schema_name;
      databaseInfo[schema] = {};

      // Get tables
      const { rows: tableRows } = await client.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = $1;",
        [schema]
      );

      for (const tableRow of tableRows) {
        const table = tableRow.tablename;
        databaseInfo[schema][table] = {};

        const { rows: columnRows } = await client.query(
          `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1 AND table_schema = $2;`,
          [table, schema]
        );

        for (const columnRow of columnRows) {
          databaseInfo[schema][table][columnRow.column_name] = {
            type: simplifyDataType(columnRow.data_type),
            nullable: columnRow.is_nullable === "YES",
          };
        }
      }
    }

    client.release();
    res.json(databaseInfo);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "error",
      message: "An unexpected error occurred: " + e.message,
    });
  }
});

module.exports = app;
