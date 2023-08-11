import { format } from "sql-formatter";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Prism } from "@mantine/prism";
import { Toaster, toast } from "react-hot-toast";
import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import gfm from "remark-gfm"; // this is the plugin required for react-markdown to handle tables

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const Chat = ({ database_token }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({ sql: "", result: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await fetch("/api/db/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, token: database_token }),
        });

        if (!response.ok) {
          // check if response went through
          throw new Error("Response Error: " + response.status);
        }

        const data = await response.json();

        setResult(data.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch Error :-S", error);
        setIsLoading(false);
        toast.error("Sorry that is embarrasing. We had an issue 🙈");
      }
    }
  };

  return (
    <>
      <div className="form-control">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your database..."
          className="input-bordered input-primary input input-lg w-full flex-1 rounded-lg border px-4 py-6 text-lg text-black"
        />
        <label className="label">
          <span className="label-text-alt">
            Note: AI assistant only works with the public schema at the moment.
          </span>
        </label>
      </div>
      {isLoading ? (
        <div className="mt-5 flex items-center justify-center">
          <BeatLoader
            className="mt-2"
            color="#123abc"
            loading={isLoading}
            size={20}
          />
        </div>
      ) : (
        result.result && (
          <div className="mt-10">
            <div className="answer-box mb-4 rounded-lg p-4">
              <MemoizedReactMarkdown
                className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                remarkPlugins={[gfm]}
                components={{
                  p({ children }) {
                    return (
                      <p className="mb-2 text-black last:mb-0">{children}</p>
                    );
                  },
                }}
              >
                {result.result}
              </MemoizedReactMarkdown>
            </div>
            <h1 className="my-2 text-2xl font-bold text-black">SQL Code</h1>
            <Prism withLineNumbers language="sql">
              {format(result.sql, { language: "postgresql" })}
            </Prism>
            <Toaster position="top-right" />
          </div>
        )
      )}
    </>
  );
};

export default Chat;
