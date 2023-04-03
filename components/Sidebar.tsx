import React from 'react';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
            <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
                <div className="flex items-center justify-center h-14 border-b">
                    <div>Sidebar Navigation By iAmine</div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        {/* Add menu items here */}
                        <li>
                            <button
                                onClick={() => handleNavigation('/dashboard')}
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 w-full text-left"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    {/* Add your SVG icon here */}
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 w-full text-left"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    {/* Add your SVG icon here */}
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleNavigation('/settings')}
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 w-full text-left"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    {/* Add your SVG icon here */}
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>)
}

export default Sidebar;