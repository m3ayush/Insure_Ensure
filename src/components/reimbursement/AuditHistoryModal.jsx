import { useState, useEffect } from "react";
import { fetchAuditHistory } from "../../utils/reimbursementApi";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreBadge(score) {
  if (score >= 76) return "bg-green-100 text-green-700";
  if (score >= 41) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function AuditHistoryModal({ uid, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchAuditHistory(uid)
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
          <h2 className="text-lg font-bold text-gray-800">Past Audits</h2>
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
            <p className="text-gray-500 text-sm text-center py-8">No past audits found.</p>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-3">
              {history.map((audit) => (
                <div
                  key={audit._id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {audit.extracted_data?.insurer_name || "Unknown Insurer"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(audit.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {audit.extracted_data?.hospital_name && (
                        <span>{audit.extracted_data.hospital_name}</span>
                      )}
                      {audit.extracted_data?.bill_amount > 0 && (
                        <span className="ml-2">
                          ₹{Number(audit.extracted_data.bill_amount).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadge(audit.score)}`}>
                      {audit.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{audit.uploaded_docs?.length || 0} docs uploaded</span>
                    <span>&#8226;</span>
                    <span>{audit.missing_docs?.length || 0} missing</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
