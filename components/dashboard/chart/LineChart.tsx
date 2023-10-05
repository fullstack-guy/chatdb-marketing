import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";

function LineChartComponent({ x_axis, y_axis, data }) {
  return (
    <div className="w-1/2 mx-auto mt-8">
      <ResponsiveContainer height={350}>
        <LineChart data={data} margin={{ left: 15, bottom: 7 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_axis}>
          </XAxis>
          <YAxis dataKey={y_axis} >
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey={x_axis} stroke="#ff7e75" fill="#ff7e75" activeDot={{ r: 32 }} />
          <Line type="monotone" dataKey={y_axis} stroke="#000000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
