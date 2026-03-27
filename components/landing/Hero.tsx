"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Bot, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center relative bg-[#F9F4F1] overflow-hidden pt-32 pb-20">

      {/* BACKGROUND DECORATIONS - Fixed Positioning for full width */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pink Circle (Left) */}
        <div className={`absolute left-[-40px] top-[20%] w-40 h-40 md:w-56 md:h-56 bg-[#FF6AC1] ${blackBorder} rounded-full z-0`} />

        {/* Yellow Circle (Bottom Right) */}
        <div className={`absolute right-[-20px] bottom-[15%] w-32 h-32 md:w-48 md:h-48 bg-[#FFD600] ${blackBorder} rounded-full z-0`} />

        {/* Floating Figma-style icon placeholder (Top Left) */}
        <div className={`absolute left-[15%] top-[10%] w-12 h-12 md:w-16 md:h-16 bg-[#8E97FD] ${blackBorder} rounded-xl rotate-12 flex items-center justify-center hidden md:flex`}>
          <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
        </div>
      </div>

      <div className="z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center">

        {/* VERSION BADGE - Pill Shape */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-3 px-6 py-2 rounded-full ${blackBorder} bg-white text-[11px] md:text-sm font-black uppercase tracking-widest mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#A3E635] border-2 border-black animate-pulse" />
          Campus++ Intelligence v1.0
          <ChevronRight size={16} strokeWidth={3} />
        </motion.div>

        {/* MAIN HERO TEXT - Massive & Bold */}
        <div className="relative mb-8 text-center w-full">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[13vw] md:text-[120px] lg:text-[150px] font-black leading-[0.85] tracking-tight text-black"
          >
            Design your <br />
            <span className="relative inline-block">
              dream career.
              {/* Green Underline stroke */}
              <div className="absolute -bottom-2 left-0 w-full h-4 md:h-6 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </motion.h1>
        </div>

        {/* SUBHEADING - Medium Weight */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-[750px] text-center text-black text-lg md:text-3xl font-bold leading-tight mb-14 px-4"
        >
          Personalized learning paths and AI-powered mentorship <br className="hidden md:block" />
          built for the next generation of professionals.
        </motion.p>

        {/* CTA BUTTONS - Large Pill Shapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full sm:w-auto"
        >
          <Link
            href="/institute-register"
            className={`group w-full sm:w-auto flex items-center justify-center gap-4 bg-[#FFD600] text-black px-12 py-6 rounded-full font-black text-base md:text-lg uppercase tracking-wider ${blackBorder} ${hardShadow} ${hoverEffect}`}
          >
            Register Institute
            <ArrowRight size={24} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />
          </Link>

          <Link
            href="/institute-login"
            className={`w-full sm:w-auto flex items-center justify-center gap-4 bg-[#8E97FD] text-black px-12 py-6 rounded-full font-black text-base md:text-lg uppercase tracking-wider ${blackBorder} ${hardShadow} ${hoverEffect}`}
          >
            <Bot size={24} strokeWidth={3} />
            Faculty Login
          </Link>
        </motion.div>

        {/* BOTTOM FEATURES - Floating Stickers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20"
        >
          {[
            { icon: Zap, text: "Fast Analysis", color: "#A3E635" },
            { icon: Sparkles, text: "AI Optimized", color: "#FF6AC1" },
            { icon: ShieldCheck, text: "Secure", color: "#63D2F3" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-${i % 2 === 0 ? '2' : '-2'}`}>
                <item.icon size={24} style={{ color: item.color }} strokeWidth={3} />
              </div>
              <span className="text-sm md:text-base font-black uppercase tracking-widest text-black">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}