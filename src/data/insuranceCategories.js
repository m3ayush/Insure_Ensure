export const CATEGORY_GROUPS = [
  {
    groupName: "Life & Savings",
    categories: [
      { key: "term_life", label: "Term Life Insurance", description: "Pure protection cover for your family" },
      { key: "whole_life", label: "Whole Life Insurance", description: "Lifetime coverage with cash value" },
      { key: "endowment", label: "Endowment Plans", description: "Savings + insurance combo" },
      { key: "money_back", label: "Money Back Plans", description: "Periodic payouts during policy" },
      { key: "pension_annuity", label: "Pension / Annuity", description: "Retirement income planning" },
      { key: "child_plans", label: "Child Plans", description: "Secure your child's future" },
      { key: "ulips", label: "ULIPs", description: "Market-linked insurance plans" },
    ],
  },
  {
    groupName: "Health & Accident",
    categories: [
      { key: "health", label: "Health Insurance", description: "Medical expense coverage" },
      { key: "personal_accident", label: "Personal Accident", description: "Accident injury protection" },
      { key: "group_health", label: "Group Health", description: "Employee group coverage" },
    ],
  },
  {
    groupName: "Motor & Travel",
    categories: [
      { key: "motor", label: "Motor Insurance", description: "Car & bike protection" },
      { key: "travel", label: "Travel Insurance", description: "Trip & travel coverage" },
    ],
  },
  {
    groupName: "Property & Business",
    categories: [
      { key: "home", label: "Home Insurance", description: "Home & contents protection" },
      { key: "commercial", label: "Commercial Insurance", description: "Business asset coverage" },
      { key: "fire", label: "Fire Insurance", description: "Fire damage protection" },
      { key: "marine", label: "Marine Insurance", description: "Cargo & shipping coverage" },
      { key: "cyber", label: "Cyber Insurance", description: "Digital risk protection" },
    ],
  },
  {
    groupName: "Niche & Specialty",
    categories: [
      { key: "pet", label: "Pet Insurance", description: "Vet & pet health coverage" },
      { key: "agricultural", label: "Agricultural Insurance", description: "Crop & livestock protection" },
      { key: "political_risk", label: "Political Risk", description: "Geopolitical risk coverage" },
      { key: "terrorism", label: "Terrorism Insurance", description: "Terror event protection" },
    ],
  },
];

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.categories.map((c) => ({ ...c, groupName: g.groupName }))
);

export function getCategoryLabel(key) {
  const cat = ALL_CATEGORIES.find((c) => c.key === key);
  return cat ? cat.label : key;
}
