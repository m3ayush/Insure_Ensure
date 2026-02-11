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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {entries.map(([key, value]) => (
          <div key={key}>
            <span className="text-xs text-gray-500 uppercase tracking-wide">{formatLabel(key)}</span>
            <p className="text-sm font-medium text-gray-900">{formatValue(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StepSummary({ commonData, selectedCategory, categoryData, onBack, onSubmit, submitting, error }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Review & Submit</h2>
      <p className="text-gray-500 mb-6 text-sm">Review your details before submitting.</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <DataSection title="Personal Details" data={commonData} />
      <DataSection title={getCategoryLabel(selectedCategory)} data={categoryData} />

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
        >
          Edit Details
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
