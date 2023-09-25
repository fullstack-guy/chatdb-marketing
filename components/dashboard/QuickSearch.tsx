import React, { useEffect, useRef } from "react";

export default function QuickSearch({ searchQuery, setSearchQuery }) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const isMac = window.navigator.userAgent.indexOf("Mac") !== -1;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (cmdOrCtrl && event.key === "k") {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div className="mt-4 sm:mt-0">
      <div className="mt-4 flex items-center sm:mt-0">
        <div className="relative">
          <input
            type="text"
            onChange={handleSearchInputChange}
            value={searchQuery}
            ref={searchInputRef}
            className="focus:ring-primary-600 w-64 flex-1 appearance-none rounded-lg border border-gray-300 border-transparent bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2"
            placeholder="Search"
          />
          <p className="absolute right-4 top-1/2 -translate-y-1/2 transform text-xs text-gray-400">
            <div className="kbd kbd-sm">⌘K</div>
          </p>
        </div>
      </div>
    </div>
  );
}
