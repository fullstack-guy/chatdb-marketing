import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import "react-contexify/dist/ReactContexify.css";
import { formatDialect, sql } from "sql-formatter";
import { Prism } from "@mantine/prism";

const Page = () => {
  const [inputSQL, setInputSQL] =
    useState(`SELECT Customers.CustomerName, Orders.OrderID
    FROM Customers
    LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID
    ORDER BY Customers.CustomerName;`);
  const [formattedSQL, setFormattedSQL] = useState("");
  const textareaRef = useRef(null);

  const handleSQLChange = (e) => {
    setInputSQL(e.target.value);
  };

  const tools = [
    {
      id: 1,
      title: 'CSV Viewer and Editor',
      description: 'A convenient viewer and editor for CSV files.',
      link: '/tools/csv-editor',
    },
    {
      id: 2,
      title: 'Query CSV with SQL',
      description: 'Run SQL queries directly on CSV files.',
      link: '/tools/query-csv-with-sql',
    },
    {
      id: 3,
      title: 'CSV to JSON Converter',
      description: 'Convert your CSV files to JSON with ease.',
      link: '/tools/csv-to-json-converter',
    },
  ];

  useEffect(() => {
    adjustTextareaHeight();

    try {
      const formatted = formatDialect(inputSQL, { dialect: sql });
      setFormattedSQL(formatted);
    } catch (error) {
      console.error("Failed to format the SQL:", error.message);
      // Optionally, you can set a friendly error message to `formattedSQL` or keep the original input.
      // setFormattedSQL("There was an error formatting the SQL.");
      setFormattedSQL(inputSQL);
    }
  }, [inputSQL]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Layout
      title="Free Online SQL Formatter | ChatDB"
      description="Free online SQL Formatter by ChatDB. Beautify your SQL statements effortlessly with our tool for improved readability."
      url="https://www.chatdb.ai/tools/sql-formatter"
    >
      <div className="mt-10 flex flex-col items-center p-6">
        <h1 className="mb-4 text-center text-5xl font-bold  text-black md:text-left">
          Free SQL Formatter
        </h1>
        <p className="mb-4 text-center text-lg">
          Your SQL deserves to be pretty! Format and prettify your SQL code for
          free!
        </p>

        <div className="flex flex-col md:flex-row w-full"> {/* Here's the change */}
          <textarea
            ref={textareaRef}
            className="textarea-4xl textarea-accent textarea mx-4 mt-10 flex-1"
            placeholder="SELECT * FROM PRODUCTS"
            value={inputSQL}
            onChange={handleSQLChange}
          />

          <Prism
            className="mx-4 mt-10 flex-1 text-xl"
            withLineNumbers
            language="sql"
          >
            {formattedSQL}
          </Prism>
        </div>
        <div className="mb-28 mt-72 w-full px-6">
          <h2 className="text-center mb-10 text-3xl font-bold text-black">
            Explore other tools
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map(tool => (
              <Link href={tool.link} key={tool.id}>
                <div className="border border-purple-600 transform transition hover:scale-105 rounded-lg overflow-hidden shadow-lg hover:border-purple-700">
                  <div className="bg-gradient-to-br from-purple-100 to-white p-6">
                    <h2 className="font-bold text-purple-700 text-xl mb-2">{tool.title}</h2>
                    <p className="text-gray-700 mb-4">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
