import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import {
  TagIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import Layout from "../components/Layout";
import { CameraIcon } from "@heroicons/react/outline";

export default function Page() {
  const [email, setEmail] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === "") {
      toast.error("Sorry, the email field is blank");
      return;
    }

    axios
      .post("https://api.slapform.com/vKid4Let6", { email: email })
      .then((response) => {
        console.log("Success:", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("Sent Email", email);
    // Display a toast message when the form is submitted
    toast.success("Thanks for signing up!");
    setEmail("");
  };
  return (
    <Layout>
      <main>
        {/* Hero section */}
        <section className="px-8 pt-6 pb-2 text-center md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center">
              <h1 className="mt-5 text-center text-3xl font-semibold text-heading md:max-w-4xl lg:text-5xl xl:text-6xl">
                Finally, you can <div style={{
                  display: "inline",
                  backgroundImage: "linear-gradient(90deg, rgba(244,155,255,1) 0%, rgba(172,152,251,1) 80%);",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 0.15em",
                  backgroundPosition: "0 88%",
                }}>chat</div> with your database!
              </h1>
              <p className="mt-6 max-w-3xl text-xl">
                The AI tool that knows everything about your database so it can help you generate SQL queries that work!
              </p>
              <form
                className="subscription-form mt-6 flex flex-col gap-2 sm:flex-row"
                method="POST"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="sr-only block text-sm font-semibold border-blue-400 text-heading"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-72 rounded-xl border-2 border-layer-3 bg-muted-1 px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  style={{ background: "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgb(121 87 255 / 80%) 75%)" }}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
                >
                  Submit
                </button>
              </form>
            </div>
            {/* <div className="mt-12 md:px-2">
              <svg
                width="auto"
                height="auto"
                viewBox="0 0 1140 641"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 24.0004C0 10.7456 10.7452 0.000427246 24 0.000427246H1116C1129.25 0.000427246 1140 10.7456 1140 24.0004V617C1140 630.255 1129.25 641 1116 641H24C10.7452 641 0 630.255 0 617V24.0004Z"
                  fill="url(#paint0_linear_2756_51693)"
                />
                <g filter="url(#filter0_d_2756_51693)">
                  <rect
                    x="232.535"
                    y="81.0004"
                    width="675.126"
                    height="479"
                    rx="45.2598"
                    fill="url(#paint1_linear_2756_51693)"
                    fillOpacity="0.5"
                    shapeRendering="crispEdges"
                  />
                </g>
                <rect
                  x="315.512"
                  y="258.268"
                  width="339.449"
                  height="222.528"
                  rx="45.2598"
                  fill="url(#paint2_linear_2756_51693)"
                  fillOpacity="0.5"
                />
                <rect
                  x="677.59"
                  y="258.268"
                  width="150.866"
                  height="222.528"
                  rx="45.2598"
                  fill="url(#paint3_linear_2756_51693)"
                  fillOpacity="0.5"
                />
                <rect
                  x="421.118"
                  y="148.89"
                  width="60.3465"
                  height="30.1732"
                  rx="15.0866"
                  fill="white"
                  fillOpacity="0.7"
                />
                <rect
                  x="511.638"
                  y="148.89"
                  width="60.3465"
                  height="30.1732"
                  rx="15.0866"
                  fill="white"
                  fillOpacity="0.7"
                />
                <rect
                  x="602.157"
                  y="148.89"
                  width="60.3465"
                  height="30.1732"
                  rx="15.0866"
                  fill="white"
                  fillOpacity="0.7"
                />
                <rect
                  x="323.055"
                  y="130.032"
                  width="67.8898"
                  height="67.8898"
                  rx="33.9449"
                  fill="white"
                  fillOpacity="0.6"
                />
                <defs>
                  <filter
                    id="filter0_d_2756_51693"
                    x="224.992"
                    y="81.0004"
                    width="690.212"
                    height="494.087"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="7.54331"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_2756_51693"
                    />
                    <feOffset dy="7.54331" />
                    <feGaussianBlur stdDeviation="7.54331" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2756_51693"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2756_51693"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_2756_51693"
                    x1="-2.12341e-06"
                    y1="320.501"
                    x2="1140"
                    y2="320.501"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9068FE" />
                    <stop offset="1" stopColor="#FEB068" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2756_51693"
                    x1="570.098"
                    y1="81.0004"
                    x2="570.098"
                    y2="560"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_2756_51693"
                    x1="485.236"
                    y1="258.268"
                    x2="485.236"
                    y2="480.796"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_2756_51693"
                    x1="753.023"
                    y1="258.268"
                    x2="753.023"
                    y2="480.796"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div> */}
          </div>
        </section>
        <section className="bg-layer-1 p-6 md:p-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                <div className="mt-8 w-full  md:mt-16">
                  <img
                    alt="slack conversation img"
                    className="rounded-lg"
                    src="https://chatdb-assets.s3.amazonaws.com/slackimg.png"
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
                  <img
                    alt="slack conversation img"
                    className="rounded-lg"
                    src="https://chatdb-assets.s3.amazonaws.com/sqlgenerated.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="w-full my-20">
            <img src="https://chatdb-assets.s3.amazonaws.com/Features.png" className="mx-auto hidden md:w-[50%] md:block"></img>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-8 px-6 sm:py-18">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-4xl font-semibold text-heading md:text-5xl md:leading-tight">
              Integrates with your favorite databases.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium">
              Just plug ChatDB into your existing ecosystem!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-12 md:gap-8">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-layer-2 p-2">
                <img
                  alt="mongodb logo"
                  src="https://saasblocks-preview-tdg1-prd.fly.dev/assets/logos/mongodb.png"
                />
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-layer-2 p-2">
                <img
                  alt="redis logo"
                  src="https://chatdb-assets.s3.amazonaws.com/redis.png"
                />
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-layer-2 p-2">
                <img
                  alt="mongodb logo"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Antu_mysql-workbench.svg/1200px-Antu_mysql-workbench.svg.png"
                />
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-layer-2 p-2">
                <img
                  alt="postgres logo"
                  src="https://chatdb-assets.s3.amazonaws.com/postgres.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}

        <section className="px-8 py-12 md:py-18">
          <div className="mx-auto max-w-6xl space-y-24 md:space-y-36">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row ">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-red-200 bg-red-200 px-2 py-1 text-sm font-semibold text-red-600 shadow-sm">
                  <TagIcon className="mr-1 h-5 w-5" />
                  Visualizations
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Schema Visualizer
                </h3>
                <p className="text-lg font-medium">
                  Simplify the complexity of learning how the database tables are related with a sleak visualization that you can reference during your work.
                </p>
              </div>

              <div className="max-w-lg">
                <img
                  src="https://chatdb-assets.s3.amazonaws.com/SchemaVisualizer.png"
                  alt=""
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row-reverse">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-green-200 bg-green-200 px-2 py-1 text-sm font-semibold text-green-600 shadow-sm">
                  <ShieldCheckIcon className="mr-1 h-5 w-5" />
                  Database Model Snapshot
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Add new databases in seconds
                </h3>
                <p className="text-lg font-medium">
                  Taking a database snapshot so ChatDB can learn your data model is super simple!
                </p>
              </div>

              <div className="max-w-lg">
                <img
                  src="https://chatdb-assets.s3.amazonaws.com/Snapshot.gif"
                  alt=""
                  className="w-full rounded-lg"
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
                <img
                  src="https://i.imgur.com/5JzWVvz.png"
                  alt=""
                  className="w-full"
                />
              </div>
            </div> */}
          </div>
        </section>

        <section className="py-18">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-semibold text-heading md:text-3xl">
              Get it done in 3 easy steps
            </h2>
            <p className="mt-4 text-center text-lg font-medium">
              Get help creating SQL queries in minutes
            </p>
            <div className="mt-14 grid gap-6 px-5 md:grid-cols-3 lg:gap-14">
              <div className="space-y-3 rounded-3xl bg-layer-2 px-4 pt-6 pb-10 text-center">
                <div className="inline-grid place-content-center rounded-3xl bg-layer-3 p-4">
                  <CameraIcon className="h-8 w-8 stroke-gradient gradient-lime" />
                </div>
                <span className="block text-sm font-semibold uppercase tracking-wide">
                  Step 1
                </span>
                <h3 className="text-xl font-semibold text-heading">
                  Take a Snapshot
                </h3>
                <p className="text-lg font-medium">
                  Take a snapshot of your db so ChatDB knows about the tables,
                  fields, and relationships.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl bg-layer-2 px-4 pt-6 pb-10 text-center">
                <div className="inline-grid place-content-center rounded-3xl bg-layer-3 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 stroke-gradient gradient-dusk"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <span className="block text-sm font-semibold uppercase tracking-wide">
                  Step 2
                </span>
                <h3 className="text-xl font-semibold text-heading">
                  Give your data context
                </h3>
                <p className="text-lg font-medium">
                  Write a couple notes if needed on any intricacies about your
                  database.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl bg-layer-2 px-4 pt-6 pb-10 text-center">
                <div className="inline-grid place-content-center rounded-3xl bg-layer-3 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 stroke-gradient gradient-peach"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <span className="block text-sm font-semibold uppercase tracking-wide">
                  Step 3
                </span>
                <h3 className="text-xl font-semibold text-heading">
                  Chat with your Database
                </h3>
                <p className="text-lg font-medium">
                  Ask ChatGPT to build any query for data you are trying to
                  find.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="p-8 md:py-20">
          <div className="rounded-xl mx-auto flex max-w-6xl flex-col items-center text-center sm:bg-layer-2 sm:py-12 sm:px-6 md:py-18 lg:px-32 2xl:px-64">
            <h2 className="text-3xl font-semibold text-heading md:text-4xl">
              Stay in touch and be notified when it is released!
            </h2>

            <form
              className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="sr-only block text-sm font-semibold text-heading"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-2 border-layer-3 bg-muted-1 px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm md:w-64"
                />
              </div>
              <button
                type="submit"
                style={{ background: "linear-gradient(90deg, rgba(168,41,250,1) 0%, rgb(121 87 255 / 80%) 75%)" }}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
        <footer className="flex flex-col items-center pt-10 pb-18">
          {/* Logo */}
          <div className="h-8 text-heading">
            <h1 className="text-md font-bold text-heading">Copyright ChatDB</h1>
          </div>
        </footer>
      </main>
      <Toaster />
    </Layout>
  );
}
