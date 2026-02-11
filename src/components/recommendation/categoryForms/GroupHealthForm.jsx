import FormField from "../FormField";

export default function GroupHealthForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Group Size" type="number" name="group_size" value={data.group_size} onChange={onChange} min={5} placeholder="Minimum 5" required />
      <FormField label="Industry Type" type="select" name="industry_type" value={data.industry_type} onChange={onChange} options={["IT", "Manufacturing", "Healthcare", "Education", "Finance", "Hospitality", "Other"]} required />
      <FormField label="Average Age of Members" type="number" name="average_age" value={data.average_age} onChange={onChange} min={18} max={65} required />
      <FormField label="Include Dependents?" type="radio" name="include_dependents" value={data.include_dependents} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Maternity Cover Needed?" type="radio" name="maternity_cover" value={data.maternity_cover} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Budget per Employee (INR/Year)" type="number" name="budget_per_employee" value={data.budget_per_employee} onChange={onChange} placeholder="e.g. 15000" required />
      <FormField label="Pre-existing Coverage?" type="radio" name="pre_existing_coverage" value={data.pre_existing_coverage} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
