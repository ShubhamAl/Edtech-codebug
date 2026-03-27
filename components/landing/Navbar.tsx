"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, ChevronDown, Building2, Menu, X, PlusCircle, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Neubrutalism Style Variables
  const blackBorder = "border-[2.5px] border-black";
  const hardShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-75";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-[#F9F4F1] border-b-[2.5px] border-black py-3" : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* LEFT: BRAND (Updated to Match Design Aesthetic) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`h-10 w-10 bg-[#8E97FD] ${blackBorder} rounded-xl ${hardShadow} flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300`}>
            <GraduationCap className="text-black w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="font-black tracking-tighter text-black text-xl md:text-2xl uppercase">
            Campus ++
          </span>
        </Link>

        {/* CENTER/RIGHT: DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <div
            className="relative"
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <button className="flex items-center gap-2 text-[15px] font-bold text-black hover:opacity-60 transition-opacity py-2">
              Institute
              <ChevronDown size={16} className={`transition-transform duration-300 ${isLoginOpen ? "rotate-180" : ""}`} strokeWidth={3} />
            </button>

            <AnimatePresence>
              {isLoginOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-72 bg-white ${blackBorder} rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3`}
                >
                  <InstituteOptions />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/institute-login"
            className={`bg-[#8E97FD] text-black px-8 py-2.5 rounded-full font-black text-sm ${blackBorder} ${hardShadow} ${hoverEffect} flex items-center gap-2`}
          >
            Faculty/Admin Login
            <div className="bg-black rounded-full p-1">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2.5 bg-[#FFD600] rounded-xl ${blackBorder} ${hardShadow}`}
        >
          {mobileMenuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
        </button>
      </div>

      {/* MOBILE MINI-DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-white border-[3px] border-black p-6 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="space-y-6">
              <Link
                href="/institute-login"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center w-full bg-[#8E97FD] text-black py-4 rounded-2xl font-black text-sm uppercase ${blackBorder} ${hardShadow}`}
              >
                Faculty/Admin Login <ArrowUpRight size={18} className="ml-2" />
              </Link>

              <div className="h-[2px] bg-black/10 mx-4" />

              <div className="px-2">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-4 ml-2">Institute Portals</p>
                <InstituteOptions onAction={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function InstituteOptions({ onAction }: { onAction?: () => void }) {
  const blackBorder = "border-[2.5px] border-black";

  return (
    <div className="space-y-2">
      <Link
        href="/institute-login"
        onClick={onAction}
        className="flex items-center gap-4 p-4 hover:bg-[#F9F4F1] rounded-2xl transition-all group"
      >
        <div className={`w-11 h-11 bg-white ${blackBorder} rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all`}>
          <Building2 size={22} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[9px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Organization</p>
          <p className="text-sm font-black text-black tracking-tight">Login Portal</p>
        </div>
      </Link>

      <div className="h-[2px] bg-black/5 mx-4" />

      <Link
        href="/institute-register"
        onClick={onAction}
        className="flex items-center gap-4 p-4 hover:bg-[#ecfdf5] rounded-2xl transition-all group"
      >
        <div className={`w-11 h-11 bg-[#A3E635] ${blackBorder} rounded-xl flex items-center justify-center text-black transition-all`}>
          <PlusCircle size={22} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[9px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Partnership</p>
          <p className="text-sm font-black text-black tracking-tight">Register Institute</p>
        </div>
      </Link>
    </div>
  );
}