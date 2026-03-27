"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";
import {
  Building2,
  Mail,
  Lock,
  User,
  Zap,
  School,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InstituteRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    instituteName: "",
  });
  const [loading, setLoading] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  const handleRegister = async () => {
    const { name, email, password, instituteName } = form;

    if (!name || !email || !password || !instituteName) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await apiRequest("/auth/insti-register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role: "admin",
          instituteName,
        }),
      });

      setToken(res.token);
      localStorage.setItem("user_name", res.user?.name || name);
      localStorage.setItem("user_email", res.user?.email || email);
      localStorage.setItem("user_role", (res.user?.role || "admin").toLowerCase());
      localStorage.setItem("institute_id", res.user?.instituteId || "");

      sessionStorage.setItem("user_name", res.user?.name || name);
      sessionStorage.setItem("user_email", res.user?.email || email);
      sessionStorage.setItem("user_role", (res.user?.role || "admin").toLowerCase());
      sessionStorage.setItem("institute_id", res.user?.instituteId || "");

      router.push("/admin");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Institute registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-64 h-64 bg-[#A3E635] ${blackBorder} rounded-full opacity-20 rotate-12`} />
        <div className={`absolute -bottom-20 -right-20 w-80 h-80 bg-[#8E97FD] ${blackBorder} rounded-full opacity-20 -rotate-12`} />
      </div>

      <div className="w-full max-w-[460px] z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-6 mb-10"
        >
          <div className={`w-20 h-20 bg-[#A3E635] rounded-2xl ${blackBorder} flex items-center justify-center ${hardShadow} rotate-3`}>
            <Building2 className="text-black w-10 h-10" strokeWidth={2.5} />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-none">
              Institute <span className="text-[#A3E635]">Register</span>
            </h1>
            <div className="relative inline-block mt-1">
              <span className="text-[10px] font-black text-black uppercase tracking-widest bg-[#8E97FD] px-3 py-1 border-2 border-black text-white">
                Create Admin Account
              </span>
            </div>
          </div>
        </motion.div>

        {/* Toggle Nav Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex bg-white ${blackBorder} p-1.5 rounded-2xl mb-8 ${hardShadow}`}
        >
          <Link href="/institute-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Faculty
          </Link>
          <Link href="/admin-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Admin
          </Link>
          <div className="flex-1 text-center py-3 bg-[#A3E635] border-2 border-black rounded-xl text-[10px] font-black uppercase text-black cursor-default">
            Register
          </div>
        </motion.div>

        {/* Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white ${blackBorder} p-8 md:p-10 rounded-[2.5rem] ${hardShadow} space-y-6`}
        >
          {/* Admin Name */}
          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                placeholder="Admin Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-4 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
              />
            </div>
          </div>

          {/* Institute Name */}
          <div className="space-y-2">
            <div className="relative group">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                placeholder="Institute Name"
                value={form.instituteName}
                onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-4 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                type="email"
                placeholder="Admin Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-4 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                type="password"
                placeholder="Security Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-4 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
              />
            </div>
          </div>

          {/* Register Button */}
          <motion.button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full relative bg-[#A3E635] text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm ${blackBorder} ${hardShadow} ${hoverEffect} flex items-center justify-center gap-3 disabled:opacity-50 mt-4`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Create Institute
                <Zap size={18} strokeWidth={3} fill="currentColor" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/" className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-widest hover:translate-x-1 transition-transform">
            Back to main portal <ArrowRight size={14} strokeWidth={3} />
          </Link>
        </motion.div>

        <p className="mt-8 text-center text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">
          Authorized Academic Onboarding v2.0
        </p>
      </div>
    </div>
  );
}