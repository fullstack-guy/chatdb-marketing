const express = require("express");
const cors = require("cors");

const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const prompt = [
  {
    role: "system",
    content:
      "You are an expert in code and databases. Your sole job is to take code, database migrations, sql statements and return only JSON format to show the databases, tables, relationships, fields and data types. You will not return any other text other than json. If you aren’t able to return information about a database, simply return ‘{}’",
  },
  {
    role: "user",
    content: `
    type Event struct {
      ID          string    'json:"id"'
      Name        string    'json:"name'
    }
  
    type PhoneNumber struct {
      ID         string 'json:"id"'
      Number     string 'json:"number"'
    }
  
    type Relationship struct {
      ID        string 'json:"-" sql:"DEFAULT:uuid_generate_v4()" gorm:"primary_key"'
      Event     Event 'json:"event"'
      EventID   string 'json:"event_id"'
      PhoneNumber PhoneNumber 'json:"phone_number"'
      PhoneNumberID string 'json:"phone_number_id"'
    }
    `,
  },
  {
    role: "assistant",
    content: `
{
            "events_db": {
                "events": {
                    "columns": [{
                        "name": "id",
                        "data_type": "string"
                    },
                    {
                        "name": "name",
                        "data_type": "string"
                    }
                    ],
                    "foreign_keys": []
                },
                "phone_numbers": {
                    "columns": [{
                        "name": "id",
                        "data_type": "string"
                    },
                    {
                        "name": "number",
                        "data_type": "string"
                    }
                    ],
                    "foreign_keys": []
                },
                "relationships": {
                    "columns": [{
                        "name": "id",
                        "data_type": "string"
                    },
                    {
                        "name": "event_id",
                        "data_type": "string"
                    },
                    {
                        "name": "phone_number_id",
                        "data_type": "string"
                    }
                    ],
                    "foreign_keys": [{
                        "table": "events",
                        "column": "event_id"
                    },
                    {
                        "table": "phone_numbers",
                        "column": "phone_number_id"
                    }
                    ]
                }
            }
        }     
     `,
  },
  {
    role: "user",
    content: "hi.",
  },
  { role: "assistant", content: "{}" },
];

app.get("*", async (req, res) => {
  const code = `
    type Event struct {
      ID          string    'json:"id"'
      Name        string    'json:"name'
    }
  
    type PhoneNumber struct {
      ID         string 'json:"id"'
      Number     string 'json:"number"'
    }
  
    type Relationship struct {
      ID        string 'json:"-" sql:"DEFAULT:uuid_generate_v4()" gorm:"primary_key"'
      Event     Event 'json:"event"'
      EventID   string 'json:"event_id"'
      PhoneNumber PhoneNumber 'json:"phone_number"'
      PhoneNumberID string 'json:"phone_number_id"'
    }
    `;

  const messagesWithCode = prompt.concat({
    role: "user",
    content: code,
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesWithCode,
    stop: "\n\n",
  });

  const usage = completion.data.usage;
  console.log(
    `GPT4 Price: ${
      (usage.prompt_tokens / 1000) * 0.03 +
      (usage.completion_tokens / 1000) * 0.06
    }`
  );
  console.log(`ChatGPT Price: ${(usage.total_tokens / 1000) * 0.002}`);

  try {
    if (completion?.data?.choices) {
      const completionJSON = completion.data.choices[0]?.message?.content;
      console.log(completionJSON);
      const parsedJSON = JSON.parse(completionJSON);
      res.json(parsedJSON);
    }
  } catch (error) {
    console.error(`Error with GPT-3.5 request: ${error.message}`);
    res.status(400).json({ error: "Error communicating with GPT-3.5" });
  }
});

module.exports = app;
