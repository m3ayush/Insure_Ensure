import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AuditTimeline from "../components/reimbursement/AuditTimeline";
import PrimaryUploadSection from "../components/reimbursement/PrimaryUploadSection";
import ExtractionResults from "../components/reimbursement/ExtractionResults";
import InsurerSelector from "../components/reimbursement/InsurerSelector";
import ProbabilityGauge from "../components/reimbursement/ProbabilityGauge";
import DocumentChecklist from "../components/reimbursement/DocumentChecklist";
import MissingDocsList from "../components/reimbursement/MissingDocsList";
import ActionableFeedback from "../components/reimbursement/ActionableFeedback";
import AuditHistoryModal from "../components/reimbursement/AuditHistoryModal";
import {
  uploadPrimaryDocument,
  selectInsurer as selectInsurerApi,
  uploadChecklistDoc,
} from "../utils/reimbursementApi";

export default function Reimbursement() {
  const { currentUser } = useAuth();

  // Audit state
  const [auditPhase, setAuditPhase] = useState("initial");
  const [sessionId, setSessionId] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [insurer, setInsurer] = useState(null);
  const [availableInsurers, setAvailableInsurers] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState(new Set());
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({});
  const [missingDocs, setMissingDocs] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [selectingInsurer, setSelectingInsurer] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // ── Handlers ──────────────────────────────────────────────

  async function handlePrimaryUpload(file) {
    setError("");
    setAuditPhase("uploading");

    try {
      const result = await uploadPrimaryDocument(file);

      setSessionId(result.sessionId);
      setExtractedData(result.extractedData);
      setUploadedFileName(result.fileName);
      setScore(result.score);
      setScoreBreakdown(result.scoreBreakdown);
      setMissingDocs(result.missing);
      setUploadedDocs(new Set(["discharge_summary"]));

      if (result.insurer) {
        setInsurer(result.insurer);
        setChecklist(result.insurer.mandatory_docs);
        setAuditPhase("checklist");
      } else {
        setAvailableInsurers(result.insurers);
        setAuditPhase("extracting");
      }
    } catch (err) {
      setError(err.message);
      setAuditPhase("initial");
    }
  }

  async function handleInsurerSelect(insurerKey) {
    setSelectingInsurer(true);
    setError("");

    try {
      const result = await selectInsurerApi(sessionId, insurerKey);

      setInsurer(result.insurer);
      setChecklist(result.insurer.mandatory_docs);
      setScore(result.score);
      setScoreBreakdown(result.scoreBreakdown);
      setMissingDocs(result.missing);
      setAvailableInsurers(null);
      setAuditPhase("checklist");
    } catch (err) {
      setError(err.message);
    } finally {
      setSelectingInsurer(false);
    }
  }

  async function handleChecklistUpload(docId, file) {
    setUploadingDocId(docId);
    setError("");

    try {
      const result = await uploadChecklistDoc(sessionId, docId, file);

      setUploadedDocs(new Set(result.uploadedDocIds));
      setScore(result.score);
      setScoreBreakdown(result.scoreBreakdown);
      setMissingDocs(result.missing);

      if (result.missing.length === 0) {
        setAuditPhase("complete");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingDocId(null);
    }
  }

  function handleStartOver() {
    setAuditPhase("initial");
    setSessionId(null);
    setExtractedData(null);
    setInsurer(null);
    setAvailableInsurers(null);
    setChecklist([]);
    setUploadedDocs(new Set());
    setScore(0);
    setScoreBreakdown({});
    setMissingDocs([]);
    setUploadedFileName("");
    setUploadingDocId(null);
    setError("");
  }

  const showResults = auditPhase === "extracting" || auditPhase === "checklist" || auditPhase === "complete";

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e4d9] dark:bg-black transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-6 sm:p-8 transition-all duration-300">
          <div>
            <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">Reimbursement Auditor</h1>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-1">
              AI-powered pre-submission audit for your insurance claim
            </p>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm font-bold text-black dark:text-black bg-white dark:bg-[#f6ca7d] border border-[#111] px-5 py-2.5 rounded-full hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713] dark:hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-8">
          {/* Timeline sidebar (desktop) / horizontal stepper (mobile) */}
          <div className="mb-6 md:mb-0">
            <div className="md:sticky md:top-24">
              <AuditTimeline currentPhase={auditPhase} />
            </div>
          </div>

          {/* Content area */}
          <div className="space-y-6">
            {/* Primary upload */}
            <PrimaryUploadSection
              onFileSelect={handlePrimaryUpload}
              isProcessing={auditPhase === "uploading"}
              uploadedFileName={showResults ? uploadedFileName : ""}
              onStartOver={handleStartOver}
            />

            {/* Extraction results */}
            {showResults && extractedData && (
              <ExtractionResults extractedData={extractedData} />
            )}

            {/* Insurer fallback selector */}
            {auditPhase === "extracting" && availableInsurers && (
              <InsurerSelector
                insurers={availableInsurers}
                onSelect={handleInsurerSelect}
                isLoading={selectingInsurer}
              />
            )}

            {/* Checklist + Gauge row */}
            {(auditPhase === "checklist" || auditPhase === "complete") && insurer && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6">
                  <DocumentChecklist
                    checklist={checklist}
                    uploadedDocs={uploadedDocs}
                    onUploadDoc={handleChecklistUpload}
                    uploadingDocId={uploadingDocId}
                  />

                  {missingDocs.length > 0 && (
                    <MissingDocsList
                      missingDocIds={missingDocs}
                      checklist={checklist}
                      onUploadDoc={handleChecklistUpload}
                      uploadingDocId={uploadingDocId}
                    />
                  )}
                </div>

                <div className="space-y-6">
                  <ProbabilityGauge score={score} breakdown={scoreBreakdown} />
                  <ActionableFeedback
                    score={score}
                    missingDocIds={missingDocs}
                    extractedData={extractedData}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History modal */}
      {showHistory && (
        <AuditHistoryModal
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
