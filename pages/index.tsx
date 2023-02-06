import { Fragment, useRef, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuAlt3Icon } from "@heroicons/react/outline";
import { registerUmamiScript } from '@parcellab/react-use-umami';
import useUmami from "@parcellab/react-use-umami";
import { hotjar } from 'react-hotjar';

import {
  LightBulbIcon,
  ArrowRightIcon,
  CheckIcon,
  LightningBoltIcon
} from "@heroicons/react/outline";
import { NextSeo } from 'next-seo';

export default function Page() {
  const _trackEvt = useUmami('/')
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.play();
    registerUmamiScript('https://wordbase.ai', 'b69c6679-f334-4fb4-a476-663593d15e95')
    hotjar.initialize(3353205, 6);
  }, [])

  const trackAppLink = (message: string) => {
    _trackEvt(message, 'click');
    hotjar.event(message);
  }

  return (
    <div>
      <NextSeo
        title="Wordbase | The all in one toolkit for educators and students"
        description="Create quiz questions with ease, craft personalized emails, develop effective learning plans, and build standout resume bullet points. Let our AI technology do the heavy lifting so you can focus on what really matters: teaching and learning."
        openGraph={{
          url: 'https://www.wordbase.ai',
          title: 'Wordbase.ai | Let AI do the heavy lifting so you can focus on what really matters!',
          description: 'Let our AI technology do the heavy lifting so you can focus on what really matters: teaching and learning.',
          images: [
            {
              url: 'https://sparkk-assets.s3.amazonaws.com/ogg.png',
              width: 800,
              height: 600,
              alt: 'Wordbase',
              type: 'image/jpeg',
            },
          ],
          siteName: 'SiteName',
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: 'https://sparkk-assets.s3.amazonaws.com/favicon.ico',
          },
        ]}
      />
      {/* Navbar */}
      <header className="mx-auto max-w-6xl px-8 xl:px-0">
        <nav className="relative z-20 flex shrink-0 items-center space-x-2 py-6">
          <a href="#" className="z-10" onClick={() => trackAppLink('App CTA')}>
            {/* Logo */}
            <div className="h-9 text-heading">
              <div className="text-3xl font-bold text-heading">Wordbase</div>
            </div>
          </a>
          <div className="flex-1">
            <div className="absolute inset-y-0 inset-x-0 hidden items-center justify-center space-x-1.5 px-4 md:flex">
              <a
                href="#"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-transparent px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
              >
                Features
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-transparent px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
              >
                Pricing
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-transparent px-4 py-2.5 text-base font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
              >
                Blog
              </a>
            </div>
          </div>
          <div className="z-10">
            <a href="https://app.wordbase.ai" style={{ textDecoration: "none" }} onClick={() => trackAppLink('App CTA')}>
              <button
                type="button"
                className="hidden cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-base font-semibold text-text  shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80 md:inline-flex"
              >
                Open App
              </button>
            </a>
          </div>

          <Menu as="div" className="relative md:hidden">
            <Menu.Button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none border-transparent bg-transparent p-2 font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text"
            >
              <MenuAlt3Icon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-layer-3 py-3 shadow-xl focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? "bg-muted-1 text-heading" : "text-text"
                        } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                    >
                      Features
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? "bg-muted-1 text-heading" : "text-text"
                        } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                    >
                      Pricing
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? "bg-muted-1 text-heading" : "text-text"
                        } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                    >
                      Blog
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a href="https://app.wordbase.ai" style={{ textDecoration: "none" }} onClick={() => trackAppLink('App CTA')}>
                      <button
                        className={`${active ? "bg-muted-1 text-heading" : "text-text"
                          } flex w-full cursor-pointer items-center px-4 py-2 text-sm font-semibold`}
                      >
                        Open App
                      </button>
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <section className="px-8 pt-6 pb-2 text-center md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center">

              <h1 className="mt-8 text-center text-3xl font-semibold text-heading md:max-w-4xl lg:text-5xl xl:text-6xl ">
                Cut out the busy work in the classroom
              </h1>
              <p className="mt-6 mb-6 max-w-3xl text-xl">
                Let AI do the heavy lifting so you can focus on what really matters!</p>
              <a href="https://app.wordbase.ai" style={{ textDecoration: "none" }} onClick={() => trackAppLink('App CTA')}>
                <button
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none bg-gradient-to-r from-fuchsia-600 to-orange-700 px-7 py-5 text-sm font-semibold text-white transition duration-200 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
                >
                  Get Started
                </button>
              </a>
            </div>
            <div className="mt-12 rounded-3xl  flex flex-col items-center py-5">
              <video ref={videoRef} id="vid" muted playsInline loop controls className="h-full w-full object-cover rounded-xl">
                <source src={"https://sparkk-assets.s3.amazonaws.com/demo.mp4"} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Feature section -- 3x2 grid */}
        <div className="w-full bg-layer-1 p-6 text-center md:p-20">
          <div className="mx-auto w-full max-w-6xl">
            <span className="leading-sm inline-flex items-center rounded-full border-2 border-orange-200 bg-orange-200 px-2 py-0.5 text-xs font-bold font-semibold uppercase text-orange-600 shadow-sm">
              <LightBulbIcon className="mr-1 h-5 w-5" />
              Features
            </span>
            <h2 className="mx-auto mt-4 text-center text-3xl font-semibold tracking-tight text-heading md:max-w-2xl md:text-4xl">
              Efficiency is key. Let us do the chores.
            </h2>
            <p className="mt-6 text-xl text-text">
              Spend less time doing busy work so you can spend more time with students.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Quiz Questions
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Generate quiz questions on any topic.
                </p>
              </div>
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Emails
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Write professional emails with all of the details.
                </p>
              </div>
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Learning Plans
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Find creative ways to teach difficult topics.
                </p>
              </div>
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Essay Outlines
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Well defined essay outlines on the topic of your choice.
                </p>
              </div>
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Resume Points
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Resume bullet points that focus on your impact and outcomes.
                </p>
              </div>
              <div className="p-5 text-center md:p-8">
                <div className="inline-block rounded-3xl bg-layer-2 py-4 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  Coding Questions
                </h3>
                <p className="mt-2 text-center text-lg text-text">
                  Create technical questions with real examples in dozens of languages.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="p-8 md:py-20">
          <div className="rounded-4xl mx-auto flex max-w-6xl flex-col items-center text-center sm:bg-layer-2 sm:py-12 sm:px-6 md:py-18 lg:px-32 2xl:px-64">
            <span className="inline-flex items-center rounded-full border-2 border-pink-200 bg-pink-200 px-2 py-1 text-sm font-semibold text-pink-600 shadow-sm">
              <LightningBoltIcon className="mr-1 h-5 w-5" />
              7-day free trial
            </span>

            <h2 className="mt-6 text-3xl font-semibold text-heading md:text-4xl">
              Try it today for 7 days!
            </h2>

            <p className="mt-4 text-lg font-medium">
              Totally free for 7 days. Just sign up and start creating in seconds.
            </p>

            <a
              href="https://app.wordbase.ai"
              className="mt-6 flex items-center space-x-4 text-lg font-medium"
            >
              <span className="bg-gradient-to-r text-gradient gradient-dusk">
                Explore Wordbase
              </span>
              <ArrowRightIcon className="h-6 w-6 text-[#fca5a5] dark:text-[#fda4af]" />
            </a>
          </div>
        </section>

        {/* Feature section -- 2 column image x text */}
        <section className="px-8 py-12 md:py-18">
          <div className="mx-auto max-w-6xl space-y-24 md:space-y-36">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row ">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="mr-1.5 inline-flex items-center rounded-full border-2 border-red-200 bg-red-200 px-2 py-1 text-sm font-semibold text-red-600 shadow-sm">
                  Step 1
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Pick your tool
                </h3>
                <p className="text-lg font-medium">
                  Choose any subject to generate exam questions from and pick your favorite question format.
                </p>
              </div>

              <div className="max-w-lg">
                <img
                  src="https://i.ibb.co/TT6DtFn/Options.png"
                  alt=""
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row-reverse">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-green-200 bg-green-200 px-2 py-1 text-sm font-semibold text-green-600 shadow-sm">
                  Step 2
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Give some context
                </h3>
                <p className="text-lg font-medium">
                  Enter a few details on what you have done or are trying to do!
                </p>
              </div>

              <div className="max-w-lg">
                <img
                  src="https://i.ibb.co/fdYbPzQ/Generate.png"
                  alt=""
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row ">
              <div className="max-w-md space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center rounded-full border-2 border-orange-200 bg-orange-200 px-2 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                  Step 3
                </span>
                <h3 className="text-3xl font-semibold text-heading lg:text-4xl">
                  Enjoy your time saved
                </h3>
                <p className="text-lg font-medium">
                  The AI generator will give you multiple options to choose from!
                </p>
              </div>

              <div className="max-w-lg">
                <img
                  src="https://i.ibb.co/1dZfS3L/Question-List.png"
                  alt=""
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-6xl py-24 px-5">
          <h1 className="text-center text-5xl font-semibold text-heading">
            Plans & Pricing
          </h1>

          {/* <div className="mt-16 text-center">
            <button
              type="button"
              className="relative z-10 inline-flex w-48 cursor-pointer items-center justify-center rounded-l-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold  text-heading shadow-sm hover:text-heading focus:z-10 focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
            >
              Monthly
            </button>

            <button
              type="button"
              className="relative -ml-0.5 inline-flex w-48 cursor-pointer items-center justify-center rounded-r-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text  shadow-sm hover:text-heading focus:z-10 focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
            >
              Annual (save 20%)
            </button>
          </div> */}

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="rounded-3xl border-4 border-blue-600 bg-layer-2 p-5">
              <h3 className="mt-4 text-4xl font-semibold text-heading">Pro</h3>
              <p className="mt-4 h-10 text-sm font-medium">
                Supercharge your class
              </p>

              <div className="mt-8">
                <div className="text-sm font-medium">Per Month</div>
                <h4 className="mt-1 text-4xl font-semibold text-heading">$14.99</h4>
              </div>
              <a href="https://app.wordbase.ai/open-checkout" style={{ textDecoration: "none" }} onClick={() => trackAppLink('Stripe Portal')}>
                <button
                  type="button"
                  className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold  text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              </a>

              <div className="text-medium mt-6 space-y-2 text-sm text-heading">
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Quiz Questions</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Resume Content</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Essay Outlines</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Letter of Recommendations</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Learning Activities</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Email Generator</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border-4 border-layer-2 bg-layer-2 p-5">
              <h3 className="mt-4 text-4xl font-semibold text-heading">Enterprise</h3>
              <p className="mt-4 h-10 text-sm font-medium">
                Craft a special group plan with 1:1 support and custom features
              </p>

              <div className="mt-8">
                <h4 className="mt-1 text-4xl font-semibold text-heading">Contact Us</h4>
              </div>

              <a href="https://tally.so/r/nPRKYx" target="_blank" rel="noreferrer noopener" style={{ textDecoration: "none" }} onClick={() => trackAppLink('Contact Us')}>
                <button
                  type="button"
                  className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold  text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
                >
                  Contact Us
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              </a>

              <div className="text-medium mt-6 space-y-1 text-sm text-heading">
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Everything in Pro</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>On Demand Support</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Custom Features</div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  <div>Group Discount</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="p-8 md:py-20">
          <div className="rounded-4xl mx-auto flex max-w-6xl flex-col items-center text-center sm:bg-layer-2 sm:py-12 sm:px-6 md:py-18 lg:px-32 2xl:px-64">
            <h2 className="text-3xl font-semibold text-heading md:text-4xl">
              Stay in touch!
            </h2>

            <p className="mt-4 text-lg font-medium">
              We don't spam our friends 🤝. We will only reach out if we have something really cool to share!
            </p>

            <form className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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
                  className="block w-full rounded-xl border-2 border-layer-3 bg-muted-1 px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm md:w-64"
                />
              </div>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 pt-10 pb-18">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between space-y-8 md:flex-row md:space-y-0">
            <div>
              <a href="#">
                {/* Logo */}
                <div className="h-8 text-heading">
                  <div className="text-3xl font-bold text-heading">Wordbase</div>
                </div>
              </a>
              <div className="mt-6 flex space-x-4 text-text">
                <a href="#" target="_blank" rel="noreferrer noopener">
                  {/* Logo icon: Twitter */}
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M14.038 4.78718C14.0442 4.92798 14.0442 5.06238 14.0442 5.20318C14.0504 9.47199 10.9141 14.4 5.17858 14.4C3.48695 14.4 1.82618 13.8944 0.400024 12.9472C0.646978 12.9792 0.893932 12.992 1.14089 12.992C2.54235 12.992 3.90677 12.5056 5.01188 11.6032C3.67833 11.5776 2.5053 10.6752 2.09783 9.35679C2.56704 9.45279 3.0486 9.43359 3.50547 9.29919C2.05461 9.00479 1.01123 7.67998 1.00506 6.13758C1.00506 6.12478 1.00506 6.11198 1.00506 6.09918C1.43723 6.34878 1.92496 6.48958 2.41887 6.50238C1.05445 5.55518 0.628457 3.66717 1.45575 2.18877C3.04243 4.21117 5.37614 5.43358 7.88272 5.56798C7.62959 4.44797 7.97533 3.27037 8.7841 2.47677C10.0374 1.25436 12.013 1.31836 13.1984 2.61757C13.896 2.47677 14.569 2.20797 15.1802 1.83037C14.9456 2.57917 14.4579 3.21277 13.8096 3.61597C14.427 3.53917 15.032 3.36637 15.6 3.11037C15.1802 3.76317 14.6493 4.32637 14.038 4.78718Z" />
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noreferrer noopener">
                  {/* Logo icon: YoutTube */}
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path
                      d="M15.6704 4.15287C15.4859 3.46753 14.9456 2.92717 14.2602 2.74266C13.0082 2.39999 7.99997 2.39999 7.99997 2.39999C7.99997 2.39999 2.99175 2.39999 1.7397 2.72948C1.06754 2.91399 0.514001 3.46753 0.329488 4.15287C0 5.40492 0 8.00129 0 8.00129C0 8.00129 0 10.6108 0.329488 11.8497C0.514001 12.535 1.05436 13.0754 1.7397 13.2599C3.00493 13.6026 7.99997 13.6026 7.99997 13.6026C7.99997 13.6026 13.0082 13.6026 14.2602 13.2731C14.9456 13.0886 15.4859 12.5482 15.6704 11.8629C15.9999 10.6108 15.9999 8.01447 15.9999 8.01447C15.9999 8.01447 16.0131 5.40492 15.6704 4.15287Z"
                      fill="currentColor"
                    />
                    <path
                      d="M6.40524 10.4L10.57 8.00129L6.40524 5.60262V10.4Z"
                      fill="#1A1D2D"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-heading">
                Wordbase
              </div>
              <div className="mt-6 space-y-3 font-medium">
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Try it for Free
                </a>
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Email Creation
                </a>
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Letter of Recommendation
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-heading">
                Resources
              </div>
              <div className="mt-6 space-y-3 font-medium">
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Pricing
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-heading">
                Company
              </div>
              <div className="mt-6 space-y-3 font-medium">
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block font-semibold text-text hover:text-heading"
                >
                  Twitter
                </a>
                <a
                  href="https://tally.so/r/nPRKYx"
                  className="block font-semibold text-text hover:text-heading"
                  onClick={() => trackAppLink('Contact Us')}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col space-x-0 space-y-4 text-sm font-medium sm:flex-row sm:space-y-0 sm:space-x-6">
            <span>Copyright &copy; {new Date().getFullYear()}</span>
            <a href="#" className="text-text/50 hover:text-heading">
              Terms of Service
            </a>
            <a href="#" className="text-text/50 hover:text-heading">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div >
  );
}