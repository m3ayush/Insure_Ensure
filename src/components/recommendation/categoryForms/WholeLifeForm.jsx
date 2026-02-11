import FormField from "../FormField";

export default function WholeLifeForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Income Level (Annual)" type="select" name="income_level" value={data.income_level} onChange={onChange} options={["Under 5 Lakhs", "5-10 Lakhs", "10-25 Lakhs", "25-50 Lakhs", "50 Lakhs+"]} required />
      <FormField label="Wealth Transfer Goal?" type="radio" name="wealth_transfer_goal" value={data.wealth_transfer_goal} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Desired Payout Age" type="number" name="desired_payout_age" value={data.desired_payout_age} onChange={onChange} placeholder="e.g. 85" min={60} max={100} required />
      <FormField label="Monthly Premium Budget (INR)" type="number" name="premium_budget_monthly" value={data.premium_budget_monthly} onChange={onChange} placeholder="e.g. 5000" min={1000} required />
      <FormField label="Nomination Preference" type="select" name="nomination_preference" value={data.nomination_preference} onChange={onChange} options={["Spouse", "Child", "Parent", "Other"]} />
    </div>
  );
}
