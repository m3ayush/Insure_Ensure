import { CATEGORY_FORM_MAP } from "./categoryForms";
import { getCategoryLabel } from "../../data/insuranceCategories";

export default function StepCategoryQuestions({ selectedCategory, categoryData, setCategoryData, onNext, onBack }) {
  const FormComponent = CATEGORY_FORM_MAP[selectedCategory];
  const label = getCategoryLabel(selectedCategory);

  if (!FormComponent) {
    return <p className="text-red-500">Unknown category: {selectedCategory}</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{label}</h2>
      <p className="text-gray-500 mb-6 text-sm">Fill in the details specific to this insurance type.</p>

      <FormComponent data={categoryData} setData={setCategoryData} />

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
