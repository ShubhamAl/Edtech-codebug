"use client";

import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  return (
    <footer className="w-full bg-[#F9F4F1] border-t-[3px] border-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className={`absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF6AC1] ${blackBorder} rounded-full rotate-12`} />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 space-y-10">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className={`h-12 w-12 bg-[#8E97FD] rounded-2xl ${blackBorder} ${hardShadow} flex items-center justify-center transition-transform group-hover:rotate-6`}>
                <GraduationCap className="text-black w-7 h-7" strokeWidth={3} />
              </div>
              <span className="font-black tracking-tighter text-black text-3xl uppercase">
                Campus++
              </span>
            </div>

            <p className="max-w-xs text-sm font-bold text-black leading-tight uppercase tracking-wider opacity-60">
              Empowering the next generation of professionals with high-intelligence career tools and AI roadmaps.
            </p>

            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, x: -2 }}
                  className={`w-12 h-12 rounded-xl bg-white ${blackBorder} flex items-center justify-center text-black hover:bg-[#FFD600] transition-all ${hardShadow} hover:shadow-none`}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[12px] font-black text-black uppercase tracking-[0.3em] bg-[#A3E635] inline-block px-2 py-1 border-2 border-black">Portals</h4>
              <ul className="space-y-5">
                <FooterLink href="/institute-login" label="Faculty Portal" />
                <FooterLink href="/institute-register" label="Register Institute" />
                <FooterLink href="/faculty" label="Admin Dashboard" />
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[12px] font-black text-black uppercase tracking-[0.3em] bg-[#63D2F3] inline-block px-2 py-1 border-2 border-black">Company</h4>
              <ul className="space-y-5">
                <FooterLink href="#" label="Our Vision" />
                <FooterLink href="#" label="Privacy Policy" />
                <FooterLink href="#" label="Terms of Service" />
              </ul>
            </div>

            <div className="space-y-8 col-span-1">
              <h4 className="text-[12px] font-black text-black uppercase tracking-[0.3em] bg-[#FF6AC1] inline-block px-2 py-1 border-2 border-black">Support</h4>
              <div className={`bg-white ${blackBorder} p-6 rounded-[2rem] ${hardShadow} space-y-5`}>
                <p className="text-[11px] font-black text-black uppercase leading-tight opacity-50">
                  Have a question or need assistance?
                </p>
                <a
                  href="mailto:support@campuspp.com"
                  className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-widest hover:text-[#8E97FD] transition-colors"
                >
                  <div className={`p-2 bg-[#FFD600] ${blackBorder} rounded-lg`}>
                    <Mail size={16} strokeWidth={3} />
                  </div>
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <p className="text-[11px] font-black text-black uppercase tracking-[0.4em]">
              © 2026 Campus++ Core
            </p>
            <div className="h-4 w-[2px] bg-black hidden md:block" />
            <p className="text-[11px] font-black text-black uppercase tracking-widest opacity-40">
              STABLE BUILD v1.0.4
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className={`flex items-center gap-3 px-4 py-2 bg-white ${blackBorder} rounded-full`}>
              <div className="w-2.5 h-2.5 bg-[#A3E635] rounded-full border border-black animate-pulse" />
              <span className="text-[10px] font-black text-black uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-[13px] font-black text-black uppercase tracking-wider hover:translate-x-1 transition-all"
      >
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all text-[#8E97FD]" strokeWidth={3} />
      </Link>
    </li>
  );
}