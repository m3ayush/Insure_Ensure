const TABS = [
  {
    id: "general",
    label: "General Chat",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "document",
    label: "Document Scanner",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function TabSwitcher({ activeTab, onTabChange }) {
  return (
    <div className="flex-shrink-0 flex justify-center mb-4">
      <div className="inline-flex bg-[#e8e4d9] dark:bg-black p-1.5 rounded-full border border-[#111] dark:border-[#333] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-[2px_2px_0px_0px_rgba(246,202,125,0.3)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-full cursor-pointer ${
              activeTab === tab.id
                ? "bg-white dark:bg-[#111] text-black dark:text-[#f6ca7d] border border-[#111] dark:border-[#333] shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-[#222]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
