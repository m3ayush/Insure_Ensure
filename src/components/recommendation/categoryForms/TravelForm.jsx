import FormField from "../FormField";

export default function TravelForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Destination" type="text" name="destination" value={data.destination} onChange={onChange} placeholder="e.g. USA, Europe" required />
      <FormField label="Trip Type" type="select" name="trip_type" value={data.trip_type} onChange={onChange} options={["Business", "Leisure", "Education", "Medical"]} required />
      <FormField label="Trip Duration (Days)" type="number" name="trip_duration" value={data.trip_duration} onChange={onChange} min={1} max={365} required />
      <FormField label="Annual Multi-trip?" type="radio" name="annual_multi_trip" value={data.annual_multi_trip} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Number of Travelers" type="number" name="travelers_count" value={data.travelers_count} onChange={onChange} min={1} max={20} required />
      <FormField label="Adventure Activities?" type="radio" name="adventure_activities" value={data.adventure_activities} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Pre-existing Medical Conditions?" type="radio" name="pre_existing_medical" value={data.pre_existing_medical} onChange={onChange} options={["Yes", "No"]} />
      <FormField label="Baggage Cover Needed?" type="radio" name="baggage_cover" value={data.baggage_cover} onChange={onChange} options={["Yes", "No"]} />
    </div>
  );
}
