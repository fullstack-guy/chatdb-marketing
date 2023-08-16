import { Pool } from "pg";
import { BasisTheory } from "@basis-theory/basis-theory-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bt = await new BasisTheory().init(
    process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
  );

  const { query, connectionStringToken } = req.body;
  if (!query || !connectionStringToken) {
    res
      .status(400)
      .json({ error: "No query or connection string token provided" });
    return;
  }

  try {
    const connectionStringObject = await bt.tokens.retrieve(
      connectionStringToken
    );
    const connectionString = connectionStringObject.data;

    const pool = new Pool({ connectionString });

    const result = await pool.query(query);
    res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
      message: `${result.rowCount} rows affected by ${result.command} command`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to run query",
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
}
