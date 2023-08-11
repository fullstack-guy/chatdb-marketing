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

const data = [
    {
        Month: "August 10",
        Visitors: 289,
    },
    //...
    {
        Month: "Aug 20",
        Visitors: 389,
    },
];

const numberFormatter = (value: number) => Intl.NumberFormat("us").format(value).toString();
const percentageFormatter = (value: number) =>
    `${Intl.NumberFormat("us")
        .format(value * 100)
        .toString()}%`;
function sumArray(array: any[], metric: string) {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue[metric], 0);
}

export default function UsageChart() {
    return (
        <Card className="p-0">
            <TabGroup>
                <TabList>
                    <Tab className="p-4 sm:p-6 text-left">
                        <p className="text-lg text-black">Queries</p>
                        <Metric className="mt-2 text-black">
                            225
                        </Metric>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel className="p-6">
                        <AreaChart
                            className="h-80 mt-10"
                            data={data}
                            index="Month"
                            categories={["Visitors"]}
                            colors={["blue"]}
                            valueFormatter={numberFormatter}
                            showLegend={false}
                            yAxisWidth={50}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Card>
    );
}