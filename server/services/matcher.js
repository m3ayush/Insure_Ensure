import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Age helper (kept from original) ───────────────────────────
function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── Category-specific prompt builders ─────────────────────────
const categoryPromptBuilders = {
  term_life: (d) =>
    `Coverage amount: ₹${d.coverage_amount || "not specified"}, Policy term: ${d.policy_term || "not specified"} years, Smoker: ${d.smoker_status || "No"}, Riders needed: ${(d.riders || []).join(", ") || "none"}.`,

  whole_life: (d) =>
    `Premium budget: ₹${d.premium_budget || "not specified"}/year, Policy term: ${d.policy_term || "not specified"} years, Wealth goal: ${d.wealth_goal || "not specified"}.`,

  endowment: (d) =>
    `Policy term: ${d.policy_term || "not specified"} years, Investment goal: ${d.investment_goal || "not specified"}.`,

  money_back: (d) =>
    `Policy term: ${d.policy_term || "not specified"} years, Preferred payout frequency: ${d.payout_frequency || "not specified"}.`,

  pension_annuity: (d) =>
    `Desired retirement age: ${d.desired_retirement_age || 60}, Monthly pension needed: ₹${d.monthly_pension_needed || "not specified"}, Annuity type: ${d.annuity_type || "not specified"}.`,

  child_plans: (d) =>
    `Child age: ${d.child_age || "not specified"} years, Goal: ${d.goal || "education"}.`,

  ulips: (d) =>
    `Risk appetite: ${d.risk_appetite || "Moderate"}, Fund preference: ${d.fund_preference || "not specified"}, Investment horizon: ${d.investment_horizon || "not specified"} years.`,

  health: (d) =>
    `Sum insured needed: ₹${d.sum_insured || "not specified"}, Pre-existing conditions: ${d.pre_existing || "No"}, Maternity cover: ${d.maternity_cover || "No"}, Room type: ${d.room_type || "any"}.`,

  personal_accident: (d) =>
    `Occupation type: ${d.occupation_type || "not specified"}, Cover amount needed: ₹${d.cover_amount || "not specified"}.`,

  group_health: (d) =>
    `Group size: ${d.group_size || "not specified"} employees, Budget per employee: ₹${d.budget_per_employee || "not specified"}/year, Pre-existing coverage from day 1: ${d.pre_existing_coverage || "No"}.`,

  motor: (d) =>
    `Vehicle type: ${d.vehicle_type || "not specified"}, Vehicle age: ${d.vehicle_age || "not specified"} years, Coverage type: ${d.coverage_type || "Comprehensive"}, Existing NCB: ${d.existing_ncb || "No"}.`,

  travel: (d) =>
    `Destination: ${d.destination || "not specified"}, Trip duration: ${d.trip_duration || "not specified"} days, Trip type: ${d.trip_type || "Single"}.`,

  home: (d) =>
    `Property type: ${d.property_type || "not specified"}, Building age: ${d.building_age || "not specified"} years, Property value: ₹${d.property_value || "not specified"}.`,

  commercial: (d) =>
    `Business type: ${d.business_type || "not specified"}, Annual turnover: ₹${d.annual_turnover || "not specified"}, Business interruption cover needed: ${d.business_interruption || "No"}.`,

  fire: (d) =>
    `Asset value: ₹${d.asset_value || "not specified"}, Fire safety measures: ${(d.fire_safety || []).join(", ") || "none"}, Fire history: ${d.fire_history || "No"}.`,

  marine: (d) =>
    `Goods type: ${d.goods_type || "not specified"}, Transport mode: ${d.transport_mode || "not specified"}, Goods value: ₹${d.goods_value || "not specified"}.`,

  cyber: (d) =>
    `Annual revenue: ₹${d.annual_revenue || "not specified"}, Number of employees: ${d.number_of_employees || "not specified"}, MFA enabled: ${d.mfa_enabled || "No"}.`,

  pet: (d) =>
    `Pet type: ${d.pet_type || "not specified"}, Pet age: ${d.pet_age || "not specified"} years, Microchipped: ${d.microchipped || "No"}.`,

  agricultural: (d) =>
    `Land size: ${d.land_size || "not specified"} acres, Primary crop/livestock: ${d.primary_type || "not specified"}, Government scheme eligible: ${d.govt_scheme || "No"}, Location risk: ${d.location_risk || "Medium"}.`,

  political_risk: (d) =>
    `Investment value: ₹${d.investment_value || "not specified"}, Currency: ${d.currency || "INR"}, Specific risks: ${(d.specific_risks || []).join(", ") || "general"}.`,

  terrorism: (d) =>
    `Property type: ${d.property_type || "not specified"}, Location tier: ${d.location_tier || "not specified"}, Property value: ₹${d.property_value || "not specified"}, Security certifications: ${(d.security_certifications || []).join(", ") || "none"}.`,
};

// ── Category display names ─────────────────────────────────────
const categoryLabels = {
  term_life: "Term Life Insurance",
  whole_life: "Whole Life Insurance",
  endowment: "Endowment Insurance",
  money_back: "Money Back Policy",
  pension_annuity: "Pension & Annuity",
  child_plans: "Child Insurance Plans",
  ulips: "ULIPs",
  health: "Health Insurance",
  personal_accident: "Personal Accident Insurance",
  group_health: "Group Health Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
  home: "Home Insurance",
  commercial: "Commercial Insurance",
  fire: "Fire Insurance",
  marine: "Marine Insurance",
  cyber: "Cyber Insurance",
  pet: "Pet Insurance",
  agricultural: "Agricultural Insurance",
  political_risk: "Political Risk Insurance",
  terrorism: "Terrorism Insurance",
};

// ── Build the Gemini prompt ────────────────────────────────────
function buildPrompt(commonData, selectedCategory, categoryData) {
  const age = calculateAge(commonData.dob);
  const categoryLabel = categoryLabels[selectedCategory] || selectedCategory;
  const categoryDetails =
    categoryPromptBuilders[selectedCategory]?.(categoryData) ||
    JSON.stringify(categoryData);

  return `You are an expert Indian insurance advisor with deep knowledge of all insurers operating in India.

A user needs ${categoryLabel} recommendations. Use Google Search to find the LATEST, most current plans available in India as of today.

USER PROFILE:
- Name: ${commonData.full_name}
- Age: ${age} years (DOB: ${commonData.dob})
- Gender: ${commonData.gender}
- Location: ${commonData.city || "India"} (Pincode: ${commonData.pincode})
- Annual Income: ₹${commonData.annual_income?.toLocaleString("en-IN") || "not specified"}
- Employment: ${commonData.employment_status || "not specified"}
- Marital Status: ${commonData.marital_status || "not specified"}
- Dependents: ${commonData.number_of_dependents || 0}
- Existing Policies: ${commonData.existing_policies || "None"}

INSURANCE REQUIREMENTS (${categoryLabel}):
${categoryDetails}

TASK:
Search for real, currently available ${categoryLabel} plans in India from insurers like LIC, HDFC Life, ICICI Prudential, SBI Life, Max Life, Bajaj Allianz, Tata AIA, New India Assurance, Star Health, Care Health, Niva Bupa, Go Digit, Acko, and others.

Return EXACTLY 5 recommendations as a valid JSON array. Each object must have these exact fields:
[
  {
    "plan_name": "Full official plan name",
    "insurer": "Insurance company name",
    "category": "${selectedCategory}",
    "premium_range": {
      "min": <annual premium in INR as number>,
      "max": <annual premium in INR as number>
    },
    "sum_insured_range": {
      "min": <minimum coverage in INR as number>,
      "max": <maximum coverage in INR as number>
    },
    "claim_settlement_ratio": <percentage as number, e.g. 98.5>,
    "rating": <out of 5, e.g. 4.3>,
    "key_features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
    "match_reasons": ["why this suits this specific user - reason 1", "reason 2", "reason 3"],
    "policy_url": "direct URL to the plan page on insurer or aggregator site",
    "score": <match score out of 100 as integer>,
    "eligibility": {
      "min_age": <number>,
      "max_age": <number>
    },
    "real_time": true
  }
]

CRITICAL RULES:
- Use real plan names that actually exist from real Indian insurers
- Premium and coverage amounts must be realistic and current for India
- Match the user's profile — recommend plans they are actually eligible for given their age (${age}), income, and requirements
- Sort by score descending (best match first)
- Return ONLY the JSON array, no markdown, no explanation, no preamble`;
}

// ── Parse Gemini response safely ──────────────────────────────
function parseGeminiResponse(text) {
  try {
    // Strip markdown code fences if present
    const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    // Extract JSON array from the response
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array found");

    const jsonStr = clean.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    return parsed;
  } catch (err) {
    console.error("[matcher] Failed to parse Gemini response:", err.message);
    return null;
  }
}

// ── Fallback: rule-based stub when Gemini fails ───────────────
function buildFallbackRecommendations(selectedCategory) {
  return [
    {
      plan_name: "Unable to fetch live recommendations",
      insurer: "Please try again",
      category: selectedCategory,
      key_features: ["Real-time data temporarily unavailable"],
      match_reasons: ["Please retry — Gemini search grounding failed"],
      score: 0,
      real_time: false,
      error: true,
    },
  ];
}

// ── Main exported function (now async) ────────────────────────
export async function matchPlans(commonData, selectedCategory, categoryData) {
  try {
    // Initialize here (not at module level) so dotenv has already run
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.2, // lower = more factual, less hallucination
      },
    });

    const prompt = buildPrompt(commonData, selectedCategory, categoryData);

    console.log(`[matcher] Fetching live ${selectedCategory} plans via Gemini Search Grounding...`);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const plans = parseGeminiResponse(responseText);

    if (!plans || plans.length === 0) {
      console.warn("[matcher] Gemini returned empty/unparseable response, using fallback");
      return buildFallbackRecommendations(selectedCategory);
    }

    // Ensure score field exists and is a number
    const normalized = plans.map((p, i) => ({
      ...p,
      score: typeof p.score === "number" ? p.score : Math.max(10, 95 - i * 10),
      real_time: true,
    }));

    // Sort by score descending and return top 5
    return normalized.sort((a, b) => b.score - a.score).slice(0, 5);
  } catch (err) {
    console.error("[matcher] Gemini Search Grounding error:", err.message);
    return buildFallbackRecommendations(selectedCategory);
  }
}