import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react";

// Use a 4K Unsplash image to prevent stretching and blurriness
const HERO_IMAGE = "https://images.unsplash.com/photo-1542037104-5fb9e88d55d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=100";

// High-quality relevant images for sections
const REC_IMG = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80";
const CHAT_IMG = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80";
const CLAIMS_IMG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80";

const sections = [
  {
    title: "Personalized Recommendation",
    subtitle: "TAILORED COVERAGE",
    description: "Our intelligent engine analyzes your specific needs, lifestyle, and budget to craft an insurance plan that fits perfectly. Say goodbye to one-size-fits-all policies.",
    img: REC_IMG,
    to: "/recommendation",
    btnText: "Get Your Quote",
    reverse: false
  },
  {
    title: "Intelligent AI Advisor",
    subtitle: "24/7 SUPPORT",
    description: "Complex jargon decoded instantly. Our AI Advisor is trained to clarify policies, explain coverage terms, and answer your most pressing questions at any hour.",
    img: CHAT_IMG,
    to: "/chatbot",
    btnText: "Talk to Advisor",
    reverse: true
  },
  {
    title: "Instant Claims Processing",
    subtitle: "HASSLE-FREE VERIFICATION",
    description: "Upload your documents and receive instant verification. We've eliminated the traditional waiting periods so you can get reimbursed without the anxiety.",
    img: CLAIMS_IMG,
    to: "/reimbursement",
    btnText: "File a Claim",
    reverse: false
  }
];

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      
      {/* Initial Page Load Overlay (Curtain Reveal) */}
      <motion.div 
        className="fixed inset-0 z-[100] bg-zinc-950 pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <Navbar />

      {/* Hero Section (Forma Living Style) */}
      <section className="relative h-[100svh] w-full overflow-hidden flex flex-col justify-end">
        {/* Full Bleed Background Image with subtle zoom on load */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img 
            src={HERO_IMAGE} 
            alt="Family in field" 
            className="w-full h-full object-cover object-center"
          />
          {/* Base dimming */}
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Top dark gradient for Navbar visibility */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 to-transparent"></div>
          {/* Bottom dark gradient for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
        </motion.div>

        {/* Bottom Content Area */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              {currentUser?.displayName && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold tracking-widest uppercase mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  Welcome back, {currentUser.displayName}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tighter leading-[1.05] text-white drop-shadow-md">
                Coverage that <br className="hidden sm:block" /> moves with you.
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm md:text-right"
            >
              <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed drop-shadow-md">
                Each policy is precision-built for your specific lifestyle, ensuring higher quality and consistency than traditional insurance models.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center justify-between border-t border-white/20 pt-6 text-white/60 text-[10px] font-bold tracking-widest uppercase"
          >
            <span>Your Trusted Partner</span>
            <div className="flex items-center gap-2">
              <span>Scroll to explore</span>
              <ArrowDown weight="bold" size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Stacked Sections */}
      <div className="flex flex-col gap-12 md:gap-24 py-24 md:py-32">
        {sections.map((data, index) => (
          <section 
            key={index} 
            className="px-6 lg:px-12 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24 overflow-hidden"
          >
            {data.reverse ? (
              <>
                <div className="w-full md:w-1/2 flex md:justify-end order-2 md:order-1">
                  <div className="max-w-lg">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-xs sm:text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 block"
                    >
                      {data.subtitle}
                    </motion.span>
                    <motion.h2 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-6 leading-[1.05]"
                    >
                      {data.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-medium"
                    >
                      {data.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link to={data.to} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {data.btnText}
                        <ArrowRight weight="bold" size={16} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: false, margin: "-50px" }}
                    className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                  >
                    <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: false, margin: "-50px" }}
                    className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                  >
                    <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 flex justify-start">
                  <div className="max-w-lg">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-xs sm:text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 block"
                    >
                      {data.subtitle}
                    </motion.span>
                    <motion.h2 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-6 leading-[1.05]"
                    >
                      {data.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-medium"
                    >
                      {data.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link to={data.to} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {data.btnText}
                        <ArrowRight weight="bold" size={16} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </section>
        ))}
      </div>

      {/* About Section */}
      <section className="py-24 md:py-32 bg-zinc-950 text-white px-6 lg:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: false }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-xs sm:text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6 block">About InsureEnsure</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-8 leading-[1.1]">
            We design policies guided by your vision, bringing together thoughtful coverage, collaboration, and creativity.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            By eliminating outdated bureaucracy and leveraging intelligent systems, we ensure that your insurance works seamlessly for how you actually live.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-zinc-950 border-t border-white/10 w-full text-white">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold tracking-tighter">
            InsureEnsure
          </div>
          <p className="text-sm font-medium text-zinc-500">
            &copy; 2026 InsureEnsure. Designed with precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
