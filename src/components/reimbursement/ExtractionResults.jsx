function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "Not detected"}</p>
    </div>
  );
}

function Badge({ detected, label }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        detected
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {detected ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {label}
    </div>
  );
}

export default function ExtractionResults({ extractedData }) {
  if (!extractedData) return null;

  const amount = extractedData.bill_amount
    ? `₹${Number(extractedData.bill_amount).toLocaleString("en-IN")}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Extracted Information
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <Field label="Insurer" value={extractedData.insurer_name} />
        <Field label="Policy Number" value={extractedData.policy_number} />
        <Field label="Hospital" value={extractedData.hospital_name} />
        <Field label="Discharge Date" value={extractedData.discharge_date} />
        <Field label="Bill Amount" value={amount} />
        <Field label="Patient Name" value={extractedData.patient_name} />
        {extractedData.diagnosis && (
          <div className="col-span-2 md:col-span-3">
            <Field label="Diagnosis / Procedure" value={extractedData.diagnosis} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <Badge detected={extractedData.has_hospital_seal} label="Hospital Seal" />
        <Badge detected={extractedData.has_doctor_signature} label="Doctor Signature" />
      </div>
    </div>
  );
}
