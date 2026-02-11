import Navbar from "../components/Navbar";

export default function Reimbursement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Reimbursement Verification
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Upload your insurance documents for instant verification and
          reimbursement processing. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
