import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Car,
  ChatCircleText,
  CheckCircle,
  ClipboardText,
  CurrencyInr,
  FileText,
  Heartbeat,
  HouseLine,
  Lightning,
  Receipt,
  Robot,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";

const HERO_IMAGE = "/hero-generated.png";

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionH2 = motion.h2;
const MotionP = motion.p;

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const coverageTypes = [
  { label: "Health", icon: Heartbeat, tone: "bg-emerald-50 text-emerald-800" },
  { label: "Motor", icon: Car, tone: "bg-sky-50 text-sky-800" },
  { label: "Term life", icon: ShieldCheck, tone: "bg-rose-50 text-rose-800" },
  { label: "Home", icon: HouseLine, tone: "bg-amber-50 text-amber-800" },
  { label: "Claims", icon: Receipt, tone: "bg-stone-100 text-stone-800" },
];

const recommendationSteps = [
  "Family, income, city and budget context",
  "Health, vehicle, home, travel and life priorities",
  "Plain-language comparison for India-first decisions",
  "Shortlist with reason codes, tradeoffs and next action",
];

const claimSteps = [
  { label: "Upload bills", detail: "PDF, images or receipts" },
  { label: "AI audit", detail: "Policy fit, missing proofs, risk flags" },
  { label: "Ready packet", detail: "Clear checklist before submission" },
];

const carouselItems = [
  { title: "Plain-language recommendations", text: "Health, motor, life and home cover explained without policy jargon.", icon: ChatCircleText },
  { title: "Document readiness", text: "Claim packets are checked for missing bills, prescriptions and proof gaps.", icon: ClipboardText },
  { title: "India-first choices", text: "Suggestions account for family structure, city, budget and renewal priorities.", icon: HouseLine },
  { title: "Actionable next steps", text: "Every output ends with what to compare, upload or ask next.", icon: ArrowRight },
];

function SectionShell({ id, eyebrow, title, copy, cta, to, children, reverse = false, tinted = false }) {
  return (
    <section
      id={id}
      className={`relative snap-start overflow-hidden px-5 py-16 text-zinc-950 sm:px-6 lg:px-12 lg:py-20 ${
        tinted ? "bg-[#eef7f1]" : "bg-[#fbfcf8]"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <MotionDiv
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.45 }}
          className={`${reverse ? "lg:order-2" : ""} max-w-2xl`}
        >
          <MotionSpan
            variants={reveal}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-800"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {eyebrow}
          </MotionSpan>
          <MotionH2
            variants={reveal}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </MotionH2>
          <MotionP
            variants={reveal}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-600 sm:text-lg"
          >
            {copy}
          </MotionP>
          <MotionDiv variants={reveal} className="mt-8">
            <Link
              to={to}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-900 active:translate-y-0 active:scale-[0.98]"
            >
              {cta}
              <ArrowRight weight="bold" size={17} />
            </Link>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.96, y: 38 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`${reverse ? "lg:order-1" : ""}`}
        >
          {children}
        </MotionDiv>
      </div>
    </section>
  );
}

function RecommendationVisual() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <MotionDiv
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.32)]"
      >
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Recommendation mix</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">Best-fit shortlist</h3>
              </div>
              <Sparkle className="text-emerald-700" weight="fill" size={25} />
            </div>
            <div className="mt-6 space-y-3">
              {coverageTypes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MotionDiv
                    key={item.label}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${item.tone}`}>
                        <Icon weight="bold" size={17} />
                      </span>
                      {item.label}
                    </span>
                    <span className="text-xs text-zinc-500">match</span>
                  </MotionDiv>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="rounded-[1.5rem] bg-[#dcefe5] p-5 text-emerald-950">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Plain language</p>
              <p className="mt-4 text-sm leading-relaxed text-emerald-950/75">
                Explains why a plan fits, what it leaves out, and where a cheaper option may be enough.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Inputs read</p>
              <div className="mt-5 space-y-3">
                {["Age 29", "Bengaluru", "Parents covered", "Car renewal"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle weight="fill" className="text-emerald-700" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}

function AdvisorVisual() {
  const messages = [
    ["You", "Can my parents use a separate senior citizen plan?"],
    ["Advisor", "Yes. I would compare co-pay, room rent limits and waiting periods before premium."],
    ["You", "Explain it in simple terms."],
  ];

  return (
    <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.32)]">
      <div className="rounded-[1.5rem] bg-[#edf7f1] p-5 text-zinc-950">
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white">
              <Robot weight="bold" size={23} />
            </div>
            <div>
              <p className="font-bold">Personal insurance agent</p>
              <p className="text-xs text-zinc-500">Online, policy-aware, India focused</p>
            </div>
          </div>
          <MotionSpan
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-bold text-emerald-800"
          >
            listening
          </MotionSpan>
        </div>

        <div className="mt-5 space-y-3">
          {messages.map(([from, text], index) => (
            <MotionDiv
              key={text}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                from === "Advisor" ? "bg-emerald-700 text-white" : "ml-auto bg-white text-zinc-800 shadow-sm"
              }`}
            >
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">{from}</span>
              {text}
            </MotionDiv>
          ))}
        </div>
      </div>

      <div className="grid gap-3 pt-4 sm:grid-cols-[1fr_1.4fr]">
        <div className="rounded-[1.25rem] border border-zinc-200 p-4">
          <ChatCircleText weight="bold" className="text-emerald-700" size={24} />
          <p className="mt-3 text-sm font-bold">Ask policy questions</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">Waiting period, exclusions, riders, co-pay, claim rules.</p>
        </div>
        <div className="rounded-[1.25rem] bg-zinc-100 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Suggested prompts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Decode my policy", "Compare two plans", "Find hidden limits"].map((prompt) => (
              <span key={prompt} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
                {prompt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimsVisual() {
  return (
    <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.32)]">
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 p-5">
          <FileText weight="bold" className="text-emerald-700" size={32} />
          <h3 className="mt-5 text-xl font-bold tracking-tight">Reimbursement packet</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">Upload receipts, prescriptions and discharge summaries before sending to your insurer.</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-200">
            <MotionDiv
              animate={{ x: ["-55%", "120%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-emerald-600"
            />
          </div>
        </div>
        <div className="space-y-3">
          {claimSteps.map((step, index) => (
            <MotionDiv
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1, duration: 0.55 }}
              className="flex items-center gap-4 rounded-[1.25rem] bg-zinc-50 p-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                {index === 0 ? <ClipboardText weight="bold" /> : index === 1 ? <Lightning weight="bold" /> : <CurrencyInr weight="bold" />}
              </span>
              <div>
                <p className="font-bold">{step.label}</p>
                <p className="text-sm text-zinc-500">{step.detail}</p>
              </div>
            </MotionDiv>
          ))}
          <div className="rounded-[1.25rem] bg-[#dcefe5] p-5 text-emerald-950">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Before submission</p>
            <p className="mt-3 text-sm leading-relaxed text-emerald-950/75">Flags missing documents early so users do not discover problems after days of waiting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselSection() {
  return (
    <section className="snap-start overflow-hidden bg-[#f6efe5] px-5 py-16 text-zinc-950 sm:px-6 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-amber-200 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-900">
              Product flow
            </span>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl">
              One journey from choosing cover to preparing a claim.
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed text-zinc-600">
            This section gives the page motion after reimbursement without interrupting the order you asked for.
          </p>
        </div>

        <div className="mt-10 overflow-hidden">
          <MotionDiv
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-4"
          >
            {[...carouselItems, ...carouselItems].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.title}-${index}`}
                  className="w-[280px] shrink-0 rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.4)] sm:w-[360px]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Icon weight="bold" size={22} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600">{item.text}</p>
                </div>
              );
            })}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="snap-start bg-[#fbfcf8] px-5 py-16 text-zinc-950 sm:px-6 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <span className="mb-5 inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-800">
            About us
          </span>
          <h2 className="text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl">
            We make insurance easier to understand before money or documents move.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Clear explanations", "Guided comparisons", "Claim readiness", "User-first design"].map((item, index) => (
            <MotionDiv
              key={item}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-[1.25rem] border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">0{index + 1}</p>
              <p className="mt-4 text-lg font-bold">{item}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Built to help people compare, ask, upload and act with less uncertainty.
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="snap-y snap-mandatory overflow-x-hidden bg-[#fbfcf8] text-zinc-950 antialiased selection:bg-emerald-800 selection:text-white">
      <MotionDiv
        className="fixed inset-0 z-[100] bg-emerald-950 pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <Navbar />

      <section className="relative flex min-h-[100dvh] snap-start flex-col justify-end overflow-hidden">
        <MotionDiv
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img src={HERO_IMAGE} alt="Family protected by insurance planning" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-emerald-950/20" />
          <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-emerald-950/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-emerald-950/90 via-emerald-950/55 to-transparent" />
        </MotionDiv>

        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-6 lg:px-12">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <MotionDiv
              initial={{ opacity: 0, y: 46 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              {currentUser?.displayName && (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Welcome back, {currentUser.displayName}
                </div>
              )}
              <h1 className="text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[5.25rem]">
                Insurance decisions without the fog.
              </h1>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md lg:justify-self-end"
            >
              <p className="text-base font-medium leading-relaxed text-white/78">
                Recommendations, policy conversations and reimbursement checks in one guided path, written for real Indian households rather than insurance insiders.
              </p>
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex items-center justify-between border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          >
            <span>InsureEnsure</span>
            <a href="#recommendations" className="flex items-center gap-2 transition hover:text-white">
              Explore
              <ArrowDown weight="bold" size={14} className="animate-bounce" />
            </a>
          </MotionDiv>
        </div>
      </section>

      <SectionShell
        id="recommendations"
        eyebrow="Recommendation engine"
        title="Find the right cover across the policies people actually buy."
        copy="The recommendation flow now feels like a guided shortlist instead of a single image and button. It can speak plainly about health, motor, life, home, travel and commercial cover while showing why each option fits."
        cta="Build my recommendation"
        to="/recommendation"
        tinted
      >
        <RecommendationVisual />
        <MotionDiv
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.2fr]"
        >
          {recommendationSteps.map((step, index) => (
            <MotionDiv
              key={step}
              variants={reveal}
              className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm font-semibold text-zinc-700 backdrop-blur"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-[11px] font-black text-white">
                {index + 1}
              </span>
              {step}
            </MotionDiv>
          ))}
        </MotionDiv>
      </SectionShell>

      <SectionShell
        id="advisor"
        eyebrow="AI advisor"
        title="A personal insurance agent that answers before confusion grows."
        copy="The advisor section now carries actual interaction: policy queries, suggested prompts and a live chat surface. It positions the assistant as practical help for everyday insurance doubts, not a decorative chatbot."
        cta="Ask the advisor"
        to="/chatbot"
        reverse
      >
        <AdvisorVisual />
      </SectionShell>

      <SectionShell
        id="reimbursement"
        eyebrow="Reimbursement"
        title="Catch claim problems before the insurer does."
        copy="Instead of asking users to upload and hope, the reimbursement flow now previews a proper packet: document checks, missing-proof warnings and a ready-to-submit path that reduces avoidable delays."
        cta="Start a claim check"
        to="/reimbursement"
        tinted
      >
        <ClaimsVisual />
      </SectionShell>

      <CarouselSection />
      <AboutSection />

      <footer className="snap-start bg-[#eef7f1] px-6 py-10 text-zinc-950 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 border-t border-emerald-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold tracking-tight">InsureEnsure</div>
          <p className="text-sm font-medium text-zinc-500">&copy; 2026 InsureEnsure. Designed with precision.</p>
        </div>
      </footer>
    </div>
  );
}
