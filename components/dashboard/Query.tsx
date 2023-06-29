import { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import DataGrid from 'react-data-grid';

import Sidebar from '../../components/parser-components/sidebar/Sidebar'
import 'react-data-grid/lib/styles.css';
import dynamic from 'next/dynamic';
import Checkbox from '../parser-components/checkbox/CheckBox';
import PlayIcon from '../../assets/icons/PlayIcon';
import { AiOutlineCheckCircle } from "react-icons/ai"

const Queryarea = dynamic(
  () => import('../../components/parser-components/queryarea/Queryarea'),
  { ssr: false }
)

const Query = ({ filteredTables }) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    { key: 'ArtistId', name: 'ArtistId' },
    { key: 'Name', name: 'Name' }
  ]);
  const [annotations, setAnnotations] = useState([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState({
    error: "Failed to run query",
    errorCode: "42601",
    errorMessage: "trailing junk after numeric literal at or near \"5f\""
  }) // error state
  const [createTable, setCreateTable] = useState({
    rows: [],
    rowCount: null,
    command: "CREATE",
    message: "null rows affected by CREATE command"
  }
  ) // create table state

  const [insert, setInsert] = useState({
    rows: [],
    rowCount: 1,
    command: "INSERT",
    message: "1 rows affected by INSERT command"
  })  // insert data state

  const [successQuery, setSuccessQuery] = useState({
    rows: [
      {
        ArtistId: 1,
        Name: "AC/DC"
      },
      {
        ArtistId: 2,
        Name: "Accept"
      },
      {
        ArtistId: 3,
        Name: "Aerosmith"
      },
      {
        ArtistId: 4,
        Name: "Alanis Morissette"
      },
      {
        ArtistId: 5,
        Name: "Alice In Chains"
      }
    ],
    rowCount: 5,
    command: "SELECT",
    message: "5 rows affected by SELECT command"
  }) // success query state)


  useEffect(() => {

      let data = []
      successQuery.rows.forEach((item,index) => {
          data.push({
            id: index,
            ArtistId: item["ArtistId"],
            Name: item["Name"]
          })
      })
      
      setRows(data)
  }, [])

  const handleRunQuery = () => {
    console.log("run query handler");
  };

  const handleQueryChange = (query) => {
    setQuery(query);
    setAnnotations([]);
  }

  return (
    <div className='container shadow-lg m-auto p-3 rounded-lg mt-3 bg-white '>
      <div className='flex'>
        <Sidebar />
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
              <AiOutlineCheckCircle color='green' />
              <span className="px-2 font-bold">{`${successQuery.rowCount} Rows`}</span>
              <span className="px-2">{`103ms`}</span>

            </div>
            
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
            <DataGrid style={{ width: "100%", height: "100%" }} rows={rows} columns={columns} />
          </Resizable>
        </div>
      </div>
    </div>
  )
}

export default Query;
