import FormField from "../FormField";

export default function MotorForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Vehicle Type" type="radio" name="vehicle_type" value={data.vehicle_type} onChange={onChange} options={["Car", "Two-Wheeler"]} required />
      <FormField label="Registration Number" type="text" name="registration_number" value={data.registration_number} onChange={onChange} placeholder="e.g. MH01AB1234" required />
      <FormField label="Make & Model" type="text" name="make_model" value={data.make_model} onChange={onChange} placeholder="e.g. Maruti Swift" required />
      <FormField label="Manufacturing Year" type="number" name="manufacturing_year" value={data.manufacturing_year} onChange={onChange} min={2000} max={2026} required />
      <FormField label="Previous Policy Expiry Date" type="date" name="policy_expiry_date" value={data.policy_expiry_date} onChange={onChange} required />
      <FormField label="Existing NCB (%)" type="select" name="ncb_percentage" value={data.ncb_percentage} onChange={onChange} options={["0%", "20%", "25%", "35%", "45%", "50%"]} required />
      <FormField label="Prior Claims Count" type="number" name="prior_claims" value={data.prior_claims} onChange={onChange} min={0} max={10} />
      <FormField label="Fuel Type" type="select" name="fuel_type" value={data.fuel_type} onChange={onChange} options={["Petrol", "Diesel", "Electric", "CNG", "Hybrid"]} required />
      <FormField label="IDV Preference (INR)" type="number" name="idv_preference" value={data.idv_preference} onChange={onChange} placeholder="Insured Declared Value" />
    </div>
  );
}
