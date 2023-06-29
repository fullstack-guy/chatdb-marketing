"use client";
import PlayIcon from "../../../assets/icons/PlayIcon";
import React, { useState } from "react";
import Checkbox from "../checkbox/CheckBox";
import TickIcon from "../../../assets/icons/TickIcon";

const HandleTables = () => {
  return (
    <div >
        <div className="flex ml-9 ">

      <button className="flex bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded mr-5">
        <PlayIcon className="text-white" /> Run Query
      </button>

      <Checkbox />
        </div>
    <hr className="my-2"/>
      <div className="flex ml-9 mt-3">
       <TickIcon/> <span className="px-2 font-bold">10,000 Rows</span> <span className="text-gray-400"> 103ms</span>
      </div>
      <hr className="my-2"/>
    </div>
  );
};

export default HandleTables;
