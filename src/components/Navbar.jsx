import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, SignOut } from "@phosphor-icons/react";

export default function Navbar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isUnverified = currentUser && !currentUser.emailVerified &&
    !currentUser.providerData?.some((p) => p.providerId === "google.com");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const navLinks = [
    { to: "/recommendation", label: "Recommend" },
    { to: "/chatbot", label: "Advisor" },
    { to: "/reimbursement", label: "Claims" },
  ];

  const springConfig = { type: "spring", stiffness: 300, damping: 20 };
  const MotionDiv = motion.div;
  const MotionHeader = motion.header;
  const MotionButton = motion.button;

  return (
    <>
      <AnimatePresence>
        {isUnverified && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-900 text-white text-center py-2.5 px-4 text-xs font-medium tracking-wide flex justify-center items-center relative z-50"
          >
            Your email is unverified.{" "}
            <Link to="/account" className="ml-2 font-bold underline decoration-zinc-500 hover:decoration-current transition-colors">
              Resend verification
            </Link>
          </MotionDiv>
        )}
      </AnimatePresence>

      <MotionHeader
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={springConfig}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className={`pointer-events-auto flex items-center justify-between outline-none ring-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? "w-full max-w-5xl rounded-[2rem] bg-white/76 backdrop-blur-xl border border-zinc-200/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_-12px_rgba(20,83,45,0.18)] px-6 py-3" : "w-full max-w-[1400px] border border-transparent bg-transparent px-6 py-4 shadow-none"}`}>
          
          <Link to="/home" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl group">
            <img
              src="/insureensure-logo.svg"
              alt="InsureEnsure"
              className="h-11 w-auto shrink-0 object-contain transition-transform group-hover:scale-[0.98] group-active:scale-95"
            />
            <span className="text-xl font-bold tracking-tighter text-zinc-950 hidden sm:block">
              InsureEnsure
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-zinc-200/60 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 text-zinc-600 hover:text-emerald-900"
                >
                  {isActive && (
                    <MotionDiv
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_-2px_rgba(20,83,45,0.16)] border border-emerald-100"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser && (
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-semibold shadow-[0_4px_12px_-4px_rgba(20,83,45,0.35)] hover:shadow-[0_8px_20px_-6px_rgba(20,83,45,0.35)] transition-shadow"
              >
                Sign Out
              </MotionButton>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <MotionButton
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-950"
            >
              {menuOpen ? <X weight="bold" size={18} /> : <List weight="bold" size={18} />}
            </MotionButton>
          </div>
        </div>
      </MotionHeader>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springConfig}
            className="fixed inset-x-4 top-24 z-40 md:hidden bg-white/92 backdrop-blur-2xl border border-zinc-200/60 rounded-[2rem] p-4 shadow-[0_20px_40px_-15px_rgba(20,83,45,0.18)]"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-4 text-base font-semibold text-zinc-950 bg-zinc-50 hover:bg-emerald-50 rounded-2xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-full bg-zinc-200 my-2" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 px-6 py-4 w-full bg-emerald-800 text-white rounded-2xl font-semibold"
              >
                Sign Out <SignOut weight="bold" size={18} />
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
