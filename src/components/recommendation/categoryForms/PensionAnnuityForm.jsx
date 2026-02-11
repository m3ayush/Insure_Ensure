import FormField from "../FormField";

export default function PensionAnnuityForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Desired Retirement Age" type="number" name="desired_retirement_age" value={data.desired_retirement_age} onChange={onChange} placeholder="e.g. 60" min={45} max={70} required />
      <FormField label="Monthly Investment Capacity (INR)" type="number" name="monthly_investment" value={data.monthly_investment} onChange={onChange} placeholder="e.g. 10000" required />
      <FormField label="Spouse's Date of Birth" type="date" name="spouse_dob" value={data.spouse_dob} onChange={onChange} />
      <FormField label="Existing Retirement Corpus (INR)" type="number" name="existing_corpus" value={data.existing_corpus} onChange={onChange} placeholder="0" />
      <FormField label="Annuity Type Preference" type="select" name="annuity_type" value={data.annuity_type} onChange={onChange} options={["Immediate", "Deferred"]} required />
      <FormField label="Payout Mode" type="select" name="payout_mode" value={data.payout_mode} onChange={onChange} options={["Monthly", "Quarterly", "Annual"]} required />
    </div>
  );
}
