"use client";

import React from "react";
import {
  Brain,
  FileText,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

/* =========================
   Framer Motion Variants
========================= */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* =========================
   Component
========================= */

export default function Features() {
  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";

  return (
    <section className="w-full py-32 bg-[#F9F4F1] relative overflow-hidden">
      {/* Background Decor - Playful Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 -left-10 w-40 h-40 bg-[#FF6AC1] ${blackBorder} rounded-full opacity-10 rotate-12`} />
        <div className={`absolute bottom-20 -right-10 w-56 h-56 bg-[#FFD600] ${blackBorder} rounded-full opacity-10 -rotate-12`} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 space-y-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-3 px-6 py-2 bg-white ${blackBorder} rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black`}
          >
            <Sparkles size={16} className="text-[#8E97FD]" strokeWidth={3} />
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">
              Core Intelligence
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-[0.85]">
            The Power of <br />
            <span className="relative inline-block mt-2">
              Next-Gen Learning
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h2>

          <p className="text-black text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-tight opacity-70">
            Campus++ isn&apos;t just a platform; it&apos;s a high-performance engine designed to
            propel your career into the future.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10 lg:gap-14"
        >
          <Feature
            icon={<Brain size={40} strokeWidth={2.5} />}
            title="AI Learning Path"
            desc="A data-driven roadmap that evolves with your progress, ensuring you're always on the fastest route to mastery."
            color="#A3E635"
          />

          <Feature
            icon={<FileText size={40} strokeWidth={2.5} />}
            title="Resume Analyzer"
            desc="Instantly score your resume against real-world job descriptions to crush the ATS and get the interview."
            color="#63D2F3"
          />

          <Feature
            icon={<MessageCircle size={40} strokeWidth={2.5} />}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* =========================
   Feature Card
========================= */

function Feature({
  icon,
  title = "AI Career Chatbot",
  desc = "Your personal 24/7 mentor. Real-time advice on networking, negotiations, and technical roadmaps.",
  color = "#8E97FD",
}: {
  icon: React.ReactNode;
  title?: string;
  desc?: string;
  color?: string;
}) {
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]";

  return (
    <motion.div
      variants={itemVariants}
      className={`group relative bg-white ${blackBorder} p-10 rounded-[3rem] ${hardShadow} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 overflow-hidden`}
    >
      {/* Icon */}
      <div
        style={{ backgroundColor: color }}
        className={`w-24 h-24 rounded-[2rem] ${blackBorder} flex items-center justify-center text-black mb-10 transform group-hover:rotate-[8deg] group-hover:scale-105 transition-all duration-500`}
      >
        {icon}
      </div>

      <div className="space-y-6">
        <h3 className="text-4xl font-black text-black tracking-tight leading-[0.9] group-hover:text-[#8E97FD] transition-colors">
          {title}
        </h3>
        <p className="text-black font-bold text-lg leading-tight opacity-60">
          {desc}
        </p>
      </div>

      <div className="mt-10 pt-8 border-t-[2px] border-black/10 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
          Initialize Module
        </span>
        <div className={`p-3 bg-white ${blackBorder} rounded-xl group-hover:bg-[#FFD600] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none`}>
          <ArrowUpRight size={20} strokeWidth={3} className="text-black" />
        </div>
      </div>
    </motion.div>
  );
}