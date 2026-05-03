import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { logout, currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isUnverified = currentUser && !currentUser.emailVerified &&
    !currentUser.providerData?.some((p) => p.providerId === "google.com");
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const navLinks = [
    { to: "/recommendation", label: "Recommendation" },
    { to: "/chatbot", label: "Chatbot" },
    { to: "/reimbursement", label: "Reimbursement" },
    { to: "/account", label: "Account" },
  ];

  return (
    <>
      {isUnverified && (
        <div className="bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800 text-center py-2 px-4 text-sm text-amber-800 dark:text-amber-200">
          Your email is not verified.{" "}
          <Link to="/account" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">
            Resend verification email
          </Link>
        </div>
      )}
      <div className="px-4 pt-4 sm:px-6 lg:px-8 z-50 sticky top-0 mb-4">
        <nav className="bg-[#e8e4d9]/90 dark:bg-[#111111]/90 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(246,202,125,0.3)] border border-[#111] dark:border-[#333] rounded-[2rem] max-w-7xl mx-auto px-6 py-3 transition-all duration-300">
          <div className="flex justify-between items-center h-12">
            <Link
              to="/home"
              className="flex items-center gap-2 group no-underline"
            >
              <div className="w-10 h-10 bg-black dark:bg-[#f6ca7d] text-white dark:text-black rounded-full flex items-center justify-center font-black text-xl tracking-tighter group-hover:-rotate-12 transition-transform duration-300 border border-transparent dark:border-[#111]">
                IE
              </div>
              <span className="text-xl font-black text-black dark:text-white tracking-tight hidden sm:block">
                InsureEnsure
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2 bg-white dark:bg-black rounded-full p-1.5 border border-[#111] dark:border-[#333]">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 no-underline text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-white dark:bg-[#111] text-black dark:text-white border border-[#111] dark:border-[#333] hover:bg-[#f0eeb4] dark:hover:bg-[#222] transition-colors cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="bg-black dark:bg-[#f6ca7d] hover:bg-gray-800 dark:hover:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer border border-transparent dark:border-[#111]"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-white dark:bg-[#111] text-black dark:text-white border border-[#111] dark:border-[#333]"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 dark:text-gray-300 cursor-pointer p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="md:hidden mt-4 pt-4 border-t border-[#111] dark:border-[#333] space-y-2 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-black dark:text-white hover:bg-[#f0eeb4] dark:hover:bg-[#ff4713] rounded-2xl font-bold no-underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 dark:text-[#ff4713] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-bold cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>

        </nav>
      </div>
    </>
  );
}
