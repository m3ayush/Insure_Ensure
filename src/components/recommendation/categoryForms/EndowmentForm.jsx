import FormField from "../FormField";

export default function EndowmentForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Savings Goal" type="select" name="savings_goal" value={data.savings_goal} onChange={onChange} options={["Child Education", "Marriage", "Retirement", "Wealth Building", "Other"]} required />
      <FormField label="Maturity Period (Years)" type="select" name="maturity_period" value={data.maturity_period} onChange={onChange} options={["10", "15", "20", "25"]} required />
      <FormField label="Premium Frequency" type="select" name="premium_frequency" value={data.premium_frequency} onChange={onChange} options={["Monthly", "Quarterly", "Semi-Annual", "Annual"]} required />
      <FormField label="Target Maturity Amount (INR)" type="number" name="target_maturity_amount" value={data.target_maturity_amount} onChange={onChange} placeholder="e.g. 2500000" required />
      <FormField label="Risk Tolerance" type="select" name="risk_tolerance" value={data.risk_tolerance} onChange={onChange} options={["Low", "Moderate"]} required />
    </div>
  );
}
