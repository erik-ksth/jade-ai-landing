'use client';

import Image from "next/image";
import JadeAI from "../../public/JadeAI.png";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Spotlight } from "@/components/ui/spotlight-new";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Sparkles, BarChart3, MessageSquareText, Brain } from "lucide-react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 120,
      damping: 22,
    },
  }),
};

const sectionTitleVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      mass: 0.8,
      delay: i * 0.06,
    },
  }),
};

const floatingGlowVariants: Variants = {
  animate: (custom = 0) => ({
    y: [0, 20, 0],
    rotate: [0, 6, -6, 0],
    transition: {
      duration: 12 + custom,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const SectionDivider = () => (
  <div className="relative mx-auto my-24 h-px w-full max-w-6xl z-100">
    <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent blur-sm" />
    <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />
  </div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500 z-60"
        style={{ scaleX: scrollProgress }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/50 backdrop-blur-lg z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src={JadeAI}
                alt="JadeAI Logo"
                width={120}
                height={30}
                priority
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-emerald-400 transition-colors">How It Works</a>
              <a href="#waitlist" className="px-6 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors">
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center pt-32 pb-28 px-6 sm:px-10 lg:px-16 overflow-hidden"
        initial="hidden"
        animate="visible"
      >
        <Spotlight />
        <BackgroundRippleEffect />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-b from-transparent via-[#020617]/85 to-[#040a16] z-10" />
        <div className="max-w-5xl mx-auto relative z-20">
          <motion.div className="text-center space-y-6">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 text-sm font-medium border border-emerald-500/20"
              variants={heroItemVariants}
              custom={0}
            >
              🏆 Winner - Groq: Best Use of Groq at Cal Hacks 12.0
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight"
              variants={heroItemVariants}
              custom={1}
            >
              JadeAI
            </motion.h1>

            <motion.p
              className="text-2xl sm:text-3xl text-slate-200 font-semibold"
              variants={heroItemVariants}
              custom={2}
            >
              Your Conversational Data Analyst
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
              variants={heroItemVariants}
              custom={3}
            >
              Tired of spending 70% of your time cleaning data? JadeAI is an intelligent, all-in-one platform that lets you clean, analyze, and visualize your data using simple English commands. No code, no app-switching -- just results.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto pt-4"
              variants={heroItemVariants}
              custom={4}
            >
              <motion.input
                type="email"
                name="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full sm:flex-1 px-6 py-4 rounded-full bg-slate-900/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition relative z-10"
                whileFocus={{
                  boxShadow: "0px 0px 20px rgba(16, 185, 129, 0.35)",
                  borderColor: "rgb(52 211 153)",
                }}
              />
              <motion.button
                type="button"
                className="px-8 py-4 rounded-full bg-emerald-500 text-slate-950 font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Join Waitlist
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="relative -mt-24 sm:-mt-32 py-32 px-6 sm:px-10 lg:px-16 overflow-hidden bg-linear-to-b from-[#040a16] to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="absolute inset-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-24" variants={sectionTitleVariants}>
            <motion.h2 className="text-5xl font-bold text-white mb-6">
              How JadeAI Works
            </motion.h2>
            <motion.p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From raw data to clean insights — all in one smooth, conversational flow.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload or Connect",
                desc: "Bring in your CSVs, spreadsheets, or connect your databases. JadeAI adapts instantly to your structure.",
              },
              {
                step: "02",
                title: "Chat & Clean",
                desc: "Use simple language to clean and prepare your data — JadeAI automates missing values, outliers, and reformatting.",
              },
              {
                step: "03",
                title: "Analyze & Visualize",
                desc: "Ask questions, generate charts, and summarize insights instantly — no code, no setup, just clarity.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                className={`
            group relative overflow-hidden rounded-[28px] border border-white/10
            bg-slate-950/70 px-8 py-10 backdrop-blur-xl
            shadow-[0_35px_80px_rgba(15,23,42,0.45)]
            transition-all duration-400 hover:border-emerald-400/60
            hover:-translate-y-2 hover:shadow-[0_40px_90px_rgba(15,23,42,0.55)]
          `}
                variants={cardVariants}
                custom={i}
                style={{ transformPerspective: 1200 }}
                whileHover={{ rotateX: 1, rotateY: -1, scale: 1.02 }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-60 bg-linear-to-br from-emerald-500/15 via-transparent to-sky-500/15"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl"
                  variants={floatingGlowVariants}
                  animate="animate"
                  custom={i * 2}
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-sky-400/12 blur-3xl"
                  variants={floatingGlowVariants}
                  animate="animate"
                  custom={i * 3 + 1}
                />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-200 uppercase tracking-[0.3em]">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-300" />
                    {s.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-[15px]">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <SectionDivider />

      {/* Features Section */}
      <motion.section
        id="features"
        className="relative py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute inset-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-24" variants={sectionTitleVariants}>
            <motion.h2 className="text-5xl font-bold text-white mb-6">
              All Features in One Place
            </motion.h2>
            <motion.p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Clean, analyze, and visualize — JadeAI brings every data task into one effortless conversational flow.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Smart Data Cleaning",
                desc: "Fix missing values, duplicates, and formatting issues with one command. JadeAI cleans intelligently and consistently.",
                example: "“Clean the entire dataset and fix column types.”",
                icon: Sparkles,
              },
              {
                title: "Conversational Analysis",
                desc: "Ask questions in plain English — JadeAI understands and delivers results without you touching SQL or code.",
                example: "“What’s the average salary by department?”",
                icon: MessageSquareText,
              },
              {
                title: "Instant Visualizations",
                desc: "Generate elegant charts and summaries instantly — no setup, no manual charting.",
                example: "“Show a bar chart of revenue by region.”",
                icon: BarChart3,
              },
              {
                title: "Seamless Workflow",
                desc: "Upload files, connect databases, and summarize insights all in one smooth, focused workspace.",
                example: "“Summarize the top insights from this data.”",
                icon: Brain,
              },
              {
                title: "AI Insights",
                desc: "Let JadeAI detect trends, correlations, and anomalies automatically, saving hours of manual digging.",
                example: "“Find unusual spending patterns.”",
                icon: Sparkles,
              },
              {
                title: "Export & Share",
                desc: "Download clean data or export interactive dashboards instantly for reports and presentations.",
                example: "“Export this summary as a PDF.”",
                icon: MessageSquareText,
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                className={`
            group relative overflow-hidden rounded-[28px] border border-white/10
            bg-slate-950/70 px-8 py-9 backdrop-blur-xl
            shadow-[0_35px_80px_rgba(15,23,42,0.45)]
            transition-all duration-400 hover:border-emerald-400/60
            hover:-translate-y-2 hover:shadow-[0_40px_90px_rgba(15,23,42,0.55)]
          `}
                variants={cardVariants}
                custom={i}
                whileHover={{ translateY: -8, rotateX: 2, rotateY: -2 }}
                style={{ transformPerspective: 1200 }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-60 bg-linear-to-br from-emerald-500/15 via-transparent to-sky-500/15"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl"
                  variants={floatingGlowVariants}
                  animate="animate"
                  custom={i * 2}
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-sky-400/12 blur-3xl"
                  variants={floatingGlowVariants}
                  animate="animate"
                  custom={i * 3 + 2}
                />
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_18px_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-110">
                      <f.icon className="w-8 h-8 text-white opacity-90" />
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-emerald-200 uppercase">
                      Jade
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{f.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-[15px]">{f.desc}</p>
                  </div>
                  <p className="text-slate-300/75 text-sm font-mono italic">
                    {f.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Fixed Size */}
      <section id="waitlist" className="relative flex items-center justify-center w-screen h-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <WavyBackground
          className="px-8 py-12 flex flex-col items-center text-center gap-5 w-screen"
          backgroundFill="#020617"
          waveOpacity={0.2}
          blur={10}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-2xl leading-tight">
            Ready to Transform Your Data Analysis?
          </h2>
          <p className="text-lg text-slate-300 max-w-xl">
            Stop wasting time on data cleaning. Start analyzing with JadeAI today.
          </p>
          <div className="flex w-full flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/10 text-white placeholder:text-slate-300 border border-white/20 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/40 transition backdrop-blur-sm"
            />
            <button
              type="button"
              className="px-7 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30 whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </div>
        </WavyBackground>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="text-center flex flex-col items-center md:text-center">
              <Image
                src={JadeAI}
                alt="JadeAI Logo"
                width={120}
                height={30}
                className="h-8 w-auto mx-auto md:mx-0"
              />
              <p className="text-slate-400 mt-2 text-sm">
                Cursor for Data Analysis
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} JadeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}