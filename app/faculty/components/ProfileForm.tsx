"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  School,
  BookOpen,
  ShieldCheck,
  Check,
  Award,
  Loader2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FacultyProfile() {
  const [profile, setProfile] = useState({
    name: "Faculty Member",
    email: "faculty@nexus.edu",
    department: "Computer Science & Engineering",
    designation: "Senior Lecturer",
    cabin: "A-402, Tech Block",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Neubrutalism Design System Tokens
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");

    if (storedName || storedEmail) {
      setProfile((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }));
    }
  }, []);

  const inputBase = `w-full bg-[#F9F4F1] dark:bg-zinc-900 ${blackBorder} rounded-2xl py-4 px-5 pl-14 text-sm font-bold text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-800 transition-all appearance-none`;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* ── HEADER SECTION ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-[#A3E635] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
                <User size={20} className="text-black" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Nexus / Identity</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-none p-2">
              Faculty <br />
              <span className="relative inline-block mt-2">
                Profile.
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#8E97FD] -z-10 -rotate-1" />
              </span>
            </h1>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 bg-[#A3E635] ${blackBorder} rounded-2xl ${hardShadow}`}>
            <ShieldCheck size={20} className="text-black" strokeWidth={3} />
            <span className="text-[11px] font-black text-black uppercase tracking-widest">Security Clearance Active</span>
          </div>
        </div>

        {/* ── PROFILE CARD ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white dark:bg-zinc-900 ${blackBorder} ${hardShadow} rounded-[3rem] p-8 md:p-12 relative overflow-hidden`}
        >
          {/* Decorative Corner Element */}
          <div className="absolute -top-6 -right-6 p-12 bg-[#FFD600] border-l-[3px] border-b-[3px] border-black rounded-bl-[4rem] opacity-20 rotate-12" />

          <div className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Full Name */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Legal Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
                  <input
                    className={inputBase}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Nexus Uplink</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20" size={20} strokeWidth={3} />
                  <input
                    className={`${inputBase} opacity-40 cursor-not-allowed italic bg-black/5`}
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Department Node</label>
                <div className="relative group">
                  <School className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
                  <select
                    className={inputBase}
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Rank / Designation</label>
                <div className="relative group">
                  <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
                  <input
                    className={inputBase}
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Operational Cabin</label>
              <div className="relative group">
                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
                <input
                  className={inputBase}
                  placeholder="Sector / Block / Room"
                  value={profile.cabin}
                  onChange={(e) => setProfile({ ...profile, cabin: e.target.value })}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full relative h-20 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${blackBorder}
                  ${saved
                    ? "bg-[#A3E635] text-black shadow-none translate-x-[2px] translate-y-[2px]"
                    : `bg-[#FFD600] text-black ${hardShadow} ${hoverEffect} disabled:opacity-50`
                  }`}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                ) : saved ? (
                  <>
                    <Check size={24} strokeWidth={4} />
                    Integrity Verified
                  </>
                ) : (
                  <>
                    Update Dossier
                    <Zap size={20} strokeWidth={3} fill="currentColor" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-center text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">
          Nexus Official Personnel Record v4.0.2
        </p>
      </div>
    </div>
  );
}