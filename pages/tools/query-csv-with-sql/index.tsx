import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
import Link from "next/link";

const DynamicDuckDBComponent = dynamic(
  () => import("../../../components/duck/DuckDBComponent"),
  { ssr: false }
);

const IndexPage = () => {

  const tools = [
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
      description: 'Convert CSV files to compressed parquet.',
      link: '/tools/csv-to-parquet-converter',
    }
  ];

  return (
    <Layout
      title="Query CSV files with SQL and AI | ChatDB"
      description="Use ChatDB to query, view, and edit your CSV files using SQL. Upload your CSV, write an SQL query, and interact with your data. Easy to use and completely in the browser."
      url="https://www.chatdb.ai/tools/query-csv-with-sql"
      oggURL="https://www.chatdb.ai/_next/image?url=images/CSVSQL.png&w=1200&q=75"
    >
      <div className="mt-10 flex flex-col items-center p-6">
        <h1 className="relative mb-4 flex items-center justify-center text-center text-5xl font-bold text-black">
          Query CSV with SQL
          <span className="ml-4 rounded-full bg-green-500 px-3 py-1 text-lg font-bold text-white">
            BETA
          </span>
        </h1>
        <p className="mb-4 text-center text-lg">
          Upload your CSV, write an SQL query, and interact with your data.{" "}
          <br></br>Easy to use and completely in the browser.
        </p>
        <DynamicDuckDBComponent />
        <div className="my-20 w-full px-6">
          <h2 className="text-center text-4xl font-bold text-black">
            Why Querying a CSV file with SQL Is Great
          </h2>
          <p className="mt-6 text-center text-lg">
            SQL provides a powerful, flexible syntax for querying data. By using
            SQL on CSV files, you can quickly extract complex insights from your
            data without needing to import it into a database or use a more
            complex data analysis tool.
          </p>
        </div>
        <div className="mb-10 w-full px-6">
          <h2 className="text-center text-4xl font-bold text-black">
            How it works
          </h2>
          <p className="mt-6 text-center text-lg">
            We package an OLAP database that runs in the browser via WebAssembly
            so that we never touch any of your data. All of your data stays on
            your machine and never leaves the browser!
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
