import FormField from "../FormField";

export default function PoliticalRiskForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Target Country" type="text" name="target_country" value={data.target_country} onChange={onChange} placeholder="e.g. Nigeria, Venezuela" required />
      <FormField label="Investment Value" type="number" name="investment_value" value={data.investment_value} onChange={onChange} required />
      <FormField label="Currency" type="select" name="currency" value={data.currency} onChange={onChange} options={["INR", "USD", "EUR", "GBP"]} required />
      <div className="md:col-span-2">
        <FormField label="Specific Risks" type="multi-checkbox" name="specific_risks" value={data.specific_risks} onChange={onChange} options={["Expropriation", "Currency Inconvertibility", "Political Violence", "Contract Frustration", "Sovereign Default"]} required />
      </div>
      <FormField label="Investment Type" type="select" name="investment_type" value={data.investment_type} onChange={onChange} options={["FDI", "Portfolio", "Joint Venture", "Trade Receivables"]} required />
      <FormField label="Investment Duration (Years)" type="number" name="investment_duration" value={data.investment_duration} onChange={onChange} min={1} max={30} required />
    </div>
  );
}
