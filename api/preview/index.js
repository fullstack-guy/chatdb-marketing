const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { BasisTheory } = require("@basis-theory/basis-theory-js");

const app = express();
app.use(cors());
app.use(express.json());


app.post("*", async (req, res) => {
    const { connectionStringToken, table_name } = req.body;

    try {
        const bt = await new BasisTheory().init(
            process.env.NEXT_PRIVATE_BASIS_THEORY_KEY
        );

        // Use the Basis Theory API to retrieve the real connection string
        const connectionStringObject = await bt.tokens.retrieve(
            connectionStringToken
        );
        const connection_string = connectionStringObject.data;

        const pool = new Pool({
            connectionString: connection_string,
        });

        const client = await pool.connect();

        const { rows: tableData } = await client.query(
            `SELECT * FROM "${table_name}" LIMIT 500;`
        );

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

module.exports = app;