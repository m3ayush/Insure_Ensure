import mongoose from "mongoose";

const commonUserDataSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    pincode: { type: String, required: true, match: /^\d{6}$/ },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    email: { type: String, required: true },
    annual_income: { type: Number, required: true, min: 0 },
    employment_status: {
      type: String,
      enum: [
        "Employed",
        "Self-employed",
        "Business Owner",
        "Retired",
        "Student",
        "Homemaker",
      ],
    },
    marital_status: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    number_of_dependents: { type: Number, min: 0, max: 20, default: 0 },
    existing_policies: {
      type: String,
      enum: ["None", "1-2", "3-5", "5+"],
      default: "None",
    },
    city: { type: String, trim: true },
  },
  { _id: false }
);

const VALID_CATEGORIES = [
  "term_life",
  "whole_life",
  "endowment",
  "money_back",
  "pension_annuity",
  "child_plans",
  "ulips",
  "health",
  "personal_accident",
  "group_health",
  "motor",
  "travel",
  "home",
  "commercial",
  "fire",
  "marine",
  "cyber",
  "pet",
  "agricultural",
  "political_risk",
  "terrorism",
];

const recommendationSchema = new mongoose.Schema(
  {
    firebase_uid: { type: String, required: true, index: true },
    common_user_data: { type: commonUserDataSchema, required: true },
    selected_category: { type: String, required: true, enum: VALID_CATEGORIES },
    category_data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
    recommendations: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

recommendationSchema.index({ firebase_uid: 1, createdAt: -1 });

export default mongoose.model("Recommendation", recommendationSchema);
