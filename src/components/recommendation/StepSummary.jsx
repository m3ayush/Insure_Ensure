import { getCategoryLabel } from "../../data/insuranceCategories";

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  if (value === "" || value === null || value === undefined) return "—";
  return String(value);
}

function formatLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function DataSection({ title, data }) {
  const entries = Object.entries(data).filter(
    ([, v]) => v !== "" && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)
  );

  return (
    <div className="bg-white dark:bg-black border border-[#111] dark:border-[#333] rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] p-6 mb-6 transition-all duration-300">
      <h3 className="text-xl font-black text-black dark:text-white mb-4 border-b border-[#111] dark:border-[#333] pb-2 tracking-tight">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {entries.map(([key, value]) => (
          <div key={key}>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">{formatLabel(key)}</span>
            <p className="text-sm font-black text-black dark:text-[#f6ca7d]">{formatValue(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StepSummary({ commonData, selectedCategory, categoryData, onBack, onSubmit, submitting, error }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-black dark:text-white mb-1 tracking-tight">Review & Submit</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm font-bold">Review your details before submitting.</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <DataSection title="Personal Details" data={commonData} />
      <DataSection title={getCategoryLabel(selectedCategory)} data={categoryData} />

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-2.5 bg-white dark:bg-[#111] border border-[#111] dark:border-[#333] rounded-full font-bold text-black dark:text-white hover:bg-[#f0eeb4] dark:hover:bg-[#222] transition cursor-pointer disabled:opacity-50"
        >
          Edit Details
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-black dark:bg-[#f6ca7d] text-white dark:text-black px-8 py-2.5 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-white transition cursor-pointer disabled:opacity-50 flex items-center gap-2 border border-transparent dark:border-[#111]"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Finding Best Plans...
            </>
          ) : (
            "Get Recommendations"
          )}
        </button>
      </div>
    </div>
  );
}
