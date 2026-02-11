import FormField from "../FormField";

export default function ChildPlansForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Child's Age" type="number" name="child_age" value={data.child_age} onChange={onChange} min={0} max={25} required />
      <FormField label="Child's Gender" type="select" name="child_gender" value={data.child_gender} onChange={onChange} options={["Male", "Female", "Other"]} required />
      <FormField label="Education Fund Goal (INR)" type="number" name="education_fund_goal" value={data.education_fund_goal} onChange={onChange} placeholder="e.g. 5000000" required />
      <FormField label="Target Education Level" type="select" name="target_education" value={data.target_education} onChange={onChange} options={["Graduation", "Post-Graduation", "Abroad Studies"]} required />
      <FormField label="Payor Waiver Benefit?" type="radio" name="payor_waiver" value={data.payor_waiver} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Number of Children" type="number" name="number_of_children" value={data.number_of_children} onChange={onChange} min={1} max={10} required />
    </div>
  );
}
