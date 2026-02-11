import FormField from "../FormField";

export default function HealthForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FormField label="Insuring For" type="multi-checkbox" name="insuring_for" value={data.insuring_for} onChange={onChange} options={["Self", "Spouse", "Children", "Parents", "In-Laws"]} required />
      </div>
      <FormField label="Family Members Count" type="number" name="family_members_count" value={data.family_members_count} onChange={onChange} min={1} max={10} required />
      <div className="md:col-span-2">
        <FormField label="Pre-existing Diseases" type="multi-checkbox" name="pre_existing_diseases" value={data.pre_existing_diseases} onChange={onChange} options={["Diabetes", "Hypertension", "Thyroid", "Asthma", "Heart Disease", "Cancer", "None"]} />
      </div>
      <FormField label="Room Preference" type="select" name="room_preference" value={data.room_preference} onChange={onChange} options={["Shared", "Private", "No Preference"]} required />
      <FormField label="Maternity Cover?" type="radio" name="maternity_cover" value={data.maternity_cover} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Desired Sum Insured (INR)" type="number" name="desired_sum_insured" value={data.desired_sum_insured} onChange={onChange} placeholder="e.g. 1000000" required />
      <FormField label="Already Have a Health Plan?" type="radio" name="current_health_plan" value={data.current_health_plan} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Preferred Hospital Network" type="select" name="hospital_network" value={data.hospital_network} onChange={onChange} options={["Any", "Metro Only", "Tier 1+2"]} />
    </div>
  );
}
