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
      <div className="bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] p-5 transition-all duration-300">
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
            className="text-sm font-bold text-black dark:text-black bg-white dark:bg-[#f6ca7d] border border-[#111] px-5 py-2.5 rounded-full hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713] dark:hover:text-white transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] p-6 sm:p-8 transition-all duration-300">
      <h2 className="text-xl font-black text-black dark:text-white mb-2 tracking-tight">Upload Discharge Summary</h2>
      <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6">
        Upload your hospital discharge summary to begin the claim audit. We'll identify your insurer and check document completeness.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[1.5rem] p-10 text-center transition cursor-pointer ${
          isProcessing
            ? "border-[#111] dark:border-[#f6ca7d] bg-[#f0eeb4]/20 dark:bg-[#f6ca7d]/10 cursor-wait"
            : isDragging
              ? "border-black dark:border-[#ff4713] bg-[#e8e4d9]/50 dark:bg-black"
              : "border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-[#222]"
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
              <div className="w-14 h-14 rounded-full border-4 border-black dark:border-[#f6ca7d] flex items-center justify-center">
                <svg className="w-7 h-7 text-black dark:text-[#f6ca7d] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-[#f6ca7d] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black dark:bg-[#ff4713]" />
              </span>
            </div>
            <div>
              <p className="text-sm font-black text-black dark:text-white">Scanning document...</p>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-1">Extracting insurer details via AI</p>
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
