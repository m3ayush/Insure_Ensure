import FormField from "../FormField";

export default function PetForm({ data, setData }) {
  const onChange = (name, value) => setData({ ...data, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Pet Type" type="select" name="pet_type" value={data.pet_type} onChange={onChange} options={["Dog", "Cat", "Bird", "Rabbit", "Other"]} required />
      <FormField label="Breed" type="text" name="breed" value={data.breed} onChange={onChange} placeholder="e.g. Labrador, Persian" required />
      <FormField label="Pet Age (Years)" type="number" name="pet_age" value={data.pet_age} onChange={onChange} min={0} max={25} required />
      <FormField label="Is Microchipped?" type="radio" name="is_microchipped" value={data.is_microchipped} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Neutered / Spayed?" type="radio" name="is_neutered" value={data.is_neutered} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Vaccinations Up to Date?" type="radio" name="vaccinations_current" value={data.vaccinations_current} onChange={onChange} options={["Yes", "No"]} required />
      <FormField label="Pre-existing Conditions" type="text" name="pre_existing_conditions" value={data.pre_existing_conditions} onChange={onChange} placeholder="Optional" />
      <FormField label="Pet Value (INR)" type="number" name="pet_value" value={data.pet_value} onChange={onChange} placeholder="For pedigree pets" />
    </div>
  );
}
