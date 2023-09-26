import React from "react";

export default function NotSubscribed() {
  return (
    <div className="flex h-[80vh]  w-full flex-col items-center justify-center">
      <h1 className="mb-4 text-center text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
        <span className="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
          Better Data
        </span>{" "}
        Scalable AI.
      </h1>

      <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
        Database schemas can be complex. We try and make it easy for you to
        understand how everything is connected.
      </p>
      <a
        href="#"
        className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
      >
        Subscribe to a plan
        <svg
          className="ml-2 h-3.5 w-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  );
}
