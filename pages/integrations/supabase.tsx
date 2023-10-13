import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";

const SupabasePage = () => {
  return (
    <Layout
      title="Supabase AI Database Assistant - ChatDB"
      description="The tool that is an expert on your Supabase database. Say goodbye to hours spent creating the correct query to get the data you need."
      url="https://www.chatdb.ai/integrations/supabase"
    >
      {" "}
      {/* Hero Section */}
      <div className="relative mt-4 rounded-xl">
        <div className="mb-10 flex flex-col items-center">
          <h1 className="mt-5 text-center text-6xl font-bold tracking-tighter text-heading md:max-w-5xl xl:text-8xl">
            Query Supabase{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgba(255,185,50,1) 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                paddingRight: "0.2em",
              }}
            >
              without SQL!
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-center text-xl font-semibold lg:text-2xl">
            Get data insights with natural language, powered by AI. It is like
            ChatGPT for your Supabase database.
          </p>
        </div>
      </div>
      {/* Content Section */}
      <div className="mx-8 text-lg text-black md:my-16">
        <h2 className="mb-6 inline-block text-4xl font-semibold tracking-tight">
          Why Use ChatDB with Supabase?
        </h2>
        <p className="mb-8">
          Supabase provides a robust, scalable database solution for your
          application needs. But what if you could make querying this data as
          simple as asking a question? Start finding answers for your
          applications instantly. No SQL necessary. It is like ChatGPT meeting
          your Supabase database.
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
        <div className="my-16 text-black">
          <h2 className="mb-6 text-4xl font-bold">
            How to Connect to Supabase
          </h2>
          <p className="mb-8 text-lg">
            Connecting to Supabase is simple. Follow these steps to get started.
          </p>

          <div className="mb-16 mt-8">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 1: Get Supabase Database Credentials
            </h3>
            <Image
              alt="Supabase Connection Database Information"
              className="rounded-3xl"
              layout="responsive"
              height={500}
              width={400}
              src="/images/supabase-connection-db-info.png"
            />
          </div>

          <div className="md:my-32">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 2: Connect ChatDB with Supabase
            </h3>
            <div className="mx-auto max-w-5xl">
              <Image
                alt="ChatDB Connection UI"
                className="rounded-3xl"
                layout="responsive"
                height={600}
                width={700}
                src="/images/chatdb-connect-ui.png"
              />
            </div>
          </div>

          <div className="my-10 md:my-32">
            <h3 className="mb-4 text-3xl font-semibold">
              Step 3: Query Supabase with AI
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
                height={300} // Made this image smaller
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

export default SupabasePage;
