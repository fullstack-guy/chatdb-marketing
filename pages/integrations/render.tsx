import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";

const RenderPage = () => {
  return (
    <Layout
      title="Render AI Database Assistant - ChatDB"
      description="The tool that is an expert on your Render database. Say goodbye to hours spent creating the correct query to get the data you need."
      url="https://www.chatdb.ai/integrations/render"
    >
      {/* Hero Section */}
      <div className="relative mt-4 rounded-xl bg-gray-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2"></div>
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center text-7xl font-extrabold tracking-tight text-white sm:text-8xl lg:text-7xl xl:text-8xl">
            ChatDB + Render
          </h1>
          <p className="mt-3 text-center text-xl font-semibold leading-7 text-white sm:mt-4">
            Query your Render database with natural language and AI
          </p>
          <Link href="/dashboard">
            <button className="btn-success btn mt-10 rounded-md px-8 py-3 font-semibold text-white">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      {/* Content Section */}
      <div className="mx-8 my-16 text-lg text-black">
        <h2 className="mb-6 inline-block text-3xl font-semibold tracking-tight">
          Why Use ChatDB with Render?
        </h2>
        <p className="mb-8">
          Render provides a robust, scalable database solution for your
          application needs. But what if you could make querying this data as
          simple as asking a question? Start finding answers for your
          applications instantly. No SQL necessary. It is like ChatGPT meeting
          your Render database.
        </p>

        <div className="my-10 px-0 md:px-2">
          {/* Image for larger devices */}
          <Image
            alt="chatdb demo image"
            className="hidden w-full rounded-3xl sm:block"
            layout="responsive"
            height={700}
            width={500}
            src="/images/ChatDBDemo.png"
          />

          {/* Image for smaller devices */}
          <Image
            alt="chatdb demo image"
            className="w-full rounded-3xl sm:hidden"
            layout="responsive"
            height={700}
            width={500}
            src="/images/ChatDBTableExample-min.png"
          />
        </div>

        {/* How to Connect to Supabase Section */}
        <div className="mx-8 my-16 text-black">
          <h2 className="mb-6 text-4xl font-bold">How to Connect to Render</h2>
          <p className="mb-8 text-lg">
            Connecting to Render is simple. Follow these steps to get started.
          </p>

          <div className="mb-16 mt-8">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 1: Get Render Database Credentials
            </h3>
            <div className="mx-auto mb-8 max-w-2xl">
              <Image
                alt="Render Connection Database Information"
                className="rounded-3xl"
                layout="responsive"
                height={500}
                width={400}
                src="/images/render-database-info.png"
              />
            </div>
          </div>

          <div className="my-32">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 2: Connect ChatDB with Render
            </h3>
            <div className="mx-auto max-w-2xl">
              <Image
                alt="ChatDB Connection UI"
                className="rounded-3xl"
                layout="responsive"
                height={500}
                width={400}
                src="/images/chatdb-connect-ui.png"
              />
            </div>
          </div>

          <div className="my-16">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 3: Query Render with AI
            </h3>
            <p className="mb-8 text-lg">
              Now you're all set! Start querying your data with natural
              language.
            </p>
            <div className="mx-auto max-w-2xl">
              <Image
                alt="ChatDB Query UI"
                className="rounded-3xl"
                layout="responsive"
                height={300}
                width={400}
                src="/images/AskDB.png"
              />
            </div>
          </div>
        </div>

        <h2 className="mb-6 inline-block text-3xl font-semibold tracking-tight">
          AI-Powered Queries
        </h2>
        <p className="mb-8">
          With ChatDB's AI capabilities, even users with zero SQL or technical
          skills can interact with your Supabase database. Just ask a question
          like "What's the average revenue for last quarter?" and get your
          answer in real-time.
        </p>

        <h2 className="mb-6 inline-block text-3xl font-semibold tracking-tight">
          Easy Integration
        </h2>
        <p className="mb-8">
          Integrating ChatDB with your existing Supabase database is
          straightforward. Within minutes, you'll have a natural language
          interface for your data.
        </p>

        <h2 className="mb-6 inline-block text-3xl font-semibold tracking-tight">
          Secure and Scalable
        </h2>
        <p className="mb-8">
          ChatDB ensures that your data stays secure while providing a scalable
          solution to meet the demands of your growing business.
        </p>
      </div>
    </Layout>
  );
};

export default RenderPage;
