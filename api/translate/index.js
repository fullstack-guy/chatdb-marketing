const express = require("express");
const cors = require("cors");

const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const getAssistantMessage = async (messages, stop) => {
  messages = [];
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    stop: stop || "\n\n",
  });

  try {
    if (completion?.data?.choices) {
      const response = completion.data.choices[0]?.message?.content;
      console.log(response);
      return { message: response.text };
    }
  } catch (error) {
    console.error(`Error with GPT-3.5 request: ${error.message}`);
    res.status(500).json({ error: "Error communicating with GPT-3.5" });
  }
};

module.exports = app;
