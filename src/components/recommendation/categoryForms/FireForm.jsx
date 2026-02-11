import FormField from "../FormField";

export default function FireForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Property/Asset Value (INR)" type="number" name="asset_value" value={data.asset_value} onChange={onChange} required />
      <div className="md:col-span-2">
        <FormField label="Fire Safety Equipment" type="multi-checkbox" name="fire_safety" value={data.fire_safety} onChange={onChange} options={["Sprinklers", "Extinguishers", "Alarm System", "None"]} />
      </div>
      <FormField label="History of Fire Incidents?" type="radio" name="fire_history" value={data.fire_history} onChange={onChange} options={["Yes", "No"]} required />
      {data.fire_history === "Yes" && (
        <FormField label="Number of Past Incidents" type="number" name="fire_incidents_count" value={data.fire_incidents_count} onChange={onChange} min={1} />
      )}
      <FormField label="Building Construction" type="select" name="building_construction" value={data.building_construction} onChange={onChange} options={["RCC", "Wood Frame", "Steel", "Mixed"]} required />
      <FormField label="Nearby Fire Station?" type="radio" name="nearby_fire_station" value={data.nearby_fire_station} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
