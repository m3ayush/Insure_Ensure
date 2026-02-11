import FormField from "../FormField";

export default function TermLifeForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Are you a smoker?" type="radio" name="is_smoker" value={data.is_smoker} onChange={onChange} options={["Yes", "No"]} required />
      {data.is_smoker === "Yes" && (
        <FormField label="Tobacco Frequency" type="select" name="tobacco_frequency" value={data.tobacco_frequency} onChange={onChange} options={["Daily", "Occasional", "Former"]} required />
      )}
      <FormField label="Education" type="select" name="education" value={data.education} onChange={onChange} options={["High School", "Graduate", "Post-Graduate", "Professional"]} required />
      <FormField label="Sum Insured (INR)" type="number" name="sum_insured" value={data.sum_insured} onChange={onChange} placeholder="e.g. 10000000" min={500000} required />
      <FormField label="Policy Term (Years)" type="select" name="policy_term" value={data.policy_term} onChange={onChange} options={["10", "15", "20", "25", "30"]} required />
      <FormField label="Existing Health Conditions" type="multi-checkbox" name="health_conditions" value={data.health_conditions} onChange={onChange} options={["Diabetes", "Hypertension", "Heart Disease", "None"]} />
      <div className="md:col-span-2">
        <FormField label="Riders Interested" type="multi-checkbox" name="riders" value={data.riders} onChange={onChange} options={["Critical Illness", "Accidental Death", "Waiver of Premium"]} />
      </div>
    </div>
  );
}
