import { useState, useEffect } from "react";
import { getCategoryLabel } from "../../data/insuranceCategories";
import { fetchRecommendationHistory } from "../../utils/api";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryModal({ uid, onClose, onViewResults }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchRecommendationHistory(uid)
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [uid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Past Recommendations</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center py-8">{error}</p>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No past recommendations found.</p>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-3">
              {history.map((rec) => {
                const topPlan = rec.recommendations?.[0];
                return (
                  <button
                    key={rec._id}
                    onClick={() => onViewResults(rec)}
                    className="w-full text-left bg-gray-50 hover:bg-indigo-50 rounded-lg p-4 transition cursor-pointer border border-gray-200 hover:border-indigo-300"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {getCategoryLabel(rec.selected_category)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(rec.createdAt)}
                      </span>
                    </div>
                    {topPlan ? (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Top: {topPlan.plan_name} ({topPlan.insurer_name})
                        </p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          topPlan.score >= 80
                            ? "bg-green-100 text-green-700"
                            : topPlan.score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {topPlan.score}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No results</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
