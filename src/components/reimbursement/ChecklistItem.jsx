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
      className={`flex items-center gap-3 px-4 py-3 rounded-[1rem] border-l-4 transition-all duration-300 shadow-sm ${
        isUploaded
          ? "border-l-green-600 dark:border-l-green-400 bg-green-50 dark:bg-green-900/10 border border-t-[#111] border-r-[#111] border-b-[#111] dark:border-t-[#333] dark:border-r-[#333] dark:border-b-[#333]"
          : "border-l-[#111] dark:border-l-[#333] bg-white dark:bg-[#1a1a1a] border border-[#111] dark:border-[#333]"
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
        <p className={`text-sm tracking-tight ${isUploaded ? "text-green-800 dark:text-green-400 font-black" : "text-black dark:text-white font-bold"}`}>
          {doc.label}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize font-bold">{doc.category}</p>
      </div>

      {/* Upload button or status */}
      {isUploaded ? (
        <span className="text-[10px] font-bold text-green-700 dark:text-green-300 px-2 py-1 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-full flex-shrink-0 uppercase">
          Uploaded
        </span>
      ) : isUploading ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg className="w-4 h-4 text-black dark:text-[#f6ca7d] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs font-bold text-black dark:text-[#f6ca7d]">Uploading...</span>
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
            className="text-[11px] font-bold text-black dark:text-black uppercase px-3 py-1.5 rounded-full bg-white dark:bg-[#f6ca7d] border border-[#111] hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713] dark:hover:text-white transition cursor-pointer flex-shrink-0"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
}
