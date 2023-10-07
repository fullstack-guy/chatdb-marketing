import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import { TagIcon } from "@heroicons/react/outline";
import Layout from "../components/Layout";
import posthog from "posthog-js";
import Image from "next/image";
import { LightBulbIcon } from "@heroicons/react/outline";
import { Tweet } from "react-tweet";
import FAQ from "../components/FAQ";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleVideo = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    videoRef.current.play();
    videoRef.current.pause();

    const setVideoPoster = () => {
      if (window.innerWidth < 640) {
        // For mobile
        videoRef.current.poster = "/images/ChatDBTableExample-min.png";
      } else {
        // For larger screens
        videoRef.current.poster = "/images/ChatDBDemo.png";
      }
    };

    // Initial setup
    setVideoPoster();

    // Listen for window resize events to update the poster
    window.addEventListener("resize", setVideoPoster);

    // Cleanup
    return () => {
      window.removeEventListener("resize", setVideoPoster);
    };
  }, []);

  return (
    <Layout>
      <main>
        {/* Hero section */}
        <section className="px-4 pb-2 pt-6 text-center md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center">
              <h1 className="mt-5 text-center text-5xl font-bold tracking-tighter text-heading md:max-w-4xl md:text-6xl xl:text-8xl">
                Query your data with {" "}
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
              <p className="mt-6 max-w-3xl text-lg lg:text-2xl">
                Get data insights with natural language, powered by AI. It
                is like ChatGPT for your database.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    posthog.capture("homepage_cta");
                    router.push("/dashboard");
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgba(255,185,50,1) 100%)",
                  }}
                  className="text-md mt-2 inline-flex transform cursor-pointer items-center justify-center rounded-xl border-none px-8 py-4 font-bold text-white transition duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="mt-12 rounded-3xl p-4 px-0 md:px-2">
              <div className="relative">
                <video
                  onClick={toggleVideo}
                  ref={videoRef}
                  className="w-full rounded-3xl sm:block"
                  autoPlay
                  muted
                  loop
                >
                  <source
                    src="https://res.cloudinary.com/dohopff7b/video/upload/v1696469996/ShortChatDBDemo_bc0a1v.mp4"
                    type="video/mp4"
                  />
                </video>
                <button
                  onClick={toggleVideo}
                  className={`${playing ? "hidden" : "absolute"
                    } left-[calc(50%-30px)] top-[calc(50%-30px)] rounded-full bg-[black] p-2 shadow-lg`}
                >
                  <svg
                    className="h-14 w-14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 4l15 8-15 8V4z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="my-20 w-full bg-layer-1 p-6 text-center md:p-20">
          <div className="mx-auto w-full max-w-6xl">
            <span className="leading-sm inline-flex items-center rounded-full border-2 border-orange-200 bg-orange-200 px-2 py-0.5 text-xs font-bold uppercase text-orange-600 shadow-sm">
              <LightBulbIcon className="mr-1 h-5 w-5" />
              No Code Required
            </span>
            <h2 className="mx-auto mt-4 text-center text-3xl font-semibold tracking-tight text-heading md:max-w-2xl md:text-5xl">
              We hate writing SQL as much as the next person
            </h2>
            <p className="mt-6 text-xl text-text">
              We all know SQL queries are like single use plastics! You need it
              one time and don't use it again.
              <br></br>
              <br></br>
              Ask the questions you want to know without spending half an hour
              wrangling SQL!
            </p>
            <div className="mt-10 flex flex-col space-y-0 md:flex-row md:space-x-4 md:space-y-0">
              <div className="w-full md:w-1/3">
                <Tweet id="1693649281931211172" />
              </div>
              <div className="w-full md:w-1/3">
                <Tweet id="1693520648696668621" />
              </div>
              <div className="w-full md:w-1/3">
                <Tweet id="1693846373542817914" />
              </div>
            </div>
          </div>
        </div>

        {/* Before and After */}

        <section className="my-20 bg-layer-1 p-6 md:p-10">
          <div className="max-w-8xl mx-auto w-full">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-layer-2 p-5 md:px-8 md:py-6">
                <div className="inline-block rounded-2xl bg-layer-3 p-3">
                  {/* Heroicon name: outline/user-circle */}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 stroke-gradient gradient-sky"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 bg-gradient-to-r text-3xl font-semibold text-gradient gradient-sky">
                  Before.
                </h3>
                <h3 className="mt-2 text-3xl font-semibold text-heading">
                  Spend 30 minutes struggling to find the right SQL query 🤔
                </h3>

                <div className="mt-8 w-full md:mt-16">
                  <Image
                    alt="slack conversation img"
                    className="rounded-lg"
                    height={400}
                    width={600}
                    src="/images/slackimg.png"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-layer-2 p-5 md:px-8 md:py-6">
                <div className="inline-block rounded-2xl bg-layer-3 p-3">
                  {/* Heroicon name: outline/lightning-bolt */}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 stroke-gradient gradient-peach"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 bg-gradient-to-r text-3xl font-semibold text-gradient gradient-peach">
                  After with ChatDB.
                </h3>
                <h3 className="mt-2 text-3xl font-semibold text-heading">
                  Get quick answers to tough questions in seconds 👏
                </h3>
                <div className="mt-8 w-full md:mt-16">
                  <Image
                    alt="slack conversation image"
                    className="rounded-lg"
                    height={400}
                    width={600}
                    src="/images/chatdb-ask-ui.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}

        <section className="px-4 py-12 md:py-18">
          <div className="mx-auto max-w-6xl space-y-24 md:space-y-36 lg:space-y-64 xl:space-y-72">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row-reverse">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-green-200 bg-green-200 px-2 py-1 text-sm font-semibold text-green-600 shadow-sm">
                  <TagIcon className="mr-1 h-5 w-5" />
                  Powered by AI
                </span>
                <h3 className="text-4xl font-semibold text-heading lg:text-5xl">
                  Answers to your questions
                </h3>
                <p className="text-lg font-medium">
                  Ask your database questions in natural language and ChatDB
                  will write the SQL and answer your question!
                </p>
              </div>

              <div className="h-72 max-w-2xl">
                <Image
                  alt="chatgpt ask image"
                  className="rounded-xl"
                  height={500}
                  width={600}
                  src="/images/AskDB-min.png"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row ">
              <div className="mt-10 max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-red-200 bg-red-200 px-2 py-1 text-sm font-semibold text-red-600 shadow-sm">
                  <TagIcon className="mr-1 h-5 w-5" />
                  Visualizations
                </span>
                <h3 className="text-4xl font-semibold text-heading lg:text-5xl">
                  Visualize your data relationships
                </h3>
                <p className="text-lg font-medium">
                  Database schemas can be complex. We try and make it easy for
                  you to understand how everything is connected. You get a
                  schema diagram right out of the box!
                </p>
              </div>

              <div className="h-64 max-w-lg">
                <Image
                  src="/images/SchemaVisualizer.png"
                  alt="Schema Visualizer Image"
                  width={600}
                  height={400}
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Table Viewer */}
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row-reverse">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-orange-200 bg-orange-200 px-2 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                  <TagIcon className="mr-1 h-5 w-5" />
                  Simple View
                </span>
                <h3 className="text-4xl font-semibold text-heading lg:text-5xl">
                  Simple Table Viewer
                </h3>
                <p className="text-lg font-medium">
                  No need to use a clunky database client to get a quick view of
                  your data. Simple table interface with search built in.
                </p>
              </div>

              <div className="h-72 max-w-xl">
                <Image
                  alt="chatdb table viewer"
                  className="rounded-xl"
                  height={600}
                  width={800}
                  src="/images/TableViewer.png"
                />
              </div>
            </div>

            {/* <div className="flex flex-col items-center justify-between gap-6 lg:flex-row ">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-orange-200 bg-orange-200 px-2 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                  <TagIcon className="mr-1 h-5 w-5" />
                  Features
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Lorem ipsum dolor sit amet, consectetur
                </h3>
                <p className="text-lg font-medium">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est,
                  non nulla iaculis lacus mi. Eu fusce pellentesque mattis
                  ultricies mauris orci, commodo.
                </p>
              </div>

              <div className="max-w-lg">
                <Image
                  src="https://i.imgur.com/5JzWVvz.png"
                  alt=""
                  className="w-full"
                />
              </div>
            </div> */}
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>
      <Toaster />
    </Layout>
  );
}
