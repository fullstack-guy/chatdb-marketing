const express = require("express");
const bodyParser = require("body-parser");
const { DataSource } = require("typeorm");
const { OpenAI } = require("langchain/llms/openai");
const { SqlDatabase } = require("langchain/sql_db");
const { SqlDatabaseChain } = require("langchain/chains");
const BasisTheory = require('@basistheory/basis-theory-js');

const app = express();
app.use(bodyParser.json());

const basisTheory = new BasisTheory({
    apiKey: process.env.NEXT_PUBLIC_BASIS_THEORY_KEY
});

app.post('*', async (req, res) => {
    const { query, token } = req.body;
    process.env.OPENAI_API_KEY = "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"

    // Use Basis Theory to decrypt the token into the original connection string
    const connectionString = await basisTheory.tokens.retrieve(token);

    const datasource = new DataSource({
        type: "postgres",
        url: connectionString,
    });

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });

    // Set up chain
    const chain = new SqlDatabaseChain({
        llm: new OpenAI({ temperature: 0 }),
        database: db,
        returnDirect: true,
    });

    const result = await chain.run(query);
    res.json({ sql: "", message: result });
});

module.exports = app;
