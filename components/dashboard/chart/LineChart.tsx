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
            <Label value={x_axis} fill="black" offset={-5} position="insideBottom" className="font-bold" />
          </XAxis>
          <YAxis dataKey={y_axis} >
            <Label value={y_axis} offset={-8} fill="black" angle={-90} position="insideLeft" className="font-bold" />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey={x_axis} stroke="#000000" fill="#ff7e75" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={y_axis} stroke="#000000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
