import ChecklistItem from "./ChecklistItem";

const CATEGORY_LABELS = {
  mandatory: "Mandatory Documents",
  financial: "Financial Documents",
  supporting: "Supporting Documents",
};

const CATEGORY_ORDER = ["mandatory", "financial", "supporting"];

export default function DocumentChecklist({ checklist, uploadedDocs, onUploadDoc, uploadingDocId }) {
  if (!checklist || checklist.length === 0) return null;

  const groups = {};
  for (const doc of checklist) {
    if (!groups[doc.category]) groups[doc.category] = [];
    groups[doc.category].push(doc);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Document Checklist
      </h3>

      <div className="space-y-5">
        {CATEGORY_ORDER.map((cat) => {
          const docs = groups[cat];
          if (!docs || docs.length === 0) return null;

          const uploadedCount = docs.filter((d) => uploadedDocs.has(d.id)).length;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {CATEGORY_LABELS[cat]}
                </h4>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    uploadedCount === docs.length
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {uploadedCount}/{docs.length}
                </span>
              </div>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <ChecklistItem
                    key={doc.id}
                    doc={doc}
                    isUploaded={uploadedDocs.has(doc.id)}
                    isUploading={uploadingDocId === doc.id}
                    onUpload={onUploadDoc}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
