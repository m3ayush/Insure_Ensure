const steps = ["Your Details", "Choose Category", "Category Details", "Review & Submit", "Results"];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={label} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                    stepNum <= currentStep ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  isCompleted
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : isCurrent
                    ? "bg-white border-indigo-600 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {/* Label */}
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  isCurrent ? "text-indigo-700" : isCompleted ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
