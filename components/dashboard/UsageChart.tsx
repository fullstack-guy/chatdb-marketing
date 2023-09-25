import {
  AreaChart,
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
      const { data, error } = await supabase
        .from("ask_queries")
        .select("created_at")
        .eq("database_uuid", props.database_uuid);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      // Group and count entries by date
      const groupedData = data.reduce((acc, row) => {
        const dateKey = new Date(row.created_at).toLocaleDateString();
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.entries(groupedData).map(
        ([Month, Queries]) => ({ Month, Queries })
      );

      setChartData(formattedData);
    };

    fetchData();
  }, [supabase]);

  return (
    <Card className="p-0">
      <TabGroup>
        <TabList>
          <Tab className="p-4 text-left sm:p-6">
            <p className="text-lg text-black">Ask Queries</p>
            <Metric className="mt-2 text-black">
              {sumArray(chartData, "Queries")}
            </Metric>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="p-6">
            <AreaChart
              className="mt-10 h-40"
              data={chartData}
              index="Month"
              categories={["Queries"]}
              colors={["blue"]}
              valueFormatter={numberFormatter}
              showLegend={true}
              allowDecimals={false}
              yAxisWidth={50}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
