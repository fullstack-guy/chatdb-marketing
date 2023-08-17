import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message, metadata } = req.body;

    let metadataString = "Table: my_csv\n\n";
    metadata.forEach((field) => {
      metadataString += `${field.name}: ${field.type}\n`;
    });

    console.log(message, metadataString);

    try {
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: `You are a Database AI assistant who takes natural language and uses information in the table to create the working SQL query for the database. Only respond with correct SQL code using the table and columns below.`,
          },
          {
            role: "user",
            content: `Only respond with correct SQL code using the table and columns below. Query: ${message} \n\nTable:\n\nColumns:${metadataString}`,
          },
        ],
        temperature: 0,
      });
      res
        .status(200)
        .json({ sql: chatCompletion.data.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Only POST requests allowed" });
  }
}
