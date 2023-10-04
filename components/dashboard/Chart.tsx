import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
} from "recharts";

function Chart({ x_axis, y_axis, chartName, data }) {
  return (
    <>
      {chartName === "Area Chart" && (
        <div
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            height: 350,
            marginTop: 20,
          }}
        >
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                left: 15,
                bottom: 7,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis}>
                <Label
                  value={x_axis}
                  fontWeight="bold"
                  offset={-8}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis dataKey={y_axis}>
                <Label
                  value={y_axis}
                  offset={-8}
                  fontWeight="bold"
                  position="insideLeft"
                  angle={-90}
                />
              </YAxis>
              <Tooltip />
              <Area
                type="monotone"
                dataKey={y_axis}
                stroke="#000000"
                fill="#ff7e75"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartName === "Bar Chart" && (
        <div
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            height: 350,
            marginTop: 20,
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                left: 15,
                bottom: 7,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis}>
                <Label
                  value={x_axis}
                  fontWeight="bold"
                  offset={-8}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis dataKey={y_axis}>
                <Label
                  value={y_axis}
                  offset={-8}
                  position="insideLeft"
                  angle={-90}
                  fontWeight="bold"
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey={y_axis} fill="#ff7e75" stroke="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartName === "Line Chart" && (
        <div
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            height: 350,
            marginTop: 20,
          }}
        >
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                left: 15,
                bottom: 7,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis}>
                <Label
                  value={x_axis}
                  fontWeight="bold"
                  offset={-8}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis dataKey={y_axis}>
                <Label
                  value={y_axis}
                  fontWeight="bold"
                  offset={-8}
                  position="insideLeft"
                  angle={-90}
                />
              </YAxis>
              <Tooltip />
              <Line
                type="monotone"
                dataKey={x_axis}
                stroke="#000000"
                fill="#ff7e75"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey={y_axis} stroke="#000000" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartName === "Pie Chart" && (
        <div style={{ width: "100%", height: 370 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey={y_axis}
                stroke="#000000"
                fill="#ff7e75"
                data={data}
                label
              ></Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

export default Chart;
