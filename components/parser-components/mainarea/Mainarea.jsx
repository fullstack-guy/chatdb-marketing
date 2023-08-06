// 'use client'
import { useState, useEffect } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Resizable } from "re-resizable";
import HandleTables from "../handletables/HandleTables";
// import Queryarea from '../queryarea/Queryarea'

import dynamic from "next/dynamic";

const Queryarea = dynamic(() => import("../queryarea/Queryarea"), {
  ssr: false,
});

const Mainarea = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/episode/")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);

        const firstItem = data.results[0];
        const columnKeys = Object.keys(firstItem);

        const dynamicColumns = columnKeys.map((key) => {
          let width = 200; // Default width for other columns
          let name = key.charAt(0).toUpperCase() + key.slice(1); // Default column name

          if (key === "id") {
            width = 50;
            name = ""; // Empty string to hide the heading of the 'ID' column
          }

          return {
            key,
            name,
            width,
          };
        });

        setColumns(dynamicColumns);
      });
  }, []);

  return (
    <>
      <Resizable lockAspectRatio>
        <Queryarea />
      </Resizable>
      <HandleTables />
      <Resizable lockAspectRatio>
        <DataGrid columns={columns} rows={data} />
      </Resizable>
    </>
  );
};

export default Mainarea;
