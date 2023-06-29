import React from "react";

const RefreshIcon = ({ props }) => {
    return (
        <svg
            width={16}
            height={16}
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
            {...props}
        >
            <path
                className="text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M320 146s24.36-12-64-12a160 160 0 10160 160"
            ></path>
            <path
                className="text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M256 58l80 80-80 80"
            ></path>
        </svg>
    );
}

export default RefreshIcon;
