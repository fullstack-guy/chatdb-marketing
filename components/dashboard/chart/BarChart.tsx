import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";

function BarChartComponent({ x_axis, y_axis, data }) {
  return (
    <div className="w-1/2 mx-auto mt-8">
      <ResponsiveContainer height={350}>
        <BarChart data={data} margin={{ left: 15, bottom: 7 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_axis}>
          </XAxis>
          <YAxis dataKey={y_axis} >
          </YAxis>
          <Tooltip />
          <Bar dataKey={y_axis} fill="#ff7e75" stroke="#000000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


export default BarChartComponent;
