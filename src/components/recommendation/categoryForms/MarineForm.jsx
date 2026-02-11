import FormField from "../FormField";

export default function MarineForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Type of Goods" type="select" name="goods_type" value={data.goods_type} onChange={onChange} options={["Raw Materials", "Finished Goods", "Machinery", "Electronics", "Perishables"]} required />
      <FormField label="Shipping Route" type="text" name="shipping_route" value={data.shipping_route} onChange={onChange} placeholder="e.g. Mumbai-Singapore" required />
      <FormField label="Goods Value per Shipment (INR)" type="number" name="goods_value" value={data.goods_value} onChange={onChange} required />
      <FormField label="Shipment Frequency" type="select" name="shipment_frequency" value={data.shipment_frequency} onChange={onChange} options={["One-time", "Monthly", "Weekly", "Daily"]} required />
      <FormField label="Mode of Transport" type="select" name="transport_mode" value={data.transport_mode} onChange={onChange} options={["Sea", "Air", "Road", "Multimodal"]} required />
      <FormField label="Packaging Standard" type="select" name="packaging_standard" value={data.packaging_standard} onChange={onChange} options={["Standard", "Reinforced", "Custom"]} />
    </div>
  );
}
