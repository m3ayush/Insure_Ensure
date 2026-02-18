export default function ActionableFeedback({ score, missingDocIds, extractedData }) {
  if (score === null || score === undefined) return null;

  const hasSealIssue = extractedData && !extractedData.has_hospital_seal;
  const hasSignatureIssue = extractedData && !extractedData.has_doctor_signature;
  const missingCount = missingDocIds?.length || 0;

  let tier, bgClass, borderClass, iconColor, title, description;

  if (score >= 76) {
    tier = "green";
    bgClass = "bg-green-50";
    borderClass = "border-green-200";
    iconColor = "text-green-600";
    title = "Strong Chance of Approval";
    description = missingCount > 0
      ? `Your claim looks strong! Consider uploading the remaining ${missingCount} document${missingCount > 1 ? "s" : ""} to maximize your score.`
      : "All required documents are uploaded. Your claim is ready for submission!";
  } else if (score >= 41) {
    tier = "yellow";
    bgClass = "bg-yellow-50";
    borderClass = "border-yellow-200";
    iconColor = "text-yellow-600";
    title = "Action Required";
    description = `Your claim needs more documentation. ${missingCount} document${missingCount > 1 ? "s are" : " is"} still missing. Focus on mandatory and financial documents first.`;
  } else {
    tier = "red";
    bgClass = "bg-red-50";
    borderClass = "border-red-200";
    iconColor = "text-red-600";
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
    <div className={`rounded-xl border ${borderClass} ${bgClass} p-6`}>
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
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="mt-3 pl-9">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tips</p>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">&#8226;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
