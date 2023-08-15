import Link from 'next/link';
import Layout from "../../components/Layout";

const ToolsPage = () => {
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
        {
            id: 4,
            title: 'SQL Formatter',
            description: 'Format and beautify your SQL statements for better readability.',
            link: '/tools/sql-formatter',
        },
        {
            id: 5,
            title: 'CSV to Parquet Converter',
            description: 'Convert CSV files to compressed parquet. Ideal for efficient storage and analytics.',
            link: '/tools/csv-to-parquet-converter',
        }
    ];


    return (
        <Layout
            title="ChatDB | Free Data Tools"
            description="Free online tools for your data, no signup required! Everything runs in the browser."
            url="https://www.chatdb.ai/tools"
        >
            <div className="mt-10 flex flex-col items-center p-6">
                <h1 className="mb-4 text-center text-5xl lg:text-6xl font-bold text-black md:text-left">
                    Free Data Tools
                </h1>
                <p className="mb-4 text-center text-lg">
                    Free tools for your data, no signup required! Everything runs in the browser and your data never touches our systems!
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {tools.map(tool => (
                        <Link href={tool.link} key={tool.id}>
                            <div className="border border-purple-600 transform transition hover:scale-105 rounded-lg overflow-hidden shadow-lg hover:border-purple-700"> {/* Changed to an anchor tag for better semantics and added purple borders */}
                                <div className="bg-gradient-to-br from-purple-100 to-white p-6"> {/* Added gradient */}
                                    <h2 className="font-bold text-purple-700 text-xl mb-2">{tool.title}</h2> {/* Text color changed to purple */}
                                    <p className="text-gray-700 mb-4">{tool.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ToolsPage;
