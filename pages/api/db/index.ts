import { BasisTheory } from "@basis-theory/basis-theory-js";
import { Pool } from "pg";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bt = await new BasisTheory().init(
    process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
  );

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

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

    const pool = new Pool({
      connectionString,
    });

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to run query",
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
}
