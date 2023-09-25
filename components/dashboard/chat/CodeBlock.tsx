import { FC, useState, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCheck as IconCheck, MdContentCopy as IconCopy, MdPlayArrow as IconPlay } from 'react-icons/md';

interface Props {
    language: string
    value: string
}

interface languageMap {
    [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
    javascript: '.js',
    python: '.py',
    java: '.java',
    c: '.c',
    cpp: '.cpp',
    'c++': '.cpp',
    'c#': '.cs',
    ruby: '.rb',
    php: '.php',
    swift: '.swift',
    'objective-c': '.m',
    kotlin: '.kt',
    typescript: '.ts',
    go: '.go',
    perl: '.pl',
    rust: '.rs',
    scala: '.scala',
    haskell: '.hs',
    lua: '.lua',
    shell: '.sh',
    sql: '.sql',
    html: '.html',
    css: '.css'
}

export const generateRandomString = (length: number, lowercase = false) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789' // excluding similar looking characters like Z, 2, I, 1, O, 0
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return lowercase ? result.toLowerCase() : result
}

const CodeBlock: FC<Props> = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = () => {
        if (isCopied) return
        copyToClipboard(value)
    }

    return (
        <div className="relative w-full font-sans codeblock bg-zinc-950">
            <div className="flex items-center justify-between w-full px-6 py-2 pr-4 bg-zinc-800 text-zinc-100">
                <span className="text-xs lowercase">{language}</span>
                <div className="flex items-center space-x-1">

                    {/* Copy to Clipboard Button */}
                    <CopyToClipboard
                        text={value}
                        onCopy={() => setIsCopied(true)}
                    >
                        <button className="btn btn-md btn-circle btn-square btn-outline bg-[white]">
                            {isCopied ? <IconCheck /> : <IconCopy />}
                            <span className="sr-only">Copy code</span>
                        </button>
                    </CopyToClipboard>
                    {/* Play Icon */}
                    <button className="btn btn-square btn-md bg-[white] hover:bg-success btn-outline">
                        <IconPlay className="h-6 w-6" />
                        <span className="sr-only">Run code</span>
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
                    width: '100%',
                    background: 'transparent',
                    padding: '1.5rem 1rem'
                }}
                codeTagProps={{
                    style: {
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-mono)'
                    }
                }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
}

export default CodeBlock