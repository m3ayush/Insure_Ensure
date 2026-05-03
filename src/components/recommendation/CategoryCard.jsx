export default function CategoryCard({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-black/10 border border-[#111] dark:border-[#333] rounded-[1.5rem] p-5 text-left hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      <h4 className="text-base font-black text-black dark:text-white group-hover:text-[#ff5d22] dark:group-hover:text-[#f6ca7d] transition mb-1 tracking-tight">
        {label}
      </h4>
      <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </button>
  );
}
