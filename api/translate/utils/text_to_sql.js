const MSG_WITH_ERROR_TRY_AGAIN =
  "Try again. " +
  "Only respond with valid SQL. Write your answer in markdown format. " +
  "The SQL query you just generated resulted in the following error message:\n";

const isReadOnlyQuery = (sqlQuery) => {
  /*
   * Checks if the given SQL query string is read-only.
   * Returns true if the query is read-only, false otherwise.
   */
  const modifyingStatements = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "CREATE",
    "ALTER",
    "GRANT",
    "TRUNCATE",
    "LOCK TABLES",
    "UNLOCK TABLES",
  ];

  // Check if the query contains any modifying statements
  for (let statement of modifyingStatements) {
    if (sqlQuery.toUpperCase().includes(statement)) {
      return false;
    }
  }
  // If no modifying statements are found, the query is read-only
  return true;
};

const makeRephraseMsgWithSchemaAndWarnings = () => {
  return (
    "Let's start by rephrasing the query to be more analytical. Use the schema context to rephrase the user question in a way that leads to optimal query results: {natural_language_query}" +
    "The following are schemas of tables you can query:\n" +
    "---------------------\n" +
    "{schemas}" +
    "\n" +
    "---------------------\n" +
    "Do not include any of the table names in the query." +
    "Ask the natural language query the way a data analyst, with knowledge of these tables, would."
  );
};

const makeMsgWithSchemaAndWarnings = () => {
  return (
    "Generate syntactically correct read-only SQL to answer the following question/command: {natural_language_query}" +
    "The following are schemas of tables you can query:\n" +
    "---------------------\n" +
    "{schemas}" +
    "\n" +
    "---------------------\n" +
    " Do not use ambiguous column names." +
    " Always specify the table where you are using the column."
  );
};

const textToSQLWithRetry = (
  naturalLanguageQuery,
  tableNames,
  k = 3,
  messages = null
) => {
  /*
   * Tries to take a natural language query and generate valid SQL to answer it K times
   */
  if (!messages) {
    // Ask the assistant to rephrase before generating the query
    const schemas = getTableSchemas(tableNames, scope);
    const rephrase = [
      {
        role: "user",
        content: makeRephraseMsgWithSchemaAndWarnings()
          .replace("{natural_language_query}", naturalLanguageQuery)
          .replace("{schemas}", schemas),
      },
    ];
    const assistantMessage = getAssistantMessage(rephrase);
    let content = makeMsgWithSchemaAndWarnings()
      .replace(
        "{natural_language_query}",
        assistantMessage["message"]["content"]
      )
      .replace("{schemas}", schemas);
    try {
      const enc = Buffer.byteLength(content, "utf8");
      newrelic.addCustomAttribute("encoding_length", enc);
    } catch (e) {
      console.error(e);
    }

    messages = makeDefaultMessages(schemas, scope);
    messages.push({
      role: "user",
      content: content,
    });
  }

  let assistantMessage = null;

  for (let i = 0; i < k; i++) {
    try {
      let model = "gpt-3.5-turbo";
      assistantMessage = getAssistantMessage(messages, model);
      const sqlQuery = extractSqlQueryFromMessage(
        assistantMessage["message"]["content"]
      );

      const response = executeSql(sqlQuery);
      // Generated SQL query did not produce exception. Return result
      return [response, sqlQuery];
    } catch (e) {
      messages.push({
        role: "assistant",
        content: assistantMessage["message"]["content"],
      });
      messages.push({
        role: "user",
        content: MSG_WITH_ERROR_TRY_AGAIN.replace(
          "{error_message}",
          e.toString()
        ),
      });
    }
  }

  console.log("Could not generate SQL query after " + k.toString() + " tries.");
  return [null, null];
};
