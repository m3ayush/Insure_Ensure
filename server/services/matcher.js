import { MOCK_PLANS } from "../data/mockPlans.js";

function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── Universal Score (0–40 points) ──────────────────────────────

function scoreUniversal(plan, commonData) {
  let score = 0;
  const reasons = [];
  const age = calculateAge(commonData.dob);
  const income = Number(commonData.annual_income) || 0;

  // Age eligibility (0–15)
  const elig = plan.eligibility || {};
  const minAge = elig.min_age ?? 0;
  const maxAge = elig.max_age ?? 100;
  if (age >= minAge && age <= maxAge) {
    score += 15;
    reasons.push("You meet the age eligibility criteria");
  } else {
    const diff = age < minAge ? minAge - age : age - maxAge;
    if (diff <= 5) {
      score += 7;
      reasons.push("Close to the age eligibility range");
    }
  }

  // Affordability (0–15)
  const premiumMax = plan.premium_range?.max || 0;
  if (income > 0 && premiumMax > 0) {
    const ratio = premiumMax / income;
    if (ratio <= 0.05) {
      score += 15;
      reasons.push("Very affordable relative to your income");
    } else if (ratio <= 0.1) {
      score += 12;
      reasons.push("Affordable for your income level");
    } else if (ratio <= 0.2) {
      score += 8;
      reasons.push("Moderately affordable for your income");
    } else if (ratio <= 0.35) {
      score += 4;
    }
  } else {
    score += 8; // neutral if income not provided
  }

  // Claim settlement ratio (0–10)
  const csr = plan.claim_settlement_ratio || 0;
  if (csr >= 97) {
    score += 10;
    reasons.push(`Excellent claim settlement ratio (${csr}%)`);
  } else if (csr >= 93) {
    score += 8;
    reasons.push(`Good claim settlement ratio (${csr}%)`);
  } else if (csr >= 88) {
    score += 5;
  } else {
    score += 3;
  }

  return { score, reasons };
}

// ── Category-Specific Scorers (0–60 points each) ──────────────

const categoryScorers = {
  term_life(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    // Smoker acceptance
    if (data.smoker_status === "Yes" && elig.smoker_accepted) {
      score += 10;
      reasons.push("Accepts smokers");
    } else if (data.smoker_status === "No") {
      score += 10;
      if (plan.key_features?.some((f) => /non.?smoker/i.test(f))) {
        score += 5;
        reasons.push("Special premium for non-smokers");
      }
    }

    // Coverage amount match
    const desired = Number(data.coverage_amount) || 0;
    if (desired > 0 && desired <= (elig.max_sum_insured || Infinity)) {
      score += 15;
      reasons.push("Covers your desired sum insured");
    } else if (desired > 0) {
      score += 5;
    }

    // Policy term match
    const desiredTerm = Number(data.policy_term) || 0;
    if (desiredTerm > 0 && plan.policy_term_options?.includes(desiredTerm)) {
      score += 10;
      reasons.push(`Offers your preferred ${desiredTerm}-year term`);
    } else if (desiredTerm > 0 && plan.policy_term_options?.length) {
      score += 5;
    }

    // Riders match
    if (Array.isArray(data.riders) && data.riders.length > 0) {
      const feats = (plan.key_features || []).join(" ").toLowerCase();
      const matched = data.riders.filter((r) => feats.includes(r.toLowerCase()));
      score += Math.min(15, matched.length * 5);
      if (matched.length > 0) reasons.push(`Includes riders: ${matched.join(", ")}`);
    } else {
      score += 10;
    }

    return { score: Math.min(60, score), reasons };
  },

  whole_life(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};
    const income = Number(data.premium_budget) || 0;

    if (income > 0 && income >= plan.premium_range?.min && income <= plan.premium_range?.max) {
      score += 20;
      reasons.push("Fits within your premium budget");
    } else if (income > 0) {
      score += 8;
    }

    const desiredTerm = Number(data.policy_term) || 0;
    if (desiredTerm > 0 && plan.policy_term_options?.includes(desiredTerm)) {
      score += 15;
      reasons.push(`Offers your preferred ${desiredTerm}-year term`);
    } else {
      score += 8;
    }

    if (data.wealth_goal === "Guaranteed Income" && plan.key_features?.some((f) => /guaranteed/i.test(f))) {
      score += 15;
      reasons.push("Provides guaranteed income option");
    } else {
      score += 10;
    }

    score += 10; // base compatibility
    return { score: Math.min(60, score), reasons };
  },

  endowment(plan, data) {
    let score = 0;
    const reasons = [];

    const desiredTerm = Number(data.policy_term) || 0;
    if (desiredTerm > 0 && plan.policy_term_options?.includes(desiredTerm)) {
      score += 20;
      reasons.push(`Offers your preferred ${desiredTerm}-year term`);
    } else {
      score += 10;
    }

    const goal = data.investment_goal || "";
    const feats = (plan.key_features || []).join(" ").toLowerCase();
    if (goal && feats.includes(goal.toLowerCase())) {
      score += 15;
      reasons.push(`Aligns with your ${goal} goal`);
    } else {
      score += 8;
    }

    score += 15; // base features match
    if (plan.claim_settlement_ratio > 96) {
      score += 10;
      reasons.push("High claim settlement reliability");
    } else {
      score += 5;
    }
    return { score: Math.min(60, score), reasons };
  },

  money_back(plan, data) {
    let score = 0;
    const reasons = [];

    const freq = data.payout_frequency || "";
    const payouts = plan.eligibility?.payout_options || [];
    if (freq && payouts.some((p) => p.toLowerCase().includes(freq.toLowerCase()))) {
      score += 20;
      reasons.push(`Offers ${freq} payout option`);
    } else {
      score += 10;
    }

    const desiredTerm = Number(data.policy_term) || 0;
    if (desiredTerm > 0 && plan.policy_term_options?.includes(desiredTerm)) {
      score += 15;
      reasons.push(`Offers ${desiredTerm}-year term`);
    } else {
      score += 8;
    }

    score += 15; // general compatibility
    if (plan.rating >= 4.3) {
      score += 10;
      reasons.push("Highly rated plan");
    } else {
      score += 5;
    }
    return { score: Math.min(60, score), reasons };
  },

  pension_annuity(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const retireAge = Number(data.desired_retirement_age) || 60;
    if (elig.min_age && retireAge >= elig.min_age) {
      score += 15;
      reasons.push("Matches your retirement timeline");
    } else {
      score += 8;
    }

    const monthlyNeed = Number(data.monthly_pension_needed) || 0;
    if (monthlyNeed > 0 && plan.sum_insured_range?.max >= monthlyNeed * 12 * 15) {
      score += 15;
      reasons.push("Can fund your desired monthly pension");
    } else {
      score += 5;
    }

    const annuityType = data.annuity_type || "";
    const feats = (plan.key_features || []).join(" ").toLowerCase();
    if (annuityType && feats.includes(annuityType.toLowerCase())) {
      score += 15;
      reasons.push(`Offers ${annuityType} annuity`);
    } else {
      score += 8;
    }

    score += 15;
    return { score: Math.min(60, score), reasons };
  },

  child_plans(plan, data) {
    let score = 0;
    const reasons = [];

    const childAge = Number(data.child_age) || 0;
    const elig = plan.eligibility || {};
    if (childAge >= (elig.min_age || 0) && childAge <= (elig.max_age || 17)) {
      score += 20;
      reasons.push("Your child meets the age criteria");
    } else {
      score += 5;
    }

    const goal = data.goal || "";
    const feats = (plan.key_features || []).join(" ").toLowerCase();
    if (goal.toLowerCase().includes("education") && feats.includes("education")) {
      score += 15;
      reasons.push("Focused on education funding");
    } else {
      score += 10;
    }

    if (elig.payor_waiver) {
      score += 10;
      reasons.push("Includes payor waiver benefit");
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  ulips(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const risk = data.risk_appetite || "";
    if (risk && elig.risk_levels?.includes(risk)) {
      score += 20;
      reasons.push(`Supports your ${risk} risk appetite`);
    } else {
      score += 8;
    }

    const pref = data.fund_preference || "";
    if (pref && elig.fund_types?.includes(pref)) {
      score += 15;
      reasons.push(`Offers ${pref} fund options`);
    } else {
      score += 8;
    }

    const desiredTerm = Number(data.investment_horizon) || 0;
    if (desiredTerm > 0 && plan.policy_term_options?.includes(desiredTerm)) {
      score += 15;
      reasons.push(`Matches your ${desiredTerm}-year horizon`);
    } else {
      score += 8;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  health(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    // Pre-existing conditions
    if (data.pre_existing === "Yes" && elig.pre_existing_covered) {
      score += 15;
      reasons.push(`Covers pre-existing conditions (after ${elig.pre_existing_waiting_years}yr wait)`);
    } else if (data.pre_existing === "No") {
      score += 15;
    }

    // Maternity
    if (data.maternity_cover === "Yes" && elig.maternity_covered) {
      score += 10;
      reasons.push("Includes maternity coverage");
    } else if (data.maternity_cover !== "Yes") {
      score += 10;
    }

    // Room type preference
    if (data.room_type && elig.room_types?.includes(data.room_type)) {
      score += 10;
      reasons.push(`Offers ${data.room_type} room option`);
    } else {
      score += 5;
    }

    // Sum insured match
    const desired = Number(data.sum_insured) || 0;
    if (desired > 0 && desired >= plan.sum_insured_range?.min && desired <= plan.sum_insured_range?.max) {
      score += 15;
      reasons.push("Matches your desired coverage amount");
    } else if (desired > 0) {
      score += 5;
    } else {
      score += 10;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  personal_accident(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const occ = data.occupation_type || "";
    if (occ && elig.occupation_types?.includes(occ)) {
      score += 20;
      reasons.push("Covers your occupation type");
    } else if (occ === "High Risk" && elig.high_risk_accepted) {
      score += 20;
      reasons.push("Accepts high-risk occupations");
    } else {
      score += 8;
    }

    const desired = Number(data.cover_amount) || 0;
    if (desired > 0 && desired <= plan.sum_insured_range?.max) {
      score += 15;
      reasons.push("Covers your desired sum insured");
    } else {
      score += 8;
    }

    score += 15; // general match
    if (plan.rating >= 4.3) {
      score += 10;
      reasons.push("Highly rated plan");
    } else {
      score += 5;
    }
    return { score: Math.min(60, score), reasons };
  },

  group_health(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const groupSize = Number(data.group_size) || 0;
    if (groupSize >= (elig.min_group_size || 0)) {
      score += 20;
      reasons.push("Meets minimum group size requirement");
    } else {
      score += 5;
    }

    const budget = Number(data.budget_per_employee) || 0;
    if (budget > 0 && budget >= plan.premium_range?.min && budget <= plan.premium_range?.max) {
      score += 20;
      reasons.push("Fits within your per-employee budget");
    } else if (budget > 0) {
      score += 8;
    } else {
      score += 10;
    }

    if (data.pre_existing_coverage === "Yes" && plan.key_features?.some((f) => /pre.?existing/i.test(f))) {
      score += 10;
      reasons.push("Covers pre-existing conditions from day 1");
    } else {
      score += 5;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  motor(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    // Vehicle type match
    const vType = data.vehicle_type || "";
    if (vType && elig.vehicle_types?.includes(vType)) {
      score += 15;
      reasons.push(`Covers ${vType} vehicles`);
    } else {
      score += 5;
    }

    // Vehicle age
    const vAge = Number(data.vehicle_age) || 0;
    if (vAge <= (elig.max_vehicle_age || 15)) {
      score += 10;
      reasons.push("Your vehicle age is within coverage limits");
    }

    // NCB
    if (data.existing_ncb === "Yes" && elig.ncb_accepted) {
      score += 10;
      reasons.push("NCB transfer accepted — saves you money");
    } else {
      score += 5;
    }

    // Coverage type preferences
    if (data.coverage_type === "Comprehensive") {
      const feats = (plan.key_features || []).join(" ").toLowerCase();
      if (feats.includes("zero depreciation")) {
        score += 10;
        reasons.push("Includes zero depreciation cover");
      } else {
        score += 5;
      }
    } else {
      score += 5;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  travel(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const dest = data.destination || "";
    if (dest && elig.destinations?.some((d) => d.toLowerCase().includes(dest.toLowerCase()) || dest.toLowerCase().includes(d.toLowerCase()))) {
      score += 20;
      reasons.push(`Covers travel to ${dest}`);
    } else if (elig.destinations?.includes("Worldwide")) {
      score += 15;
      reasons.push("Worldwide coverage included");
    } else {
      score += 5;
    }

    const duration = Number(data.trip_duration) || 0;
    if (duration > 0 && duration <= (elig.max_trip_duration || 365)) {
      score += 15;
      reasons.push("Covers your trip duration");
    } else {
      score += 5;
    }

    if (data.trip_type === "Multi-trip" && elig.multi_trip_available) {
      score += 10;
      reasons.push("Multi-trip option available");
    } else {
      score += 5;
    }

    score += 10;
    if (plan.rating >= 4.3) {
      score += 5;
      reasons.push("Highly rated by customers");
    }
    return { score: Math.min(60, score), reasons };
  },

  home(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const pType = data.property_type || "";
    if (pType && elig.property_types?.includes(pType)) {
      score += 20;
      reasons.push(`Covers ${pType} properties`);
    } else {
      score += 8;
    }

    const bAge = Number(data.building_age) || 0;
    if (bAge <= (elig.max_building_age || 50)) {
      score += 15;
      reasons.push("Building age within coverage limits");
    } else {
      score += 5;
    }

    const pValue = Number(data.property_value) || 0;
    if (pValue > 0 && pValue <= plan.sum_insured_range?.max) {
      score += 15;
      reasons.push("Covers your full property value");
    } else {
      score += 5;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  commercial(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const bType = data.business_type || "";
    if (bType && elig.business_types?.includes(bType)) {
      score += 20;
      reasons.push(`Covers ${bType} businesses`);
    } else {
      score += 8;
    }

    const turnover = Number(data.annual_turnover) || 0;
    if (turnover >= (elig.min_turnover || 0)) {
      score += 15;
      reasons.push("Meets minimum turnover requirement");
    } else {
      score += 5;
    }

    if (data.business_interruption === "Yes" && plan.key_features?.some((f) => /business interruption/i.test(f))) {
      score += 15;
      reasons.push("Includes business interruption cover");
    } else {
      score += 8;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  fire(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const assetVal = Number(data.asset_value) || 0;
    if (assetVal > 0 && assetVal <= plan.sum_insured_range?.max) {
      score += 20;
      reasons.push("Covers your full asset value");
    } else if (assetVal > 0) {
      score += 8;
    } else {
      score += 10;
    }

    const safety = data.fire_safety || [];
    if (Array.isArray(safety) && safety.length > 0 && !safety.includes("None") && elig.fire_safety_discount) {
      score += 15;
      reasons.push("Fire safety equipment qualifies for discount");
    } else {
      score += 5;
    }

    if (data.fire_history === "No") {
      score += 15;
      reasons.push("Clean fire history improves eligibility");
    } else {
      score += 5;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  marine(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const goods = data.goods_type || "";
    if (goods && elig.goods_types?.includes(goods)) {
      score += 20;
      reasons.push(`Covers ${goods} shipments`);
    } else {
      score += 8;
    }

    const mode = data.transport_mode || "";
    if (mode && elig.transport_modes?.includes(mode)) {
      score += 15;
      reasons.push(`Supports ${mode} transport`);
    } else {
      score += 8;
    }

    const val = Number(data.goods_value) || 0;
    if (val > 0 && val <= plan.sum_insured_range?.max) {
      score += 15;
      reasons.push("Covers your shipment value");
    } else {
      score += 5;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  cyber(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const revenue = Number(data.annual_revenue) || 0;
    if (revenue >= (elig.min_revenue || 0)) {
      score += 15;
      reasons.push("Meets revenue eligibility");
    } else {
      score += 5;
    }

    const employees = Number(data.number_of_employees) || 0;
    if (employees <= (elig.max_employees || Infinity)) {
      score += 15;
      reasons.push("Company size within coverage range");
    } else {
      score += 5;
    }

    if (data.mfa_enabled === "Yes" && elig.mfa_discount) {
      score += 15;
      reasons.push("MFA enabled — eligible for security discount");
    } else {
      score += 5;
    }

    score += 10;
    if (plan.rating >= 4.3) {
      score += 5;
      reasons.push("Top-rated cyber insurer");
    }
    return { score: Math.min(60, score), reasons };
  },

  pet(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const petType = data.pet_type || "";
    if (petType && elig.pet_types?.includes(petType)) {
      score += 20;
      reasons.push(`Covers ${petType}s`);
    } else {
      score += 5;
    }

    const petAge = Number(data.pet_age) || 0;
    if (petAge <= (elig.max_pet_age || 10)) {
      score += 15;
      reasons.push("Your pet's age is within coverage limits");
    } else {
      score += 5;
    }

    if (data.microchipped === "Yes" && elig.microchip_discount) {
      score += 10;
      reasons.push("Microchip discount available");
    } else {
      score += 5;
    }

    score += 10;
    if (plan.key_features?.some((f) => /vaccination/i.test(f))) {
      score += 5;
      reasons.push("Includes vaccination coverage");
    }
    return { score: Math.min(60, score), reasons };
  },

  agricultural(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const land = Number(data.land_size) || 0;
    if (land >= (elig.min_land || 0)) {
      score += 15;
      reasons.push("Meets minimum land size requirement");
    } else {
      score += 5;
    }

    const cropType = data.primary_type || "";
    if (cropType && elig.crop_types?.some((c) => c.toLowerCase().includes(cropType.toLowerCase()))) {
      score += 15;
      reasons.push(`Covers ${cropType} farming`);
    } else {
      score += 8;
    }

    if (data.govt_scheme === "Yes" && plan.tags?.includes("govt_subsidized")) {
      score += 15;
      reasons.push("Compatible with government subsidy scheme");
    } else {
      score += 8;
    }

    const risk = data.location_risk || "";
    if (risk.includes("High")) {
      score += 10;
      reasons.push("Covers high-risk farming locations");
    } else {
      score += 5;
    }

    score += 5;
    return { score: Math.min(60, score), reasons };
  },

  political_risk(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const invVal = Number(data.investment_value) || 0;
    if (invVal >= (elig.min_investment || 0)) {
      score += 15;
      reasons.push("Meets minimum investment threshold");
    } else {
      score += 5;
    }

    const currency = data.currency || "";
    if (currency && elig.currencies?.includes(currency)) {
      score += 15;
      reasons.push(`Supports ${currency} currency`);
    } else {
      score += 5;
    }

    const risks = data.specific_risks || [];
    if (Array.isArray(risks) && risks.length > 0) {
      const matched = risks.filter((r) => elig.risk_types?.includes(r));
      const pts = Math.min(20, matched.length * 5);
      score += pts;
      if (matched.length > 0) reasons.push(`Covers: ${matched.join(", ")}`);
    } else {
      score += 10;
    }

    score += 10;
    return { score: Math.min(60, score), reasons };
  },

  terrorism(plan, data) {
    let score = 0;
    const reasons = [];
    const elig = plan.eligibility || {};

    const pType = data.property_type || "";
    if (pType && elig.property_types?.includes(pType)) {
      score += 20;
      reasons.push(`Covers ${pType} properties`);
    } else {
      score += 8;
    }

    const tier = data.location_tier || "";
    if (tier && elig.location_tiers?.includes(tier)) {
      score += 15;
      reasons.push(`Available in your location tier`);
    } else {
      score += 5;
    }

    const certs = data.security_certifications || [];
    if (Array.isArray(certs) && certs.length > 0 && !certs.includes("None") && elig.security_discount) {
      score += 10;
      reasons.push("Security certifications qualify for discount");
    } else {
      score += 5;
    }

    const propVal = Number(data.property_value) || 0;
    if (propVal > 0 && propVal <= plan.sum_insured_range?.max) {
      score += 10;
      reasons.push("Covers your full property value");
    } else {
      score += 5;
    }

    score += 5;
    return { score: Math.min(60, score), reasons };
  },
};

// ── Main matcher ───────────────────────────────────────────────

export function matchPlans(commonData, selectedCategory, categoryData) {
  const plans = MOCK_PLANS[selectedCategory] || [];

  const scored = plans.map((plan) => {
    const universal = scoreUniversal(plan, commonData);
    const scorer = categoryScorers[selectedCategory];
    const category = scorer ? scorer(plan, categoryData) : { score: 30, reasons: [] };

    const totalScore = Math.round(universal.score + category.score);
    const allReasons = [...universal.reasons, ...category.reasons];

    return {
      ...plan,
      score: totalScore,
      match_reasons: allReasons.slice(0, 5),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}
