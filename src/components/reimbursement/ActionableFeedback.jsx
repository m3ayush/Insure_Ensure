export default function ActionableFeedback({ score, missingDocIds, extractedData }) {
  if (score === null || score === undefined) return null;

  const hasSealIssue = extractedData && !extractedData.has_hospital_seal;
  const hasSignatureIssue = extractedData && !extractedData.has_doctor_signature;
  const missingCount = missingDocIds?.length || 0;

  let tier, bgClass, borderClass, iconColor, title, description;

  if (score >= 76) {
    tier = "green";
    bgClass = "bg-[#f0eeb4] dark:bg-green-900/10";
    borderClass = "border-[#111] dark:border-green-800";
    iconColor = "text-green-700 dark:text-green-500";
    title = "Strong Chance of Approval";
    description = missingCount > 0
      ? `Your claim looks strong! Consider uploading the remaining ${missingCount} document${missingCount > 1 ? "s" : ""} to maximize your score.`
      : "All required documents are uploaded. Your claim is ready for submission!";
  } else if (score >= 41) {
    tier = "yellow";
    bgClass = "bg-[#f6ca7d] dark:bg-yellow-900/10";
    borderClass = "border-[#111] dark:border-yellow-800";
    iconColor = "text-yellow-800 dark:text-yellow-500";
    title = "Action Required";
    description = `Your claim needs more documentation. ${missingCount} document${missingCount > 1 ? "s are" : " is"} still missing. Focus on mandatory and financial documents first.`;
  } else {
    tier = "red";
    bgClass = "bg-[#ff4713] dark:bg-red-900/10";
    borderClass = "border-[#111] dark:border-red-800";
    iconColor = "text-white dark:text-red-500";
    title = "High Risk of Rejection";
    description = `Critical documents are missing. India's claim rejection rate is high due to incomplete paperwork. Upload ${missingCount} remaining document${missingCount > 1 ? "s" : ""} to improve your chances.`;
  }

  const tips = [];
  if (hasSealIssue) {
    tips.push("Ensure your main hospital bill has a visible hospital seal/stamp to avoid a 15% penalty.");
  }
  if (hasSignatureIssue) {
    tips.push("Your discharge summary should have a doctor's signature to avoid a 20% penalty.");
  }
  if (tier !== "green" && missingCount > 0) {
    tips.push("Upload mandatory documents (Discharge Summary, Claim Form) first — they carry the most weight.");
  }

  return (
    <div className={`rounded-[1.5rem] border ${borderClass} ${bgClass} p-6 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-none transition-all duration-300`}>
      <div className="flex items-start gap-3 mb-3">
        {tier === "green" ? (
          <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : tier === "yellow" ? (
          <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <div>
          <h3 className={`text-sm font-black ${tier === 'red' ? 'text-white' : 'text-black'} dark:text-white tracking-tight`}>{title}</h3>
          <p className={`text-sm font-bold ${tier === 'red' ? 'text-white/90' : 'text-gray-800'} dark:text-gray-400 mt-1`}>{description}</p>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="mt-3 pl-9">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tips</p>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className={`text-xs font-bold flex items-start gap-2 ${tier === 'red' ? 'text-white/90' : 'text-gray-800'} dark:text-gray-400`}>
                <span className={`${tier === 'red' ? 'text-white' : 'text-black'} dark:text-[#f6ca7d] mt-0.5`}>&#8226;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
