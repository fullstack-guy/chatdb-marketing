import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";

const DynamicDuckDBComponent = dynamic(
  () => import("../../../components/duck/DuckDBComponent"),
  { ssr: false }
);

const IndexPage = () => (
  <Layout
    title="Query CSV files with SQL | ChatDB"
    description="Use ChatDB to query, view, and edit your CSV files using SQL. Upload your CSV, write an SQL query, and interact with your data. Easy to use and completely in the browser."
    url="https://www.chatdb.ai/tools/query-csv-with-sql"
    oggURL="https://www.chatdb.ai/_next/image?url=images/CSVSQL.png&w=1200&q=75"
  >
    <DynamicDuckDBComponent />
  </Layout>
);

export default IndexPage;
