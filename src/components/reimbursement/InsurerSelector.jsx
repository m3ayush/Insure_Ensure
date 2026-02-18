export default function InsurerSelector({ insurers, onSelect, isLoading }) {
  if (!insurers || insurers.length === 0) return null;

  return (
    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">Could not detect insurer</h3>
          <p className="text-xs text-yellow-700 mt-0.5">
            We couldn't identify the insurance company from your document. Please select your insurer manually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insurers.map((ins) => (
          <button
            key={ins.key}
            onClick={() => onSelect(ins.key)}
            disabled={isLoading}
            className="bg-white border border-yellow-200 rounded-lg px-4 py-3 text-left hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          >
            <p className="text-sm font-medium text-gray-900">{ins.display_name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
