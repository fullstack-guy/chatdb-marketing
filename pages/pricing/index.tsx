import Layout from "../../components/Layout";
import Pricing from "../../components/Pricing";

const Page = () => {
  return (
    <Layout
      title="ChatDB Pricing | The AI Database Assistant for your team"
      description="Discover affordable plans for ChatDB, the AI Database Assistant. Find the perfect plan for your team size and needs."
      url="https://www.chatdb.ai/pricing"
    >
      <Pricing />
    </Layout>
  );
};

export default Page;
