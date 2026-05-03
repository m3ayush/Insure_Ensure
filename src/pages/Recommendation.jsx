import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { submitRecommendation } from "../utils/api";
import ProgressBar from "../components/recommendation/ProgressBar";
import StepCommonDetails from "../components/recommendation/StepCommonDetails";
import StepCategorySelection from "../components/recommendation/StepCategorySelection";
import StepCategoryQuestions from "../components/recommendation/StepCategoryQuestions";
import StepSummary from "../components/recommendation/StepSummary";
import ResultsView from "../components/recommendation/ResultsView";
import HistoryModal from "../components/recommendation/HistoryModal";

export default function Recommendation() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [commonData, setCommonData] = useState({
    full_name: currentUser?.displayName || "",
    dob: "",
    gender: "",
    pincode: "",
    mobile: "",
    email: currentUser?.email || "",
    annual_income: "",
    employment_status: "",
    marital_status: "",
    number_of_dependents: "0",
    existing_policies: "None",
    city: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleSelectCategory = (key) => {
    setSelectedCategory(key);
    setCategoryData({});
    setCurrentStep(3);
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setCategoryData({});
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const response = await submitRecommendation({
        common_user_data: {
          ...commonData,
          annual_income: Number(commonData.annual_income),
          number_of_dependents: Number(commonData.number_of_dependents),
        },
        selected_category: selectedCategory,
        category_data: categoryData,
      });
      setResults(response.recommendations);
      setCurrentStep(5);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleViewHistory = (rec) => {
    setShowHistory(false);
    setSelectedCategory(rec.selected_category);
    setResults(rec.recommendations);
    setCurrentStep(5);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setCategoryData({});
    setResults(null);
    setError("");
    setCommonData({
      full_name: currentUser?.displayName || "",
      dob: "",
      gender: "",
      pincode: "",
      mobile: "",
      email: currentUser?.email || "",
      annual_income: "",
      employment_status: "",
      marital_status: "",
      number_of_dependents: "0",
      existing_policies: "None",
      city: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e4d9] dark:bg-black transition-colors duration-300">
      <Navbar />
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 flex-grow max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Main Content Box (Left) */}
          <div className="flex-1 w-full bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-6 sm:p-10 transition-all duration-300">
            {currentStep === 1 && (
              <StepCommonDetails
                commonData={commonData}
                setCommonData={setCommonData}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <StepCategorySelection
                onSelectCategory={handleSelectCategory}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <StepCategoryQuestions
                selectedCategory={selectedCategory}
                categoryData={categoryData}
                setCategoryData={setCategoryData}
                onNext={() => setCurrentStep(4)}
                onBack={handleBackFromCategory}
              />
            )}

            {currentStep === 4 && (
              <StepSummary
                commonData={commonData}
                selectedCategory={selectedCategory}
                categoryData={categoryData}
                onBack={() => setCurrentStep(3)}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
              />
            )}

            {currentStep === 5 && results && (
              <ResultsView
                results={results}
                selectedCategory={selectedCategory}
                onStartOver={handleStartOver}
              />
            )}
          </div>

          {/* Sidebar Box (Right) */}
          {currentStep < 5 && (
            <div className="w-full md:w-80 bg-[#e8e4d9] dark:bg-[#1a1a1a] border border-[#111] dark:border-[#333] rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,71,19,0.3)] p-6 sm:p-8 transition-all duration-300 md:sticky md:top-32 flex-shrink-0">
              <div className="flex justify-between items-center mb-8 border-b border-[#111] dark:border-[#333] pb-4">
                <h3 className="text-lg font-black text-black dark:text-white tracking-tight">Progress</h3>
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#f6ca7d] text-black dark:text-black border border-[#111] rounded-full text-xs font-bold hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713] dark:hover:text-white transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </button>
              </div>
              <ProgressBar currentStep={currentStep} />
            </div>
          )}
        </div>
      </div>

      {showHistory && (
        <HistoryModal
          onClose={() => setShowHistory(false)}
          onViewResults={handleViewHistory}
        />
      )}
    </div>
  );
}
