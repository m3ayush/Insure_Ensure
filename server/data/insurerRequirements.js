export const INSURER_REQUIREMENTS = {
  star_health: {
    display_name: "Star Health",
    aliases: ["star health", "star health insurance", "star health and allied"],
    mandatory_docs: [
      { id: "claim_form", label: "Duly filled and signed Claim Form", category: "mandatory" },
      { id: "discharge_summary", label: "Hospital Discharge Summary (Original)", category: "mandatory" },
      { id: "final_bill", label: "Final Hospital Bill (Original)", category: "financial" },
      { id: "payment_receipts", label: "Payment Receipts with break-up", category: "financial" },
      { id: "pharmacy_bills", label: "Pharmacy Bills with Prescriptions", category: "financial" },
      { id: "investigation_reports", label: "Investigation/Lab Reports (ECG/X-Ray/etc.)", category: "supporting" },
      { id: "cancelled_cheque", label: "Cancelled Cheque with name printed", category: "supporting" },
    ],
  },
  hdfc_ergo: {
    display_name: "HDFC Ergo",
    aliases: ["hdfc ergo", "hdfc ergo health", "hdfc ergo general"],
    mandatory_docs: [
      { id: "claim_form", label: "Claim Form (Signed & Stamped)", category: "mandatory" },
      { id: "discharge_summary", label: "Original Discharge Card/Day Care Summary", category: "mandatory" },
      { id: "final_bill", label: "Final Hospital Bill with break-up", category: "financial" },
      { id: "payment_receipts", label: "Original Payment Receipts", category: "financial" },
      { id: "consultation_papers", label: "Doctor's Consultation Papers/Prescriptions", category: "supporting" },
      { id: "diagnostic_reports", label: "All original Diagnostic Reports", category: "supporting" },
      { id: "kyc_docs", label: "KYC Documents (if claim > 1 Lakh)", category: "supporting" },
    ],
  },
  icici_lombard: {
    display_name: "ICICI Lombard",
    aliases: ["icici lombard", "icici lombard general", "icici lombard health"],
    mandatory_docs: [
      { id: "claim_form", label: "Claim Form signed by Insured & Doctor", category: "mandatory" },
      { id: "discharge_summary", label: "Original Discharge Summary", category: "mandatory" },
      { id: "final_bill", label: "Final Hospital Bill with detailed break-up", category: "financial" },
      { id: "payment_receipts", label: "Payment Receipts", category: "financial" },
      { id: "investigation_reports", label: "All Investigation Reports (Original)", category: "supporting" },
      { id: "pharmacy_bills", label: "Pharmacy Bills supported by Prescriptions", category: "supporting" },
      { id: "indoor_case_papers", label: "Indoor Case Papers (if requested)", category: "supporting" },
    ],
  },
  niva_bupa: {
    display_name: "Niva Bupa",
    aliases: ["niva bupa", "niva bupa health", "max bupa"],
    mandatory_docs: [
      { id: "discharge_summary", label: "Original Discharge Summary", category: "mandatory" },
      { id: "claim_form", label: "Duly filled Claim Form", category: "mandatory" },
      { id: "final_bill", label: "Final Hospital Bill & Payment Receipts", category: "financial" },
      { id: "prescriptions", label: "Doctor's Prescriptions", category: "financial" },
      { id: "investigation_reports", label: "Investigation & Lab Reports", category: "supporting" },
      { id: "kyc_docs", label: "KYC (PAN/Aadhar if > 1 Lakh)", category: "supporting" },
      { id: "cancelled_cheque", label: "Cancelled Cheque or Bank Passbook copy", category: "supporting" },
    ],
  },
  care_health: {
    display_name: "Care Health",
    aliases: ["care health", "care health insurance", "religare health"],
    mandatory_docs: [
      { id: "claim_form", label: "Claim Form (Accurately Filled)", category: "mandatory" },
      { id: "discharge_summary", label: "Original Discharge Summary", category: "mandatory" },
      { id: "final_bill", label: "Original Hospital Bills & Receipts", category: "financial" },
      { id: "consultation_papers", label: "Doctor's Consultation/Prescription Papers", category: "financial" },
      { id: "investigation_reports", label: "Original Investigation Reports", category: "supporting" },
      { id: "pharmacy_bills", label: "Pharmacy/Medicine Bills", category: "supporting" },
      { id: "mlc_fir", label: "MLC/FIR (in case of Accidents)", category: "supporting" },
    ],
  },
};

export const GLOBAL_CHECKS = {
  hospital_seal: { label: "Hospital Seal / Stamp on main bill", penalty: -15 },
  doctor_signature: { label: "Doctor Signature on Discharge Summary", penalty: -20 },
};

export const CATEGORY_WEIGHTS = {
  mandatory: 0.50,
  financial: 0.30,
  supporting: 0.20,
};

export function findInsurer(extractedName) {
  if (!extractedName) return null;
  const normalized = extractedName.toLowerCase().trim();
  for (const [key, insurer] of Object.entries(INSURER_REQUIREMENTS)) {
    if (insurer.aliases.some((alias) => normalized.includes(alias))) {
      return { key, ...insurer };
    }
  }
  return null;
}

export function calculateScore(insurerKey, uploadedDocIds, extractedData = {}) {
  const insurer = INSURER_REQUIREMENTS[insurerKey];
  if (!insurer) return { score: 0, breakdown: {}, missing: [] };

  const docs = insurer.mandatory_docs;
  const uploaded = new Set(uploadedDocIds);

  const groups = { mandatory: [], financial: [], supporting: [] };
  for (const doc of docs) {
    groups[doc.category].push(doc);
  }

  let totalScore = 0;
  const breakdown = {};
  const missing = [];

  for (const [cat, catDocs] of Object.entries(groups)) {
    const catUploaded = catDocs.filter((d) => uploaded.has(d.id));
    const catScore =
      catDocs.length > 0
        ? (catUploaded.length / catDocs.length) * CATEGORY_WEIGHTS[cat] * 100
        : 0;
    breakdown[`${cat}_score`] = Math.round(catScore * 10) / 10;
    totalScore += catScore;

    for (const d of catDocs) {
      if (!uploaded.has(d.id)) missing.push(d.id);
    }
  }

  let sealPenalty = 0;
  let signaturePenalty = 0;

  if (!extractedData.has_hospital_seal) {
    sealPenalty = GLOBAL_CHECKS.hospital_seal.penalty;
    totalScore += sealPenalty;
  }
  if (!extractedData.has_doctor_signature) {
    signaturePenalty = GLOBAL_CHECKS.doctor_signature.penalty;
    totalScore += signaturePenalty;
  }

  breakdown.seal_penalty = sealPenalty;
  breakdown.signature_penalty = signaturePenalty;

  return {
    score: Math.max(0, Math.min(100, Math.round(totalScore))),
    breakdown,
    missing,
  };
}
