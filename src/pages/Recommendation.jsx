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
        firebase_uid: currentUser.uid,
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className={`mx-auto px-4 py-10 sm:px-6 lg:px-8 ${currentStep === 5 ? "max-w-4xl" : "max-w-3xl"}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>
        <ProgressBar currentStep={currentStep} />

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

      {showHistory && (
        <HistoryModal
          uid={currentUser.uid}
          onClose={() => setShowHistory(false)}
          onViewResults={handleViewHistory}
        />
      )}
    </div>
  );
}
