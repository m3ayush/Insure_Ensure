import FormField from "../FormField";

export default function CyberForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FormField label="Nature of Digital Assets" type="multi-checkbox" name="digital_assets" value={data.digital_assets} onChange={onChange} options={["Customer Data", "Financial Records", "Intellectual Property", "E-commerce", "SaaS Platform"]} required />
      </div>
      <FormField label="Annual Revenue (INR)" type="number" name="annual_revenue" value={data.annual_revenue} onChange={onChange} required />
      <div className="md:col-span-2">
        <FormField label="Security Measures" type="multi-checkbox" name="security_measures" value={data.security_measures} onChange={onChange} options={["Firewall", "Encryption", "MFA", "SOC", "Penetration Testing", "None"]} />
      </div>
      <FormField label="Past Breaches?" type="radio" name="past_breaches" value={data.past_breaches} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Employees with Data Access" type="number" name="employees_with_access" value={data.employees_with_access} onChange={onChange} min={1} required />
      <FormField label="Data Backup Frequency" type="select" name="backup_frequency" value={data.backup_frequency} onChange={onChange} options={["Real-time", "Daily", "Weekly", "None"]} required />
      <div className="md:col-span-2">
        <FormField label="Compliance Certifications" type="multi-checkbox" name="compliance" value={data.compliance} onChange={onChange} options={["ISO 27001", "SOC2", "PCI-DSS", "GDPR", "None"]} />
      </div>
    </div>
  );
}
