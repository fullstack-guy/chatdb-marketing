import React, { memo } from "react";
import { Handle, Position } from "reactflow";

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
}

interface CustomNodeProps {
  data: {
    name: string;
    columns: TableColumn[];
    foreignKeys?: any[]; // replace with the appropriate type
  };
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <div className="ml-2">
        <div className="m-auto text-center text-2xl font-bold text-black">
          {data.name}
        </div>
      </div>
      <div className="mt-2">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Column Name</th>
              <th className="px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.columns.map((column, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{column.name}</td>
                <td className="border px-4 py-2">{column.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
