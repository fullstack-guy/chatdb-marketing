import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";

const Chat = () => {
  const codeString = `SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
        FROM Orders
        INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;`;
  const tablesQueries = ["Customers", "Orders"];
  const description =
    "This SQL query selects the Order ID, Customer Name, and Order Date from the Orders and Customers tables.The query joins these tables using an INNER JOIN on the condition that the Customer ID in the Orders table matches the Customer ID in the Customers table.";

  return (
    <>
      <input
        type="text"
        placeholder="Ask anything about your database..."
        className="input input-lg mb-10 w-full flex-1 appearance-none rounded-lg border border-transparent border-gray-300 px-4 py-2 text-lg text-black"
      />
      <div className="mockup-code relative rounded-lg bg-[#282a36] p-4">
        <div className="absolute top-5 right-5 cursor-pointer text-gray-400 hover:text-gray-200">
          <CopyToClipboard text={codeString.trim()}>
            <FiCopy size={30} />
          </CopyToClipboard>
        </div>
        <SyntaxHighlighter
          className="text-md font-bold"
          language="sql"
          style={dracula}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
      <p className="text-md mt-6 text-gray-600">{description}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-md font-semibold text-black">
                Tables Queried
              </th>
            </tr>
          </thead>
          <tbody>
            {tablesQueries.map((table, index) => (
              <tr key={index}>
                <td className="text-md">{table}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Chat;
