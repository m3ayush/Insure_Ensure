import { useState, useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function PrimaryUploadSection({ onFileSelect, isProcessing, uploadedFileName, onStartOver }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Only JPG, PNG, and PDF files are allowed";
    if (file.size > MAX_SIZE) return "File size must be under 5MB";
    return null;
  }

  function handleFile(file) {
    const err = validateFile(file);
    if (err) { setError(err); return; }
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

  // Compact bar after upload
  if (uploadedFileName) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Primary Document Uploaded</p>
              <p className="text-xs text-gray-500 truncate max-w-xs">{uploadedFileName}</p>
            </div>
          </div>
          <button
            onClick={onStartOver}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Upload Discharge Summary</h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload your hospital discharge summary to begin the claim audit. We'll identify your insurer and check document completeness.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer ${
          isProcessing
            ? "border-indigo-300 bg-indigo-50/50 cursor-wait"
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

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-700">Scanning document...</p>
              <p className="text-xs text-indigo-500 mt-1">Extracting insurer details via AI</p>
            </div>
          </div>
        ) : (
          <>
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              Drag & drop your discharge summary here
            </p>
            <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-3">Supports JPG, PNG, or PDF up to 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
