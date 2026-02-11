import FormField from "../FormField";

export default function AgriculturalForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Land Size (Acres)" type="number" name="land_size" value={data.land_size} onChange={onChange} min={0.1} required />
      <FormField label="Primary Type" type="select" name="primary_type" value={data.primary_type} onChange={onChange} options={["Crop", "Livestock", "Mixed", "Fishery", "Poultry"]} required />
      <FormField label="Crop / Livestock Type" type="text" name="crop_livestock_type" value={data.crop_livestock_type} onChange={onChange} placeholder="e.g. Rice, Wheat, Cattle" required />
      <FormField label="Irrigation Type" type="select" name="irrigation_type" value={data.irrigation_type} onChange={onChange} options={["Rainfed", "Canal", "Borewell", "Drip", "Sprinkler"]} required />
      <FormField label="Location Risk" type="select" name="location_risk" value={data.location_risk} onChange={onChange} options={["Low (Plain)", "Medium (Hill)", "High (Flood/Drought Prone)"]} required />
      <FormField label="Annual Yield Value (INR)" type="number" name="annual_yield" value={data.annual_yield} onChange={onChange} required />
      <FormField label="Government Scheme Enrolled?" type="radio" name="govt_scheme" value={data.govt_scheme} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
