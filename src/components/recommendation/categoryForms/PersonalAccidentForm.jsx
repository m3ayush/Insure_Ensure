import FormField from "../FormField";

export default function PersonalAccidentForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Occupation Type" type="select" name="occupation_type" value={data.occupation_type} onChange={onChange} options={["Desk Job", "Field Work", "Manual Labor", "High Risk"]} required />
      <FormField label="Monthly Salary (INR)" type="number" name="monthly_salary" value={data.monthly_salary} onChange={onChange} placeholder="e.g. 50000" required />
      <FormField label="Frequent Travel?" type="radio" name="frequent_travel" value={data.frequent_travel} onChange={onChange} options={["Yes", "No"]} required />
      {data.frequent_travel === "Yes" && (
        <FormField label="Travel Mode" type="multi-checkbox" name="travel_mode" value={data.travel_mode} onChange={onChange} options={["Two-wheeler", "Car", "Public Transport", "Flights"]} />
      )}
      <FormField label="Adventure Sports?" type="radio" name="adventure_sports" value={data.adventure_sports} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Desired Cover Amount (INR)" type="number" name="desired_cover" value={data.desired_cover} onChange={onChange} placeholder="e.g. 5000000" required />
    </div>
  );
}
