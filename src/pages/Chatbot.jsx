import Navbar from "../components/Navbar";

export default function Chatbot() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Insurance Chatbot
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Ask any questions about insurance policies, terms, and coverage.
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
