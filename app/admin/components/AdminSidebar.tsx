"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  X,
  LogOut,
  ShieldCheck,
  Zap,
  UserCog,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Faculty", href: "/admin/faculty", icon: UserCog },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Insights", href: "/admin/insights", icon: BarChart3 },
  ];

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
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110]
        w-72 sm:w-80 lg:w-72 
        bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl 
        border-r border-slate-200/50 dark:border-white/5
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.1)]" : "-translate-x-full"}
        flex flex-col p-6
      `}>

        {/* BRAND LOGO */}
        <div className="flex items-center justify-between mb-12 px-2 shrink-0">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-xl">
                <GraduationCap className="text-violet-400 dark:text-slate-900 w-6 h-6" strokeWidth={2} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-slate-900 dark:text-white text-xl uppercase leading-none">
                CAMPUS<span className="text-violet-500">++</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 dark:text-zinc-500 tracking-[0.3em] uppercase mt-1">Admin Console</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* ROLE BADGE */}
        <div className="mb-6 mx-2 flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 rounded-2xl px-4 py-2.5">
          <ShieldCheck size={14} className="text-violet-500" />
          <span className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.3em]">Master Admin</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <div className="flex items-center gap-2 px-4 mb-6">
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-zinc-800" />
            <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">
              Navigation
            </p>
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-zinc-800" />
          </div>

          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <div className={`
                  group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 mb-2 overflow-hidden
                  ${isActive
                    ? "bg-slate-900 dark:bg-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                    : "hover:bg-slate-100 dark:hover:bg-zinc-900/50"}
                `}>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-50" />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`
                      p-2 rounded-lg transition-all duration-300
                      ${isActive
                        ? "text-violet-400 scale-110"
                        : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-110"}
                    `}>
                      <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors
                      ${isActive
                        ? "text-white dark:text-slate-900"
                        : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                      {item.name}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div layoutId="adminActiveArrow" className="relative z-10">
                      <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* SYSTEM STATUS */}
        <div className="mt-6 mb-6 p-5 bg-slate-50 dark:bg-zinc-900/40 rounded-3xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={40} className="text-violet-500" />
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin Access</span>
            <span className="text-[10px] font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-violet-500 shadow-[0_0_10px_#8B5CF6]"
            />
          </div>
          <p className="text-[8px] font-bold text-slate-400 dark:text-zinc-500 mt-3 uppercase tracking-widest leading-tight">
            Full system access granted.
          </p>
        </div>

        {/* SIGN OUT */}
        <div className="shrink-0 pt-2">
          <button
            onClick={handleSignOut}
            className="group relative w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_10px_30px_rgba(244,63,94,0.3)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-rose-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

            <div className="relative z-10 p-2 bg-white/10 dark:bg-slate-900/10 rounded-xl group-hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="relative z-10 group-hover:text-white">Secure Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
