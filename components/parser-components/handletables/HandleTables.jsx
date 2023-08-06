"use client";
import PlayIcon from "../../../assets/icons/PlayIcon";
import React, { useState } from "react";
import Checkbox from "../checkbox/CheckBox";
import TickIcon from "../../../assets/icons/TickIcon";

const HandleTables = () => {
  return (
    <div>
      <div className="ml-9 flex ">
        <button className="mr-5 flex rounded border border-green-700 bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
          <PlayIcon className="text-white" /> Run Query
        </button>

        <Checkbox />
      </div>
      <hr className="my-2" />
      <div className="ml-9 mt-3 flex">
        <TickIcon /> <span className="px-2 font-bold">10,000 Rows</span>{" "}
        <span className="text-gray-400"> 103ms</span>
      </div>
      <hr className="my-2" />
    </div>
  );
};

export default HandleTables;
