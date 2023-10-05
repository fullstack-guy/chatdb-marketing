import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";

function AreaChartComponent({ x_axis, y_axis, data }) {

  return (
    <div className="w-1/2 mx-auto mt-8">
      <ResponsiveContainer height={350}>
        <AreaChart data={data} margin={{ left: 15, bottom: 7 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_axis}>
          </XAxis>
          <YAxis dataKey={y_axis} >
          </YAxis>
          <Tooltip />
          <Area type="monotone" dataKey={y_axis} stroke="#000000" fill="#ff7e75" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChartComponent;