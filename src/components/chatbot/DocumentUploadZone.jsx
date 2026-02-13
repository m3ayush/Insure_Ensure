import { useState, useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocumentUploadZone({ onFileSelect, isUploading, uploadedFileName, onRemoveDocument }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, and PDF files are allowed";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be under 5MB";
    }
    return null;
  }

  function handleFile(file) {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onFileSelect(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  // Compact bar when document is already uploaded
  if (uploadedFileName) {
    return (
      <div className="flex-shrink-0 mx-4 mt-3 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-green-800 truncate flex-1">{uploadedFileName}</span>
        <button
          onClick={onRemoveDocument}
          className="text-xs text-green-700 hover:text-green-900 font-medium px-2 py-1 rounded hover:bg-green-100 transition cursor-pointer"
        >
          Replace
        </button>
      </div>
    );
  }

  // Full upload zone
  return (
    <div className="flex-shrink-0 mx-4 mt-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
          isUploading
            ? "border-gray-300 bg-gray-50 cursor-wait"
            : isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-gray-600">Processing document...</p>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-700 font-medium">
              Drag & drop your insurance document here
            </p>
            <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, or PDF up to 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
