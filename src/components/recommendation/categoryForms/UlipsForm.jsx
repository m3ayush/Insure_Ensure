import FormField from "../FormField";

export default function UlipsForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Risk Appetite" type="select" name="risk_appetite" value={data.risk_appetite} onChange={onChange} options={["Conservative", "Moderate", "Aggressive"]} required />
      <FormField label="Investment Goal" type="select" name="investment_goal" value={data.investment_goal} onChange={onChange} options={["Wealth Creation", "Tax Saving", "Retirement", "Child Future"]} required />
      <FormField label="Preferred Fund Type" type="select" name="preferred_fund_type" value={data.preferred_fund_type} onChange={onChange} options={["Equity", "Debt", "Balanced", "Dynamic"]} required />
      <FormField label="Investment Horizon" type="select" name="investment_horizon" value={data.investment_horizon} onChange={onChange} options={["5 Years", "10 Years", "15 Years", "20+ Years"]} required />
      <FormField label="Monthly Investment (INR)" type="number" name="monthly_investment" value={data.monthly_investment} onChange={onChange} placeholder="e.g. 10000" required />
      <FormField label="Existing Market Investments?" type="radio" name="existing_investments" value={data.existing_investments} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
