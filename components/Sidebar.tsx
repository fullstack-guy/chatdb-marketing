import React from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex min-h-screen flex-auto flex-shrink-0 flex-col bg-gray-50 text-gray-800 antialiased">
      <div className="fixed top-0 left-0 flex h-full w-64 flex-col border-r bg-white">
        <div className="flex h-14 items-center justify-center border-b">
          <div>Sidebar Navigation By iAmine</div>
        </div>
        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col space-y-1 py-4">
            {/* Add menu items here */}
            <li>
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="relative flex h-11 w-full flex-row items-center border-l-4 border-transparent pr-6 text-left text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
              >
                <span className="ml-4 inline-flex items-center justify-center">
                  {/* Add your SVG icon here */}
                </span>
                <span className="ml-2 truncate text-sm tracking-wide">
                  Dashboard
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/profile")}
                className="relative flex h-11 w-full flex-row items-center border-l-4 border-transparent pr-6 text-left text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
              >
                <span className="ml-4 inline-flex items-center justify-center">
                  {/* Add your SVG icon here */}
                </span>
                <span className="ml-2 truncate text-sm tracking-wide">
                  Profile
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/settings")}
                className="relative flex h-11 w-full flex-row items-center border-l-4 border-transparent pr-6 text-left text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
              >
                <span className="ml-4 inline-flex items-center justify-center">
                  {/* Add your SVG icon here */}
                </span>
                <span className="ml-2 truncate text-sm tracking-wide">
                  Settings
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
