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

    // Get schemas and exclude certain schemas
    const excludedSchemas = ["information_schema", "pg_catalog"];
    const { rows: schemaRows } = await client.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN (${excludedSchemas
        .map((_, i) => "$" + (i + 1))
        .join(",")});`,
      excludedSchemas
    );
    const schemas = schemaRows.map((row) => row.schema_name);

    // Get tables
    const { rows: tableRows } = await client.query(
      "SELECT tablename, schemaname FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('information_schema', 'pg_catalog');"
    );
    const tables = tableRows.map((row) => ({
      name: row.tablename,
      schema: row.schemaname,
    }));

    // Get views
    const { rows: viewRows } = await client.query(
      "SELECT table_name, table_schema FROM information_schema.views WHERE table_schema NOT IN ('information_schema', 'pg_catalog');"
    );
    const views = viewRows.map((row) => ({
      name: row.table_name,
      schema: row.table_schema,
    }));

    // Get fields, datatypes, and relationships for each table
    const tablesInfo = {};
    for (const table of tables) {
      const { rows: columnRows } = await client.query(
        `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = $2;`,
        [table.name, table.schema]
      );
      const columns = columnRows.map((row) => ({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === "YES",
      }));

      const { rows: foreignKeyRows } = await client.query(
        `
        SELECT
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE
          tc.constraint_type = 'FOREIGN KEY' AND
          tc.table_name = $1 AND
          tc.table_schema = $2;`,
        [table.name, table.schema]
      );

      const relationships = foreignKeyRows.map((row) => ({
        column: row.column_name,
        foreignTable: row.foreign_table_name,
        foreignColumn: row.foreign_column_name,
      }));

      tablesInfo[table.name] = {
        schema: table.schema,
        columns,
        relationships,
      };
    }

    // Prepare databaseInfo object for the target database
    const databaseInfo = {
      schemas,
      tables: tables.map((table) => table.name),
      views: views.map((view) => view.name),
      tablesInfo,
    };

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
