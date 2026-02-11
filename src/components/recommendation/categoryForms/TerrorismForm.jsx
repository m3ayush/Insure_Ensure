import FormField from "../FormField";

export default function TerrorismForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Property Value (INR)" type="number" name="property_value" value={data.property_value} onChange={onChange} required />
      <FormField label="Location Tier" type="select" name="location_tier" value={data.location_tier} onChange={onChange} options={["Tier 1 (Metro)", "Tier 2", "Tier 3", "Remote"]} required />
      <FormField label="Property Type" type="select" name="property_type" value={data.property_type} onChange={onChange} options={["Commercial", "Residential", "Industrial", "Government"]} required />
      <div className="md:col-span-2">
        <FormField label="Security Certifications" type="multi-checkbox" name="security_certifications" value={data.security_certifications} onChange={onChange} options={["ISO 28000", "C-TPAT", "AEO", "None"]} />
      </div>
      <FormField label="Proximity to Sensitive Areas?" type="radio" name="proximity_sensitive" value={data.proximity_sensitive} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Business Interruption Cover Needed?" type="radio" name="business_interruption" value={data.business_interruption} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
