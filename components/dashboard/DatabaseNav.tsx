import React from 'react';

export default function DatabaseNav({ activeTab, setActiveTab }) {
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="flex items-center bg-gray-100 p-2 rounded-lg mt-7 space-x-4">
            {["Chat", "Tables", "Flow", "Settings"].map((tabName) => (
                <button
                    key={tabName}
                    className={`py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out transform ${activeTab === tabName ? "bg-[#3D4451] text-white scale-105" : "text-black hover:bg-gray-200"
                        }`}
                    onClick={() => handleTabClick(tabName)}
                >
                    {tabName}
                </button>
            ))}
        </div>
    );
}
