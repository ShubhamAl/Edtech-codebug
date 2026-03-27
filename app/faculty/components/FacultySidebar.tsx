"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  Users,
  GraduationCap,
  X,
  LogOut,
  UserCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function FacultySidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/faculty", icon: LayoutDashboard },
    { name: "Upload Data", href: "/faculty/upload", icon: FileUp },
    { name: "Student Directory", href: "/faculty/students", icon: Users },
    { name: "Faculty Profile", href: "/faculty/profile", icon: UserCircle },
  ];

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110]
        w-72 sm:w-80 lg:w-80 
        bg-[#F9F4F1] dark:bg-zinc-950 
        ${blackBorder}
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0 " + hardShadow : "-translate-x-full"}
        flex flex-col p-8
      `}>

        {/* BRAND LOGO */}
        <div className="flex items-center justify-between mb-16 shrink-0">
          <div className="flex items-center gap-4 group cursor-default">
            <div className={`relative h-12 w-12 bg-[#8E97FD] ${blackBorder} rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <GraduationCap className="text-black w-7 h-7" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-black dark:text-white text-2xl uppercase leading-none">
                CAMPUS<span className="text-[#A3E635]">++</span>
              </span>
              <span className="text-[10px] font-black text-black/40 dark:text-white/40 tracking-[0.3em] uppercase mt-1">Faculty Node</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={`lg:hidden p-2 bg-white dark:bg-zinc-800 rounded-xl ${blackBorder} text-black dark:text-white`}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.4em] mb-6 px-2">
            Main Console
          </p>

          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <div className={`
                  group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 mb-3
                  ${isActive
                    ? `bg-[#A3E635] ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1`
                    : `hover:bg-white dark:hover:bg-zinc-900 border-2 border-transparent`}
                `}>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`
                      transition-all duration-200
                      ${isActive ? "text-black scale-110" : "text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white"}
                    `}>
                      <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 3 : 2.5} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest transition-colors
                      ${isActive ? "text-black" : "text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white"}`}>
                      {item.name}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div layoutId="sidebarZap" className="relative z-10">
                      <Zap className="w-4 h-4 text-black fill-black" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* STATUS CARD */}
        <div className={`mt-8 mb-8 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] ${blackBorder} relative overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity rotate-12">
            <ShieldCheck size={50} className="text-[#8E97FD]" />
          </div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[11px] font-black text-black dark:text-white uppercase tracking-tighter leading-none">Profile Integrity</span>
            <span className={`text-[10px] font-black text-black bg-[#A3E635] px-2 py-1 rounded-md border-2 border-black`}>85%</span>
          </div>

          <div className={`h-3 w-full bg-[#F9F4F1] dark:bg-zinc-800 rounded-full border-2 border-black dark:border-white overflow-hidden p-[2px]`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-[#8E97FD] rounded-full border-r-2 border-black dark:border-white"
            />
          </div>
          <p className="text-[10px] font-black text-black/40 dark:text-white/40 mt-4 uppercase tracking-widest leading-tight">
            Security Clearance Active.
          </p>
        </div>

        {/* SIGN OUT */}
        <div className="shrink-0 pt-2">
          <button
            onClick={handleSignOut}
            className={`group relative w-full flex items-center gap-4 p-5 rounded-2xl bg-[#FF6AC1] text-black font-black text-xs uppercase tracking-widest transition-all ${blackBorder} ${hardShadow} active:translate-x-[4px] active:translate-y-[4px] active:shadow-none overflow-hidden`}
          >
            <div className={`p-2 bg-white dark:bg-black/10 rounded-xl ${blackBorder}`}>
              <LogOut className="w-5 h-5" strokeWidth={3} />
            </div>
            <span>Secure Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}