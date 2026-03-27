"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150";

  return (
    <section className="w-full py-32 bg-[#F9F4F1] relative overflow-hidden">
      {/* Dynamic Background Accents - Shapes from the design */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-[#FF6AC1] ${blackBorder} rounded-full opacity-20 rotate-12`} />
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-[#FFD600] ${blackBorder} rounded-full opacity-20 -rotate-12`} />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`bg-white ${blackBorder} rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden ${hardShadow}`}
        >
          {/* Top Badge */}
          <div className="flex justify-center mb-10">
            <div className={`inline-flex items-center gap-3 px-6 py-2.5 bg-white ${blackBorder} rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <Sparkles size={18} className="text-[#8E97FD]" strokeWidth={3} />
              <span className="text-[11px] font-black text-black uppercase tracking-[0.3em]">Join the Ecosystem</span>
            </div>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter mb-8 leading-[0.85]">
            Access the <br />
            <span className="relative inline-block mt-2">
              Campus++ Portal.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h2>

          <p className="mt-8 text-black font-bold text-xl md:text-2xl max-w-2xl mx-auto leading-tight opacity-70">
            Campus++ now supports institute operations only.
            Use faculty/admin access to manage students, risk, and interventions.
          </p>

          {/* Action Buttons - Reverted to your logic with new styling */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
            <Link
              href="/institute-login"
              className={`group w-full md:w-auto inline-flex items-center justify-center gap-4 bg-[#8E97FD] text-black px-12 py-6 rounded-full font-black text-base uppercase tracking-widest ${blackBorder} ${hardShadow} ${hoverEffect}`}
            >
              <Building2 size={24} strokeWidth={3} />
              Faculty Login
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" strokeWidth={3} />
            </Link>

            <Link
              href="/institute-register"
              className={`group w-full md:w-auto inline-flex items-center justify-center gap-4 bg-[#FFD600] text-black px-12 py-6 rounded-full font-black text-base uppercase tracking-widest ${blackBorder} ${hardShadow} ${hoverEffect}`}
            >
              <Sparkles size={24} className="text-black" strokeWidth={3} />
              Register Institute
            </Link>
          </div>

          {/* Verification Note */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#A3E635] border border-black animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-black opacity-40">Official Academic Gateway</span>
          </div>

          {/* Decorative Corner Glows */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#8E97FD]/10 blur-[100px] rounded-full" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#FF6AC1]/10 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}