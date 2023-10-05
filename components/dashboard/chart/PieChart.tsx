import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

function getRandomLightColor() {
  const colorTypes = ['blue', 'green', 'yellow', 'orange'];
  const randomType = colorTypes[Math.floor(Math.random() * colorTypes.length)];

  let color;

  switch (randomType) {
    case 'blue':
      color = `#00${Math.floor(Math.random() * 96 + 96).toString(16)}FF`;
      break;
    case 'green':
      color = `#${Math.floor(Math.random() * 96 + 96).toString(16)}C0FF`;
      break;
    case 'yellow':
      color = `#00${Math.floor(Math.random() * 96 + 96).toString(16)}`;
      break;
    case 'orange':
      color = `#FF${Math.floor(Math.random() * 96 + 96).toString(16)}80`;
      break;
    default:
      color = '#FFFFFF';
  }

  return color;
}

function PieChartComponent({ x_axis, y_axis, data }) {

  // Generate random colors for each data entry
  const colors = data.map(() => getRandomLightColor());

  return (
    <div className="w-1/2 mx-auto mt-8">
      <ResponsiveContainer height={350}>
        <PieChart>
          <Tooltip />
          <Pie dataKey={y_axis} stroke="#000000" data={data} label>
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
