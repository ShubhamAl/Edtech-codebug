"use client";

import {
  Menu,
  UserCircle,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardTheme } from "../../../components/ThemeProvider";
import { logout } from "@/lib/auth";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("Admin");

  const { theme, toggleTheme } = useDashboardTheme();
  const profileRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = sessionStorage.getItem("user_name") || localStorage.getItem("user_name");
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
    <header className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-500">
      <div
        className={`
          mx-auto max-w-7xl flex items-center justify-between px-6 py-2.5
          rounded-2xl border transition-all duration-500 ease-out
          ${scrolled
            ? "bg-white/40 dark:bg-zinc-950/40 backdrop-blur-2xl border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[0.98]"
            : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200 dark:border-zinc-800 shadow-sm"
          }
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all active:scale-90"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-zinc-300" strokeWidth={2} />
          </button>

          <div className="relative group">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
                ADMIN
              </span>
              <span className="opacity-40 font-light">/</span>
              <span className="text-[11px] tracking-[0.3em] font-bold opacity-70">CONSOLE</span>
            </h1>
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500 transition-all group-hover:w-full" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors group"
          >
            {mounted && (theme === "dark" ? (
              <Sun size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-transform group-hover:rotate-90" />
            ) : (
              <Moon size={18} className="text-slate-500 transition-transform group-hover:-rotate-12" />
            ))}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="group flex items-center gap-3 p-1 pr-4 rounded-xl bg-slate-900 dark:bg-white transition-all hover:ring-4 hover:ring-violet-500/20"
            >
              <div className="h-9 w-9 bg-violet-500 rounded-lg flex items-center justify-center text-white shadow-inner">
                <UserCircle className="w-6 h-6" strokeWidth={2} />
              </div>

              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-[10px] font-black text-white dark:text-slate-900 uppercase tracking-tighter">
                  {name}
                </span>
                <span className="text-[8px] font-bold text-violet-400 dark:text-slate-500 uppercase mt-0.5">Master Admin</span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-500 ${isProfileOpen ? 'rotate-180 text-violet-400' : 'text-slate-400'}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 origin-top-right bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-zinc-800 p-2 z-50"
                >
                  <div className="flex items-center gap-3 p-3 mb-2 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-[11px] font-black text-slate-800 dark:text-white truncate uppercase">{name}</p>
                      <p className="text-[9px] font-medium text-violet-500">Master Admin</p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full mt-1 flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
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
