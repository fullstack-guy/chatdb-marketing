import { OpenAI } from "langchain";
import { createSqlAgent, SqlToolkit } from "langchain/agents";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("*", async (req, res) => {
  const datasource = new DataSource({
    type: "mysql",
    database:
      "postgres://testdb_jy3x_user:YQ2kum48yGb8XAjTNVI91Zn8FD8ZcmXJ@dpg-cgjhire4dadak45qbru0-a.oregon-postgres.render.com/testdb_jy3x?sslmode=require",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });
  const tookit = new SqlToolkit(db);
  const model = new OpenAI({ temperature: 0 });
  const executor = createSqlAgent(model, tookit);

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    console.log(`Executing with input "${query}"...`);

    const result = await executor.call({ input });

    console.log(`Got output ${result.output}`);
    console.log(
      `Got intermediate steps ${JSON.stringify(
        result.intermediateSteps,
        null,
        2
      )}`
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await datasource.destroy();
  }
});

app.post();

module.exports = app;
