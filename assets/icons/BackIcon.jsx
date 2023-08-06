import * as React from "react";
const BackIcon = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="h-8 w-8 text-black"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export default BackIcon;
