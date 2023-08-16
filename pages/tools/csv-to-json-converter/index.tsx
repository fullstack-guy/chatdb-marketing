import React, { useState } from "react";
import DataGrid from "react-data-grid";
import Papa from "papaparse";
import Layout from "../../../components/Layout";
import { AiOutlineCloudDownload } from "react-icons/ai";
import "react-contexify/dist/ReactContexify.css";
import { Toaster, toast } from "react-hot-toast";
import { useContextMenu } from "react-contexify";
import Link from "next/link";
import "react-data-grid/lib/styles.css";
import Head from "next/head";

const Page = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState("");

  const MENU_ID = `cell-menu`;
  const { show } = useContextMenu({
    id: MENU_ID,
  });

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
      id: 5,
      title: 'CSV to Parquet Converter',
      description: 'Convert CSV files to compressed parquet.',
      link: '/tools/csv-to-parquet-converter',
    }
  ];

  const handleFileChange = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file size
      if (inputFile.size > 100 * 1024 * 1024) {
        toast.error(
          "File is too large! Please upload a file smaller than 100 MB."
        );
        return;
      }

      // Check the file extension
      const fileExtension = inputFile?.type.split("/")[1];
      if (fileExtension !== "csv") {
        setError("Please input a csv file");
        return;
      }

      // Parse the CSV file
      const reader = new FileReader();
      reader.onload = async ({ target }) => {
        const csv = Papa.parse(target.result, { header: true });
        const parsedData = csv?.data;
        setData(parsedData);

        if (parsedData[0]) {
          const cols = Object.keys(parsedData[0]).map((key) => ({
            key,
            name: key,
            editable: true,
            width: "max-content",
            resizable: true,
          }));
          setColumns(cols);
        }
      };
      reader.readAsText(inputFile);
    }
  };

  const exportToJSON = (data, columns) => {
    const structuredData = data.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        obj[col.key] = row[col.key];
      });
      return obj;
    });

    const jsonData = JSON.stringify(structuredData);

    // Create a blob from the JSON string.
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create an Object URL for the blob.
    const url = URL.createObjectURL(blob);

    // Create a link (<a>) element.
    const link = document.createElement("a");
    link.href = url; // Set its href to the blob's URL.

    // Suggest a filename for the downloaded file.
    link.download = "data.json";

    // Append the link to the body (this is necessary for Firefox).
    document.body.appendChild(link);

    // Programmatically trigger a click on the link to start the download.
    link.click();

    // Remove the link from the body (this is necessary for Firefox).
    document.body.removeChild(link);
  };

  const handleDataChange = (newRows, { indexes, column }) => {
    setData(data.map((row, i) => (i === indexes[0] ? newRows[0] : row)));
  };

  return (
    <Layout
      title="Free Online CSV to JSON Converter | ChatDB"
      description="Free online CSV to JSON Converter by ChatDB. Easily upload, view, and transform your CSV files."
      url="https://www.chatdb.ai/tools/csv-to-json-converter"
    >
      <Head>
        <meta name="og:title" content="Free Online CSV to JSON Converter | ChatDB" />
        <meta name="og:description" content="Free online CSV to JSON Converter by ChatDB. Easily upload, view, and transform your CSV files." />

        <meta
          name="og:image"
          content={
            `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/og?title=${encodeURIComponent('Free Online CSV to JSON Converter | ChatDB')}`
          }
        />
      </Head>
      <div className="mt-10 flex flex-col items-center p-6">
        <h1 className="mb-4 text-center text-5xl font-bold text-black md:text-left">
          Free Online CSV to JSON Converter
        </h1>
        <p className="mb-4 text-center text-lg">
          Upload your csv file and transform it into JSON
        </p>
        <div className="mb-4 flex max-w-xs flex-col items-start sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input-bordered file-input file-input-md mb-4 w-full sm:mb-0 sm:mr-4"
          />
        </div>
        {data.length > 0 && (
          <>
            <button
              className="btn-large btn mt-4 flex items-center rounded px-4 py-2 font-bold text-white"
              onClick={() => exportToJSON(data, columns)}
            >
              Download as JSON{" "}
              <AiOutlineCloudDownload className="text-md ml-2" />
            </button>
          </>
        )}
        {error ? error : null}
      </div>
      {data.length > 0 && (
        <div className="mx-10 mt-10 flex max-h-screen items-center justify-center">
          <DataGrid
            className="rdg-light"
            columns={columns}
            rows={data}
            onRowsChange={handleDataChange}
          />
        </div>
      )}
      <h2 className="mb-4 mt-28 text-center text-2xl font-bold text-black">
        Why should you convert CSV to JSON?
      </h2>

      <p className="text-md mb-4 text-center">
        CSV (Comma Separated Values) is a format ideal for tabular data, while
        JSON (JavaScript Object Notation) excels with web applications and APIs
        due to its hierarchical structure. Instead of managing multiple CSV
        files for complex data, converting them to JSON ensures easier
        integration with web applications, streamlining the data exchange
        process.
      </p>

      <h2 className="mb-4 mt-20 text-center text-2xl font-bold text-black">
        How to convert CSV files to JSON for free?
      </h2>
      <p className="text-md mb-4 text-center">
        Our tool above offers a quick and easy solution to convert CSV files to
        JSON. Here's how: We load your csv via the browser (your data never
        touches our servers) and we convert this to JSON where you can download!
      </p>

      <h2 className="mb-4 mt-20 text-center text-2xl font-bold text-black">
        CSV vs JSON: Which to Use?
      </h2>
      <p className="text-md mb-4 text-center">
        Choosing between CSV and JSON depends on the specific needs of a task.
        CSV is tabular and works well with spreadsheets, making it ideal for
        data representation in tables. On the other hand, JSON is structured and
        hierarchical, suitable for nested and complex data, often seen in web
        applications. While CSV is human-readable, JSON provides a more
        comprehensive way of data representation, especially in web development.
      </p>

      <div className="mb-28 w-full px-6">
        <h2 className="text-center my-16 text-3xl font-bold text-black">
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
      <Toaster position="bottom-center" />
    </Layout>
  );
};

export default Page;
