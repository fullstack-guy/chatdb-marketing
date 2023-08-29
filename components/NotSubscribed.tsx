import React from 'react'

export default function NotSubscribed() {
    return (
        <div className="w-full h-[80vh]  flex flex-col items-center justify-center">

            <h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Better Data</span> Scalable AI.</h1>

            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Database schemas can be complex. We try and make it easy for you to understand how everything is connected.
            </p>
            <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                Subscribe to a plan
                <svg className="w-3.5 h-3.5 ml-2" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </a>

        </div>)
}
