const STEPS = [
  { id: "scanned", label: "Document Scanned" },
  { id: "insurer", label: "Insurer Identified" },
  { id: "gap", label: "Gap Analysis Complete" },
  { id: "complete", label: "Audit Complete" },
];

const PHASE_TO_STEP = {
  initial: -1,
  uploading: 0,
  extracting: 1,
  checklist: 2,
  complete: 3,
};

export default function AuditTimeline({ currentPhase }) {
  const activeIndex = PHASE_TO_STEP[currentPhase] ?? -1;

  return (
    <>
      {/* Desktop: vertical timeline */}
      <div className="hidden md:block">
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const isCompleted = i <= activeIndex;
            const isCurrent = i === activeIndex;
            const isLast = i === STEPS.length - 1;

            return (
              <div key={step.id} className="flex items-start gap-3">
                {/* Circle + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                      isCompleted
                        ? "bg-black border-black text-white dark:bg-[#f6ca7d] dark:border-[#f6ca7d] dark:text-black"
                        : "bg-white border-[#111] text-gray-500 dark:bg-[#111] dark:border-[#333] dark:text-gray-400"
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-10 transition-colors duration-500 ${
                        i < activeIndex ? "bg-black dark:bg-[#f6ca7d]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="pt-1">
                  <p
                    className={`text-sm font-bold transition-colors duration-300 ${
                      isCompleted ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-[#f6ca7d] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-[#ff4713]" />
                      </span>
                      <span className="text-xs font-bold text-black dark:text-[#f6ca7d]">In progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: horizontal stepper */}
      <div className="md:hidden flex items-center justify-between gap-1 px-2">
        {STEPS.map((step, i) => {
          const isCompleted = i <= activeIndex;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-black border-black text-white dark:bg-[#f6ca7d] dark:border-[#f6ca7d] dark:text-black"
                    : "bg-white border-[#111] text-gray-500 dark:bg-[#111] dark:border-[#333] dark:text-gray-400"
                }`}
              >
                {isCompleted && i < activeIndex ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-colors duration-500 ${
                    i < activeIndex ? "bg-black dark:bg-[#f6ca7d]" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
