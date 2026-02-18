import { useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

const CATEGORY_WEIGHTS = { mandatory: 50, financial: 30, supporting: 20 };

export default function MissingDocsList({ missingDocIds, checklist, onUploadDoc, uploadingDocId }) {
  if (!missingDocIds || missingDocIds.length === 0) return null;

  // Build missing docs with impact estimates
  const missingDocs = missingDocIds
    .map((id) => {
      const doc = checklist.find((d) => d.id === id);
      if (!doc) return null;
      const categoryDocs = checklist.filter((d) => d.category === doc.category);
      const impact = Math.round(CATEGORY_WEIGHTS[doc.category] / categoryDocs.length);
      return { ...doc, impact };
    })
    .filter(Boolean)
    .sort((a, b) => b.impact - a.impact);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Missing Documents
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Upload these to improve your claim probability. Sorted by impact on your score.
      </p>

      <div className="space-y-3">
        {missingDocs.map((doc) => (
          <MissingDocCard
            key={doc.id}
            doc={doc}
            isUploading={uploadingDocId === doc.id}
            onUpload={onUploadDoc}
          />
        ))}
      </div>
    </div>
  );
}

function MissingDocCard({ doc, isUploading, onUpload }) {
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE) return;
    onUpload(doc.id, file);
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50/50 border border-red-100">
      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{doc.label}</p>
        <p className="text-xs text-indigo-600 font-medium">
          +~{doc.impact}% to your score
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg className="w-4 h-4 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition cursor-pointer flex-shrink-0"
        >
          Upload
        </button>
      )}
    </div>
  );
}
