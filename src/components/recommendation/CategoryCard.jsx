export default function CategoryCard({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition mb-1">
        {label}
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </button>
  );
}
