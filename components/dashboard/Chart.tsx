import React from "react";
import AreaChartComponent from "./chart/AreaChart";
import BarChartComponent from "./chart/BarChart";
import LineChartComponent from "./chart/LineChart";
import PieChartComponent from "./chart/PieChart";

const chartComponents = {
  "Area Chart": AreaChartComponent,
  "Bar Chart": BarChartComponent,
  "Line Chart": LineChartComponent,
  "Pie Chart": PieChartComponent,
};

function Chart({ x_axis, y_axis, chartName, data }) {
  const ChartComponent = chartComponents[chartName];

  return <ChartComponent x_axis={x_axis} y_axis={y_axis} data={data} />;
}

export default Chart;
