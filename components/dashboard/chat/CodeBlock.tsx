import { FC, useState, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  MdCheck as IconCheck,
  MdContentCopy as IconCopy,
  MdPlayArrow as IconPlay,
} from "react-icons/md";

interface Props {
  language: string;
  value: string;
  onRunCode?: (code: string) => void;
}

interface languageMap {
  [key: string]: string | undefined;
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
};

const CodeBlock: FC<Props> = ({ language, value, onRunCode }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    if (isCopied) return;
    setIsCopied(true);

    // Clear the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      await onRunCode(value);
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <div className="codeblock relative w-full bg-zinc-950 font-sans">
      <div className="flex w-full items-center justify-between bg-zinc-800 px-6 py-2 pr-4 text-zinc-100">
        <span className="text-xs lowercase">{language}</span>
        <div className="flex items-center space-x-1">
          {/* Copy to Clipboard Button */}
          <CopyToClipboard text={value} onCopy={onCopy}>
            <button className="btn-outline btn-square btn-md btn-circle btn bg-[white]">
              {isCopied ? <IconCheck /> : <IconCopy />}
              <span className="sr-only">Copy code</span>
            </button>
          </CopyToClipboard>

          {/* Run Icon */}
          <button
            className="btn-outline btn-square btn-md btn bg-[white] hover:bg-success"
            onClick={handleRunCode}
            disabled={isLoading}
          >
            <IconPlay className="h-6 w-6" />
            <span className="sr-only">
              {isLoading ? "Loading..." : "Run code"}
            </span>
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          width: "100%",
          background: "transparent",
          padding: "1.5rem 1rem",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.9rem",
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
