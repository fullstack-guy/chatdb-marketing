import { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import DataGrid from 'react-data-grid';

import Sidebar from '../../components/parser-components/sidebar/Sidebar'
import 'react-data-grid/lib/styles.css';
import dynamic from 'next/dynamic';
import Checkbox from '../parser-components/checkbox/CheckBox';
import TickIcon from '../../assets/icons/TickIcon';
import PlayIcon from '../../assets/icons/PlayIcon';

const Queryarea = dynamic(
  () => import('../../components/parser-components/queryarea/Queryarea'),
  { ssr: false }
)

const Query = ({ filteredTables }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [annotations, setAnnotations] = useState([]);
  const [query, setQuery] = useState('');
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState()

  useEffect(() => {
    if (filteredTables.length > 0) {
      setTables([...filteredTables])
    }
  }, [filteredTables])

  const validateQuery = () => {
    if (!query) {
      return;
    }

    if (query.includes("CREATE") || query.includes("create")) {
      // Extract table name using regex
      const tableNameMatch = query.match(/CREATE\s+TABLE\s+(\w+)\s+/i);
      const tableName = tableNameMatch ? tableNameMatch[1] : '';

      const attributesMatch = query.match(/\(([^)]+)\)/);
      const attributesString = attributesMatch ? attributesMatch[1] : '';
      const attributes = attributesString.split(',');

      const matchedTable = tables.find(table => table.tableName === tableName);

      if (!matchedTable) {
        const newTable = {
          tableName: tableName,
          fields: attributes.map(field => ({
            fieldName: field.split(" ")[1],
            dataType: ''
          }))
        };

        setTables(prevTables => [...prevTables, newTable]);
      } else {
        // Table already exists, show an error message
        const errorAnnotation = {
          row: 0,
          column: 0,
          text: `Table '${tableName}' already exists`,
          type: "error",
        };
        setAnnotations([errorAnnotation]);
      }
    } else if (query.includes("INSERT") || query.includes("insert")) {
      const insertPattern = /^INSERT\s+INTO\s+(\w+)\s+\(([\w\s,]+)\)\s+VALUES\s+((?:\(\d+,\s+'.+?'\)(?:,\s*)?)+);$/i;
      const match = query.match(insertPattern);

      if (match) {
        const tableName = match[1];
        const attributeNames = match[2].split(",").map((name) => name.trim());
        const attributeValues = match[3]
          .split(/\),\s*/)
          .map((value) => value.replace(/^\(|'\)|'/g, "").trim());

        const newRows = attributeValues.map((values, index) => {
          const fields: { [key: string]: string } = {};
          attributeNames.forEach((name, i) => {
            fields[name] = values.split(",")[i].trim();
          });
          fields["id"] = (index + 1).toString();
          return fields;
        });

        const message = {
          rowCount: 5,
          command: "INSERT",
          message: "5 rows affected by INSERT command",
        };

        setTableData((prevTableData) => [...prevTableData, ...newRows]);
        setMessage(message);

        const dynamicColumns = attributeNames.map((key) => ({
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          width: 200,
        }));

        setColumns(dynamicColumns);
      }
    } else {
      const message = {
        error: "Failed to run query",
        errorCode: "42601",
        errorMessage: "trailing junk after numeric literal at or near \"5f\"",
      };
      setColumns([]);
      setTableData([]);
      setMessage(message)
    }
  };

  const handleRunQuery = () => {
    validateQuery();
  };

  const handleQueryChange = (query) => {
    setQuery(query);
    setAnnotations([]);
  }

  return (
    <div className='container shadow-lg m-auto p-3 rounded-lg mt-3 bg-white '>
      <div className='flex'>
        <Sidebar tables={tables} />
        <div className='w-4/5'>
          <Queryarea annotations={annotations} onChange={handleQueryChange} />
          <div>
            <div className="flex ml-9 pt-2">
              <button onClick={handleRunQuery} disabled={!query.trim()} className={`flex ${query.trim() ? 'bg-green-500 hover:bg-green-700 border-green-700 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold py-2 px-4 border rounded mr-5`}>
                <PlayIcon className="text-white" /> Run Query
              </button>

              <Checkbox />
            </div>
            <hr className="my-2 w-full" />
            <div className="flex ml-9 mt-3">
              <span className="px-2 font-bold">{JSON.stringify(message)}</span>
            </div>
            <hr className="my-2 w-full" />
          </div>
          <Resizable
            maxWidth={"100%"}
            maxHeight={"100%"}
            enable={{
              top: true,
              right: true,
            }}
          >
            <DataGrid style={{ width: "100%", height: "100%" }} rows={tableData} columns={columns} />
          </Resizable>
        </div>
      </div>
    </div>
  )
}

export default Query;
