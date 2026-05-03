import { useState } from "react";
import { CATEGORY_GROUPS } from "../../data/insuranceCategories";
import CategoryCard from "./CategoryCard";

export default function StepCategorySelection({ onSelectCategory, onBack }) {
  const [search, setSearch] = useState("");

  const filteredGroups = CATEGORY_GROUPS.map((group) => ({
    ...group,
    categories: group.categories.filter(
      (c) =>
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.categories.length > 0);

  return (
    <div>
      <h2 className="text-2xl font-black text-black dark:text-white mb-1 tracking-tight">Choose Insurance Category</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm font-bold">Select the type of insurance you're looking for.</p>

      {/* Search bar */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search insurance categories..."
          className="w-full pl-10 pr-5 py-3.5 bg-white dark:bg-black/10 border border-[#111] dark:border-black/20 rounded-[1.5rem] focus:ring-2 focus:ring-black dark:focus:ring-black outline-none transition font-medium text-black dark:text-white placeholder-gray-500"
        />
      </div>

      {/* Category groups */}
      {filteredGroups.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No categories match your search.</p>
      ) : (
        filteredGroups.map((group) => (
          <div key={group.groupName} className="mb-6">
            <h3 className="text-lg font-black text-black dark:text-[#f6ca7d] mb-3 tracking-tight">
              {group.groupName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.categories.map((cat) => (
                <CategoryCard
                  key={cat.key}
                  label={cat.label}
                  description={cat.description}
                  onClick={() => onSelectCategory(cat.key)}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-8 flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white dark:bg-[#111] border border-[#111] dark:border-[#333] rounded-full font-bold text-black dark:text-white hover:bg-[#f0eeb4] dark:hover:bg-[#222] transition cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
