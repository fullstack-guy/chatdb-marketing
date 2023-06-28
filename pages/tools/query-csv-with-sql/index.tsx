import dynamic from "next/dynamic";

const DynamicDuckDBComponent = dynamic(
  () => import("../../../components/duck/DuckDBComponent"),
  { ssr: false }
);

const IndexPage = () => <DynamicDuckDBComponent />;

export default IndexPage;
