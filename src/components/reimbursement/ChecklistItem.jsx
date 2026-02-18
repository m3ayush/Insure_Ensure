import { useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ChecklistItem({ doc, isUploaded, isUploading, onUpload }) {
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    if (!ACCEPTED_TYPES.includes(file.type)) return;
    if (file.size > MAX_SIZE) return;

    onUpload(doc.id, file);
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 transition-all duration-300 ${
        isUploaded
          ? "border-l-green-500 bg-green-50/50 border border-l-4 border-green-200"
          : "border-l-gray-300 bg-white border border-l-4 border-gray-200"
      }`}
    >
      {/* Status icon */}
      <div className="flex-shrink-0">
        {isUploaded ? (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isUploaded ? "text-green-800 font-medium" : "text-gray-700"}`}>
          {doc.label}
        </p>
        <p className="text-[11px] text-gray-400 capitalize">{doc.category}</p>
      </div>

      {/* Upload button or status */}
      {isUploaded ? (
        <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-100 rounded-full flex-shrink-0">
          Uploaded
        </span>
      ) : isUploading ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg className="w-4 h-4 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-indigo-600">Uploading...</span>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex-shrink-0"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
}
