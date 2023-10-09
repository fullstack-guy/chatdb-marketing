import { MdClose, MdAdd } from "react-icons/md";

const TableTabs = ({
  tabs = [],
  activeTab = null,
  setActiveTab,
  handleAddTabs,
  deleteTab,
}) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <ul className="flex flex-wrap items-center justify-start gap-1 space-x-1">
        {tabs.map((tab, idx) => (
          <li key={idx} className="relative">
            <button
              className={`border-input inline-flex h-9 items-center justify-center rounded-md border px-4 py-2 pl-3 pr-7 text-sm text-black ring-0 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-semibold${activeTab === tab.id ? " bg-[#570DF8] text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.tableName}
            </button>
            <button
              className={`absolute right-2 top-2.5 ml-3 inline-flex h-4 w-4 items-center justify-center rounded-full p-0 text-sm font-medium ring-0 transition-colors focus-visible:outline-none disabled:pointer-events-none ${activeTab === tab.id ? "text-white" : ""
                }`}
              onClick={() => deleteTab(idx)}
            >
              <MdClose />
            </button>
          </li>
        ))}
        <li>
          <button
            className="border-input inline-flex h-9 w-9 items-center justify-center rounded-md border p-0 text-sm font-medium ring-0 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            onClick={handleAddTabs}
          >
            <MdAdd />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TableTabs;
