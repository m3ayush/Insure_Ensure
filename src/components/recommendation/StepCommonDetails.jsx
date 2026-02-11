import { useState } from "react";
import { validateCommonData } from "../../utils/validators";

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";
const errorInputClass =
  "w-full px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";

export default function StepCommonDetails({ commonData, setCommonData, onNext }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setCommonData({ ...commonData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateCommonData(commonData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Personal Details</h2>
      <p className="text-gray-500 mb-6 text-sm">Fill in your basic information to get started.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={commonData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            className={errors.full_name ? errorInputClass : inputClass}
            placeholder="John Doe"
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={commonData.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            className={errors.dob ? errorInputClass : inputClass}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={commonData.gender === g}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="accent-indigo-600"
                />
                {g.charAt(0) + g.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            value={commonData.pincode}
            onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
            className={errors.pincode ? errorInputClass : inputClass}
            placeholder="400001"
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={10}
            value={commonData.mobile}
            onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, ""))}
            className={errors.mobile ? errorInputClass : inputClass}
            placeholder="9876543210"
          />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={commonData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? errorInputClass : inputClass}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Income (INR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={commonData.annual_income}
            onChange={(e) => handleChange("annual_income", e.target.value)}
            className={errors.annual_income ? errorInputClass : inputClass}
            placeholder="e.g. 600000"
            min={0}
          />
          {errors.annual_income && <p className="text-red-500 text-xs mt-1">{errors.annual_income}</p>}
        </div>

        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Status <span className="text-red-500">*</span>
          </label>
          <select
            value={commonData.employment_status}
            onChange={(e) => handleChange("employment_status", e.target.value)}
            className={errors.employment_status ? errorInputClass : inputClass}
          >
            <option value="">Select...</option>
            {["Employed", "Self-employed", "Business Owner", "Retired", "Student", "Homemaker"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.employment_status && <p className="text-red-500 text-xs mt-1">{errors.employment_status}</p>}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <select
            value={commonData.marital_status}
            onChange={(e) => handleChange("marital_status", e.target.value)}
            className={errors.marital_status ? errorInputClass : inputClass}
          >
            <option value="">Select...</option>
            {["Single", "Married", "Divorced", "Widowed"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.marital_status && <p className="text-red-500 text-xs mt-1">{errors.marital_status}</p>}
        </div>

        {/* Number of Dependents */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dependents</label>
          <input
            type="number"
            value={commonData.number_of_dependents}
            onChange={(e) => handleChange("number_of_dependents", e.target.value)}
            className={inputClass}
            min={0}
            max={20}
          />
        </div>

        {/* Existing Policies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Existing Insurance Policies</label>
          <select
            value={commonData.existing_policies}
            onChange={(e) => handleChange("existing_policies", e.target.value)}
            className={inputClass}
          >
            {["None", "1-2", "3-5", "5+"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={commonData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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
