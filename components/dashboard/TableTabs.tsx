import { MdClose, MdAdd } from "react-icons/md";

const TableTabs = ({ tabs = [], activeTab = null, setActiveTab, handleAddTabs, deleteTab }) => {
    return (
        <div className="flex justify-between items-center h-12 mb-2">
            <ul className="flex justify-start items-center space-x-1 gap-1">
                {tabs.map((tab, idx) => (
                    <li key={idx} className="relative">
                        <button
                            className={`inline-flex text-black items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none ring-0 disabled:opacity-50 disabled:pointer-events-none border border-input py-2 px-4 h-9 pl-3 pr-7 font-semibold${activeTab === tab.id ? ' bg-[#570DF8] text-white' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.tableName}
                        </button>
                        <button
                            className={`inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none ring-0 disabled:pointer-events-none absolute right-2 top-2.5 ml-3 h-4 w-4 rounded-full p-0 ${activeTab === tab.id ? 'text-white' : ''}`}
                            onClick={() => deleteTab(idx)}
                        >
                            <MdClose />
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none ring-0 disabled:opacity-50 disabled:pointer-events-none border border-input h-9 w-9 p-0"
                        onClick={handleAddTabs}><MdAdd /></button>
                </li>
            </ul>
        </div>
    )
}

export default TableTabs;