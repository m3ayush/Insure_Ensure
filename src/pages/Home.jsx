import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const services = [
  {
    title: "Insurance Recommendation",
    description:
      "Answer a few simple questions and get personalized insurance recommendations tailored to your needs and budget.",
    to: "/recommendation",
    icon: (
      <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Insurance Chatbot",
    description:
      "Have questions about insurance? Our AI-powered chatbot is here to help you understand policies, terms, and coverage.",
    to: "/chatbot",
    icon: (
      <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Reimbursement Verification",
    description:
      "Upload your insurance documents and get instant verification for reimbursement claims. Fast, accurate, and hassle-free.",
    to: "/reimbursement",
    icon: (
      <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            InsureEnsure
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-indigo-100">
            Your one-stop platform for smart insurance decisions. Get
            personalized recommendations, instant answers to your insurance
            queries, and seamless document verification for reimbursements.
          </p>
          {currentUser?.displayName && (
            <p className="mt-6 text-indigo-200 text-lg">
              Welcome back, <span className="font-semibold text-white">{currentUser.displayName}</span>
            </p>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Choose from our three core services designed to make insurance simple
          and accessible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.to}
              to={service.to}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline group"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 text-indigo-600 font-semibold text-sm flex items-center gap-1">
                Get Started
                <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            About Us
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 leading-relaxed mb-4">
              InsureEnsure is built to simplify insurance for everyone. We
              believe that understanding and managing insurance shouldn't be
              complicated. Our platform combines smart technology with
              user-friendly design to help you make informed decisions about
              your coverage.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're looking for the right insurance plan, need quick
              answers about your policy, or want to verify documents for a
              reimbursement claim, InsureEnsure has you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We'll get back to you soon.");
                e.target.reset();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>&copy; 2026 InsureEnsure. All rights reserved.</p>
      </footer>
    </div>
  );
}
