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

  useEffect(() => {
    if (filteredTables.length > 0) {
      setTables([...filteredTables])
    }
  }, [filteredTables])

  const validateQuery = () => {
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
        console.log("UpdatedTables", tables)
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

      const insertPattern = /^INSERT\s+INTO\s+(\w+)\s+\(([\w\s,]+)\)\s+VALUES\s+\(([\w\s,']+)\);$/i;
      const match = query.match(insertPattern);
      const tableName = match[1];
      const matchedTable = tables.find(table => table.tableName === tableName);

      if (matchedTable) {
        const attributeNames = match[2].split(',').map(name => name.trim());
        const attributeValues = match[3].split(',').map(value => value.trim().replace(/'/g, ''));
        const fields = {
          [`${attributeNames[0]}`]: attributeValues[0],
          [`${attributeNames[1]}`]: attributeValues[1],
          id: tableData.length
        };

        const newRows = [];
        newRows.push(fields);

        setTableData((prevTableData) => [...prevTableData, ...newRows]);
        console.log('updatedTableData', tableData)

        const dynamicColumns = attributeNames.map(key => {
          let width = 200; // Default width for other columns
          let name = key.charAt(0).toUpperCase() + key.slice(1); // Default column name

          if (key === 'id') {
            width = 50;
            name = ''; // Empty string to hide the heading of the 'ID' column
          }
          return {
            key,
            name,
            width
          };
        });

        setColumns(dynamicColumns);

      } else {
        const errorAnnotation = {
          row: 0,
          column: 0,
          text: "Table not found!",
          type: "error",
        };
        setAnnotations([errorAnnotation]);
      }
    }
    const errorAnnotation = {
      row: 0,
      column: 0,
      text: "Failed to run query",
      type: "error",
    };
    setAnnotations([errorAnnotation]);
  };

  const handleRunQuery = () => {
    validateQuery();
  };

  const handleQueryChange = (query) => {
    setQuery(query);
    setAnnotations([]);
  };

  // useEffect(() => {
  //   fetch("https://rickandmortyapi.com/api/episode/")
  //     .then(res => res.json())
  //     .then(data => {
  //       setData(data.results);

  //       const firstItem = data.results[0];
  //       const columnKeys = Object.keys(firstItem);

  //       const dynamicColumns = columnKeys.map(key => {
  //         let width = 200; // Default width for other columns
  //         let name = key.charAt(0).toUpperCase() + key.slice(1); // Default column name

  //         if (key === 'id') {
  //           width = 50;
  //           name = ''; // Empty string to hide the heading of the 'ID' column
  //         }

  //         return {
  //           key,
  //           name,
  //           width
  //         };
  //       });

  //       setColumns(dynamicColumns);
  //     });
  // }, []);


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
              <TickIcon /> <span className="px-2 font-bold">10,000 Rows</span> <span className="text-gray-400"> 103ms</span>
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
