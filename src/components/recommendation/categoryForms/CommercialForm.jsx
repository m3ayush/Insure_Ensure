import FormField from "../FormField";

export default function CommercialForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Business Type" type="select" name="business_type" value={data.business_type} onChange={onChange} options={["Retail", "Office", "Warehouse", "Factory", "Restaurant", "Other"]} required />
      <FormField label="Annual Turnover (INR)" type="number" name="annual_turnover" value={data.annual_turnover} onChange={onChange} placeholder="e.g. 10000000" required />
      <FormField label="Number of Employees" type="number" name="number_of_employees" value={data.number_of_employees} onChange={onChange} min={1} required />
      <FormField label="Total Asset Value (INR)" type="number" name="total_asset_value" value={data.total_asset_value} onChange={onChange} required />
      <FormField label="Business Interruption Cover?" type="radio" name="business_interruption" value={data.business_interruption} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Third Party Liability Cover?" type="radio" name="third_party_liability" value={data.third_party_liability} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Previous Claims Count" type="number" name="previous_claims" value={data.previous_claims} onChange={onChange} min={0} max={10} />
    </div>
  );
}
