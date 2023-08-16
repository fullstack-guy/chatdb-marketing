import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
import Link from "next/link";
import Head from "next/head";

const DynamicDuckDBComponent = dynamic(
    () => import("../../../components/duck/CSVParquetComponent"),
    { ssr: false }
);

const IndexPage = () => {
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

    return (
        <Layout
            title="Convert CSV to Parquet file | ChatDB"
            description="Use ChatDB to swiftly convert your CSV files to Parquet format completely in the browser. No sign-ups or data transfer required."
            url="https://www.chatdb.ai/tools/csv-to-parquet-converter"
        >
            <Head>
                <meta name="og:title" content="Convert CSV to Parquet file | ChatDB" />
                <meta name="og:description" content="Use ChatDB to swiftly convert your CSV files to Parquet format completely in the browser. No sign-ups or data transfer required." />

                <meta
                    name="og:image"
                    content={
                        `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
                        }/api/og?title=${encodeURIComponent('Convert CSV to Parquet file | ChatDB')}`
                    }
                />
            </Head>
            <div className="mt-10 flex flex-col items-center p-6">
                <h1 className="relative mb-4 flex items-center justify-center text-center text-5xl font-bold text-black">
                    Convert CSV to Parquet
                </h1>
                <p className="mb-4 text-center text-lg">
                    Upload your CSV and get it in Parquet format in a few clicks.
                    No server-side processing, everything happens in your browser.
                </p>
                <DynamicDuckDBComponent />
                <div className="my-20 w-full px-6">
                    <h2 className="text-center text-4xl font-bold text-black">
                        Advantages of Parquet Format
                    </h2>
                    <p className="mt-6 text-center text-lg">
                        Parquet is a columnar storage file format optimized for analytics.
                        It's highly efficient in both storage and performance while supporting
                        all modern data processing tools.
                    </p>
                </div>
                <div className="my-20 w-full px-6">
                    <h2 className="text-center text-4xl font-bold text-black">
                        How it works
                    </h2>
                    <p className="mt-6 text-center text-lg">
                        Our tool uses WebAssembly to convert your CSV to Parquet directly
                        in the browser. This ensures that your data never leaves your device,
                        guaranteeing privacy and security.
                    </p>
                </div>
                <div className="mb-28 w-full px-6">
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

export default IndexPage;
