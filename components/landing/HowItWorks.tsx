"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Cpu, Rocket, UserPlus, Sparkles, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#F9F4F1] relative overflow-hidden">
      {/* Background Decor - Playful Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-20 w-64 h-64 bg-[#FF6AC1] ${blackBorder} rounded-full opacity-20 rotate-12`} />
        <div className={`absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FFD600] ${blackBorder} rounded-full opacity-20 -rotate-12`} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* SECTION HEADER */}
        <div className="text-center mb-28 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-3 px-6 py-2 bg-white ${blackBorder} rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            <Sparkles size={16} className="text-[#8E97FD]" strokeWidth={3} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">The Roadmap</span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">
            Three Steps to <br />
            <span className="relative inline-block mt-2">
              Mastery.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h2>
        </div>

        <div className="relative w-full max-w-5xl">
          {/* Animated Curly Path SVG - Updated Colors */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-full hidden md:block h-full pointer-events-none">
            <svg
              viewBox="0 0 400 1000"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <motion.path
                d="M 200 0 C 450 150, -50 350, 200 500 C 450 650, -50 850, 200 1000"
                stroke="black"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="16 16"
                style={{ pathLength }}
                className="opacity-10"
              />
              <motion.path
                d="M 200 0 C 450 150, -50 350, 200 500 C 450 650, -50 850, 200 1000"
                stroke="#8E97FD"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>
          </div>

          <div className="space-y-32 md:space-y-48">
            <Step
              step="01"
              title="Onboarding"
              text="Create your digital profile and define your dream career goals. We set the foundation for your evolution."
              icon={<UserPlus size={28} strokeWidth={3} />}
              align="left"
              color="#FF6AC1"
            />
            <Step
              step="02"
              title="AI Analysis"
              text="Our engine generates a personalized learning roadmap based on industry gaps and your unique potential."
              icon={<Cpu size={28} strokeWidth={3} />}
              align="right"
              color="#A3E635"
            />
            <Step
              step="03"
              title="Execution"
              text="Optimize your resume and skills with real-time AI mentoring. Forge your path to the top."
              icon={<Rocket size={28} strokeWidth={3} />}
              align="left"
              color="#8E97FD"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ step, title, text, icon, align, color }: any) {
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]";

  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col md:flex-row items-center justify-between gap-12 w-full ${align === "right" ? "md:flex-row-reverse" : ""
        }`}
    >
      {/* Content Card */}
      <div className="w-full md:w-[45%] z-20">
        <div className={`group bg-white ${blackBorder} p-10 rounded-[2.5rem] ${hardShadow} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150`}>
          <div className="flex items-center gap-5 mb-6">
            <div className={`px-4 py-1.5 bg-black rounded-full text-[12px] font-black text-white tracking-[0.2em]`}>
              STEP {step}
            </div>
            <h3 className="text-4xl font-black text-black tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-black text-lg font-bold leading-tight opacity-70">{text}</p>

          <div className="mt-8 flex items-center gap-2 text-black font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Learn More <ChevronRight size={16} strokeWidth={4} />
          </div>
        </div>
      </div>

      {/* Center Icon Block */}
      <div className="relative z-30">
        <div
          className={`w-20 h-20 rounded-3xl ${blackBorder} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black transform rotate-12 hover:rotate-0 transition-transform duration-500 cursor-default`}
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>

      <div className="hidden md:block w-[45%]" />
    </motion.div>
  );
}