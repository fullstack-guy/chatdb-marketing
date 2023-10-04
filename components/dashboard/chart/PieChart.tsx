import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";

function PieChartComponent({ y_axis, data }) {
  return (
    <div className="w-1/2 mx-auto mt-8">
      <ResponsiveContainer height={350}>
        <PieChart>
          <Tooltip />
          <Pie dataKey={y_axis} stroke="#000000" fill="#ff7e75" data={data} label />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
