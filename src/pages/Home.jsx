import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const services = [
  {
    title: "Insurance Recommendation",
    description: "Get personalized insurance recommendations tailored to your needs and budget.",
    to: "/recommendation",
    color: "bg-[#e1d7c6] dark:bg-[#111111] border-[#111] dark:border-[#333]",
    textHover: "group-hover:text-[#ff5d22] dark:group-hover:text-[#f6ca7d]",
    textColor: "text-black dark:text-white",
    descColor: "text-gray-800 dark:text-gray-400",
    iconColor: "text-black dark:text-black bg-[#f0eeb4] dark:bg-[#f6ca7d]",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-1",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Insurance Chatbot",
    description: "AI-powered chatbot to help you understand policies and coverage terms.",
    to: "/chatbot",
    color: "bg-white dark:bg-[#ffffff] border-[#111] dark:border-[#333]",
    textHover: "group-hover:text-[#ff5d22] dark:group-hover:text-[#ff4713]",
    textColor: "text-black dark:text-black",
    descColor: "text-gray-600 dark:text-gray-800",
    iconColor: "text-white dark:text-white bg-[#ff5d22] dark:bg-[#ff4713]",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Reimbursement Verification",
    description: "Upload documents and get instant verification for reimbursement claims.",
    to: "/reimbursement",
    color: "bg-[#f0eeb4] dark:bg-[#ff4713] border-[#111] dark:border-[#ff4713]",
    textHover: "group-hover:text-[#ff5d22] dark:group-hover:text-black",
    textColor: "text-black dark:text-white",
    descColor: "text-gray-800 dark:text-white/90",
    iconColor: "text-white dark:text-black bg-black dark:bg-white",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#e8e4d9] dark:bg-black font-sans transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          
          {/* Hero / Greeting Box (Spans 2 columns) */}
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#f6ca7d] border border-[#111] dark:border-[#f6ca7d] rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,71,19,1)] hover:-translate-y-1">
            <div className="relative z-10">
              {currentUser?.displayName && (
                <p className="inline-block px-4 py-1.5 rounded-full bg-[#f0eeb4] dark:bg-black text-black dark:text-white text-sm font-bold tracking-wide mb-6 border border-[#111] dark:border-black shadow-sm">
                  Welcome back, {currentUser.displayName} 👋
                </p>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
                Interactive online <br className="hidden sm:block"/> insurance education <br className="hidden sm:block"/> that inspires
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-900 max-w-xl font-medium">
                Discover the joy of simplicity through our vibrant insurance platform, where smart tools help you understand policies, term life, and coverages.
              </p>
            </div>
          </div>

          {/* Quick Stat / CTA Box */}
          <div className="col-span-1 bg-[#e1d7c6] dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.5)] hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 bg-black dark:bg-[#f6ca7d] text-white dark:text-black rounded-full flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight">Get Covered Fast</h3>
              <p className="text-gray-800 dark:text-gray-400 font-medium">
                Connect with our intelligent systems and figure out your policy in under 5 minutes.
              </p>
            </div>
            <Link to="/recommendation" className="mt-8 bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-full font-bold text-center hover:scale-105 transition-transform no-underline flex items-center justify-center gap-2">
              Start Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Services Section */}
          {services.map((service) => (
            <Link
              key={service.to}
              to={service.to}
              className={`border rounded-[2.5rem] p-8 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 no-underline group flex flex-col justify-between ${service.color} ${service.colSpan}`}
            >
              <div>
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110 border border-[#111] dark:border-transparent ${service.iconColor}`}>
                  {service.icon}
                </div>
                <h3 className={`text-2xl font-black mb-3 tracking-tight transition-colors ${service.textColor} ${service.textHover}`}>
                  {service.title}
                </h3>
                <p className={`font-medium leading-relaxed ${service.descColor}`}>
                  {service.description}
                </p>
              </div>
              <div className={`mt-8 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all ${service.textColor}`}>
                Explore Tool
                <div className="w-8 h-8 rounded-full bg-transparent border border-current flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-8 text-center text-sm font-bold text-gray-500 dark:text-gray-600 border-t border-[#111] dark:border-[#333] max-w-7xl mx-auto w-full px-4">
        <p>&copy; 2026 InsureEnsure. All rights reserved.</p>
      </footer>
    </div>
  );
}
