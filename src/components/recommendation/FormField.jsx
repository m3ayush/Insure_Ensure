const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";

export default function FormField({ label, type = "text", name, value, onChange, options, required, placeholder, min, max, disabled }) {
  const handleChange = (e) => {
    const val = type === "checkbox" ? undefined : e.target.value;
    onChange(name, val);
  };

  if (type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={handleChange}
          className={inputClass}
          required={required}
          disabled={disabled}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === "multi-checkbox") {
    const selected = Array.isArray(value) ? value : [];
    const handleToggle = (opt) => {
      const next = selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt];
      onChange(name, next);
    };
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => handleToggle(opt)}
                className="accent-indigo-600 rounded"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === "date") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={value || ""}
          onChange={handleChange}
          className={inputClass}
          required={required}
          min={min}
          max={max}
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={value || ""}
          onChange={handleChange}
          className={inputClass + " resize-none"}
          rows={3}
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={handleChange}
        className={inputClass}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}
