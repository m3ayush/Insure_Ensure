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
    <div className="bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] p-6 transition-all duration-300">
      <h3 className="text-lg font-black text-black dark:text-white mb-4 flex items-center gap-2 tracking-tight">
        <svg className="w-5 h-5 text-black dark:text-[#f6ca7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                <h4 className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {CATEGORY_LABELS[cat]}
                </h4>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    uploadedCount === docs.length
                      ? "bg-[#f0eeb4] text-black border-[#111] dark:bg-[#f6ca7d] dark:text-black dark:border-[#f6ca7d]"
                      : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-[#222] dark:text-gray-400 dark:border-gray-700"
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
