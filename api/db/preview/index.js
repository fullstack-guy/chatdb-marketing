const express = require("express");
const { Pool } = require("pg");
const { BasisTheory } = require("@basis-theory/basis-theory-js");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const app = express();
app.use(express.json());

app.post("*", ClerkExpressRequireAuth(), async (req, res) => {
  const {
    connectionStringToken,
    table_name,
    where_clause,
    offset,
    limit,
    order_by,
  } = req.body;

  try {
    const bt = await new BasisTheory().init(
      process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
    );

    const connectionStringObject = await bt.tokens.retrieve(
      connectionStringToken
    );
    const connection_string = connectionStringObject.data;

    const pool = new Pool({
      connectionString: connection_string,
    });

    const client = await pool.connect();

    let query = `SELECT * FROM ${table_name}`;
    let params = [];

    if (where_clause) {
      query += ` WHERE ${where_clause.statement}`;
      params = [...params, ...where_clause.values];
    }

    if (order_by) {
      query += ` ORDER BY ${order_by}`;
    }

    query += ` LIMIT $${params.length + 1}`;
    params.push(limit ? limit : 500);

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const { rows: tableData } = await client.query(query, params);

    client.release();
    res.json(tableData);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "error",
      message: "An unexpected error occurred: " + e.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).json({ error: "Unauthenticated!" });
});

module.exports = app;
