import FormField from "../FormField";

export default function MoneyBackForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Payout Frequency" type="select" name="payout_frequency" value={data.payout_frequency} onChange={onChange} options={["Every 3 Years", "Every 5 Years", "Custom"]} required />
      <FormField label="Financial Liabilities" type="multi-checkbox" name="financial_liabilities" value={data.financial_liabilities} onChange={onChange} options={["Home Loan", "Car Loan", "Education Loan", "None"]} />
      {data.financial_liabilities && !data.financial_liabilities.includes("None") && data.financial_liabilities.length > 0 && (
        <FormField label="Total Liability Amount (INR)" type="number" name="total_liability_amount" value={data.total_liability_amount} onChange={onChange} placeholder="e.g. 5000000" />
      )}
      <FormField label="Desired Sum Assured (INR)" type="number" name="desired_sum_assured" value={data.desired_sum_assured} onChange={onChange} placeholder="e.g. 2000000" required />
      <FormField label="Policy Term (Years)" type="select" name="policy_term" value={data.policy_term} onChange={onChange} options={["15", "20", "25"]} required />
    </div>
  );
}
