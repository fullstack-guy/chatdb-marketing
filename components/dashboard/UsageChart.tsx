import {
  BarChart,
  Card,
  Metric,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { useEffect, useState } from "react";
import useSupabase from "../../hooks/useSupabaseClient";

const numberFormatter = (value: number) =>
  Intl.NumberFormat("us", { maximumFractionDigits: 1 }).format(value);

function sumArray(array: any[], metric: string) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue[metric],
    0
  );
}

interface UsageChartProps {
  database_uuid: string;
}

export default function UsageChart(props: UsageChartProps) {
  const supabase = useSupabase();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client is not initialized yet.");
      return;
    }

    const fetchData = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from("ask_queries")
        .select("created_at")
        .eq("database_uuid", props.database_uuid)
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const groupedData = data.reduce((acc, row) => {
        const dateKey = new Date(row.created_at).toLocaleDateString();
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.entries(groupedData).map(
        ([Day, Queries]) => ({ Day, Queries })
      );

      setChartData(formattedData);
    };

    fetchData();
  }, [supabase, props.database_uuid]);

  return (
    <Card className="p-0">
      <TabGroup>
        <TabList>
          <Tab className="p-4 text-left sm:p-6">
            <p className="text-lg text-black">AI Queries</p>
            <Metric className="mt-2 text-black">
              {sumArray(chartData, "Queries")}
            </Metric>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="p-2">
            <BarChart
              className="mt-2"
              data={chartData}
              index="Day"
              categories={["Queries"]}
              colors={["blue"]}
              valueFormatter={numberFormatter}
              yAxisWidth={2}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
