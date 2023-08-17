import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { BasisTheory } from "@basis-theory/basis-theory-js";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    connectionStringToken,
    table_name,
    pageNumber,
    where_clause,
    order_by,
  } = req.body;

  try {
    const offset = (pageNumber - 1) * 500;

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
    params.push(500);

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
}
