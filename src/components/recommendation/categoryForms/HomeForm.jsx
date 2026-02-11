import FormField from "../FormField";

export default function HomeForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Property Type" type="select" name="property_type" value={data.property_type} onChange={onChange} options={["Apartment", "Independent House", "Villa", "Farmhouse"]} required />
      <FormField label="Ownership Status" type="select" name="ownership_status" value={data.ownership_status} onChange={onChange} options={["Owned", "Rented", "Mortgaged"]} required />
      <FormField label="Building Age (Years)" type="number" name="building_age" value={data.building_age} onChange={onChange} min={0} max={100} required />
      <FormField label="Carpet Area (sq ft)" type="number" name="carpet_area" value={data.carpet_area} onChange={onChange} min={100} required />
      <FormField label="Contents Value (INR)" type="number" name="contents_value" value={data.contents_value} onChange={onChange} placeholder="Furniture, appliances, etc." required />
      <FormField label="Building Value (INR)" type="number" name="building_value" value={data.building_value} onChange={onChange} placeholder="Structure value" required />
      <FormField label="Natural Disaster Zone?" type="radio" name="disaster_zone" value={data.disaster_zone} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Security System Installed?" type="radio" name="security_system" value={data.security_system} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
