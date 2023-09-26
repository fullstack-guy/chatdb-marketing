import React from "react";

export default function DatabaseNav({ activeTab, setActiveTab }) {
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="mt-7 flex items-center space-x-4 rounded-lg bg-gray-100 p-2">
      {["Chat", "Tables", "Flow", "Settings"].map((tabName) => (
        <button
          key={tabName}
          className={`transform rounded-lg px-4 py-2 text-lg transition duration-300 ease-in-out ${
            activeTab === tabName
              ? "scale-105 bg-[#3D4451] text-white"
              : "text-black hover:bg-gray-200"
          }`}
          onClick={() => handleTabClick(tabName)}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
}
