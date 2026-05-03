const steps = ["Your Details", "Choose Category", "Category Details", "Review & Submit", "Results"];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-48 flex-shrink-0 relative">
      <div className="flex flex-col space-y-8 relative z-10">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={label} className="flex items-center gap-4 relative">
              {/* Vertical connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                    stepNum < currentStep ? "bg-black dark:bg-[#f6ca7d]" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )}
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 ${
                  isCompleted
                    ? "bg-black border-black text-white dark:bg-[#f6ca7d] dark:border-[#f6ca7d] dark:text-black"
                    : isCurrent
                    ? "bg-[#f0eeb4] border-[#111] text-black dark:bg-[#ff4713] dark:border-[#111] dark:text-white"
                    : "bg-white border-[#111] text-gray-500 dark:bg-[#111] dark:border-[#333] dark:text-gray-400"
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
                className={`text-sm font-bold ${
                  isCurrent ? "text-black dark:text-white" : isCompleted ? "text-gray-800 dark:text-[#f6ca7d]" : "text-gray-500 dark:text-gray-500"
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
