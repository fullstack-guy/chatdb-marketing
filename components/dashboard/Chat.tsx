import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { useState } from "react";

const Chat = ({ database_token }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({ sql: "", message: "" });

  const codeString = `SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
        FROM Orders
        INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;`;
  const tablesQueries = ["Customers", "Orders"];
  const description =
    "This SQL query selects the Order ID, Customer Name, and Order Date from the Orders and Customers tables.The query joins these tables using an INNER JOIN on the condition that the Customer ID in the Orders table matches the Customer ID in the Customers table.";

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, token: database_token }),
      });

      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const data = await response.json();
      setResult(data);
    }
  };
  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything about your database..."
        className="input input-lg w-full flex-1 appearance-none rounded-lg border border-transparent border-gray-300 px-4 py-2 text-lg text-black"
      />
      {
        (result.message || result.sql) && (
          <div className="mt-10">
            <div className="mockup-code relative rounded-lg bg-[#282a36] p-4">
              <div className="absolute top-5 right-5 cursor-pointer text-gray-400 hover:text-gray-200">
                <CopyToClipboard text={result.sql.trim()}>
                  <FiCopy size={30} />
                </CopyToClipboard>
              </div>
              <SyntaxHighlighter
                className="text-md font-bold"
                language="sql"
                style={dracula}
              >
                {result.sql}
              </SyntaxHighlighter>
            </div>
            <p className="text-md mt-6 text-gray-600">{result.message}</p>
          </div>
        )
      }

    </>
  );
};

export default Chat;
