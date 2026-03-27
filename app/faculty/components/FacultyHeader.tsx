"use client";

import Link from "next/link";
import {
  Menu,
  UserCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardTheme } from "../../../components/ThemeProvider";
import { logout } from "@/lib/auth";

interface FacultyHeaderProps {
  onOpenSidebar: () => void;
}

export default function FacultyHeader({ onOpenSidebar }: FacultyHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("Professor");

  const { theme, toggleTheme } = useDashboardTheme();

  const profileRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("user_name");
    if (storedName) setName(storedName);

    const handleScroll = () => setScrolled(window.scrollY > 15);
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-500 pointer-events-none">
      <div
        className={`
          mx-auto max-w-7xl flex items-center justify-between px-6 py-3
          rounded-2xl transition-all duration-500 ease-out pointer-events-auto
          ${blackBorder} ${hardShadow}
          ${scrolled
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl scale-[0.98]"
            : "bg-[#F9F4F1] dark:bg-zinc-900"
          }
        `}
      >
        {/* LEFT SECTION */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenSidebar}
            className={`lg:hidden p-2.5 rounded-xl bg-[#A3E635] ${blackBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`}
          >
            <Menu className="w-5 h-5 text-black" strokeWidth={3} />
          </button>

          <div className="relative group flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tighter text-black dark:text-white uppercase">
              FACULTY HUB
            </h1>
            <div className="h-2 w-2 rounded-full bg-[#A3E635] border-2 border-black dark:border-white" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl bg-white dark:bg-zinc-800 ${blackBorder} hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] group`}
          >
            {mounted && (theme === "dark" ? (
              <Sun size={18} className="text-yellow-400 group-hover:rotate-90 transition-transform" strokeWidth={3} />
            ) : (
              <Moon size={18} className="text-black group-hover:-rotate-12 transition-transform" strokeWidth={3} />
            ))}
          </button>

          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`group flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-black dark:bg-white ${blackBorder} transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}
            >
              <div className={`h-9 w-9 bg-[#8E97FD] rounded-lg ${blackBorder} flex items-center justify-center text-black`}>
                <UserCircle className="w-6 h-6" strokeWidth={3} />
              </div>

              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-[11px] font-black text-white dark:text-black uppercase tracking-tight">
                  {name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-black text-[#A3E635] dark:text-[#8E97FD] uppercase mt-0.5">Verified</span>
              </div>

              <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-500 ${isProfileOpen ? 'rotate-180 text-[#A3E635]' : 'text-white dark:text-black'}`} strokeWidth={4} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className={`absolute right-0 mt-4 w-64 origin-top-right bg-white dark:bg-zinc-900 rounded-2xl ${blackBorder} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-3 z-50`}
                >
                  <div className={`flex items-center gap-3 p-3 mb-3 bg-[#F9F4F1] dark:bg-zinc-800 rounded-xl ${blackBorder}`}>
                    <div className="h-10 w-10 rounded-lg bg-[#8E97FD] border-2 border-black flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-black" strokeWidth={3} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-[12px] font-black text-black dark:text-white truncate uppercase">{name}</p>
                      <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Faculty Node</p>
                    </div>
                  </div>

                  <Link href="/faculty/profile" className="block">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-[11px] font-black uppercase text-black dark:text-white hover:bg-[#FFD600] hover:text-black transition-all border-2 border-transparent hover:border-black group">
                      <Settings className="w-4 h-4 transition-transform group-hover:rotate-45" strokeWidth={3} />
                      Account Settings
                    </button>
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full mt-2 flex items-center gap-3 p-3 rounded-xl text-[11px] font-black uppercase bg-[#FF6AC1] text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={3} />
                    Secure Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}