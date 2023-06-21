import SyntaxHighlighter from "react-syntax-highlighter";
import { format } from 'sql-formatter';
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { useState } from "react";
import {
  BeatLoader
} from 'react-spinners';

const Chat = ({ database_token }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({ sql: "", result: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoading(true);

      const response = await fetch("/api/db/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, connectionStringToken: database_token }),
      });

      if (!response.ok) {
        console.error("Failed to fetch data");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data.result);
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your database..."
        className="input input-lg w-full flex-1 appearance-none rounded-lg border border-transparent border-gray-300 px-4 py-2 text-lg text-black"
      />
      {isLoading ? (
        <div className="flex justify-center mt-5 items-center">
          <BeatLoader
            className="mt-2"
            color="#123abc" loading={isLoading} size={20} />
        </div>
      ) : (
        (result.result || result.sql) && (
          <div className="mt-10">
            <div className="answer-box rounded-lg p-4 bg-gray-100 mb-4">
              <p className="text-lg text-gray-800 font-semibold">{result.result}</p>
            </div>
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
                {format(result.sql, { language: 'sql' })}
              </SyntaxHighlighter>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Chat;
