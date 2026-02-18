import mongoose from "mongoose";

const uploadedDocSchema = new mongoose.Schema(
  {
    doc_id: { type: String, required: true },
    file_name: { type: String, required: true },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reimbursementAuditSchema = new mongoose.Schema(
  {
    firebase_uid: { type: String, required: true, index: true },
    session_id: { type: String, required: true, unique: true },

    extracted_data: {
      insurer_name: String,
      insurer_key: String,
      policy_number: String,
      hospital_name: String,
      discharge_date: String,
      bill_amount: Number,
      patient_name: String,
      diagnosis: String,
      has_hospital_seal: { type: Boolean, default: false },
      has_doctor_signature: { type: Boolean, default: false },
    },

    uploaded_docs: [uploadedDocSchema],

    score: { type: Number, default: 0 },
    score_breakdown: {
      mandatory_score: { type: Number, default: 0 },
      financial_score: { type: Number, default: 0 },
      supporting_score: { type: Number, default: 0 },
      seal_penalty: { type: Number, default: 0 },
      signature_penalty: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["uploaded", "extracted", "checklist_ready", "analysis_complete"],
      default: "uploaded",
    },

    missing_docs: [{ type: String }],
  },
  { timestamps: true }
);

reimbursementAuditSchema.index({ firebase_uid: 1, createdAt: -1 });

export default mongoose.model("ReimbursementAudit", reimbursementAuditSchema);
