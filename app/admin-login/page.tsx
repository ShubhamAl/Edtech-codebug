"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";
import {
  ShieldCheck,
  Mail,
  Lock,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res: any = await apiRequest("/auth/insti-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const role = (res.institute?.role || "").toLowerCase();
      if (role !== "master" && role !== "admin") {
        setError(
          "Access denied. This portal is for Master Admins only. Faculty should use the Faculty Login."
        );
        return;
      }

      setToken(res.token);

      const name = res.institute?.name || "Admin";
      const userEmail = res.institute?.email || email;

      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", userEmail);
      localStorage.setItem("user_role", role);

      sessionStorage.setItem("user_name", name);
      sessionStorage.setItem("user_email", userEmail);
      sessionStorage.setItem("user_role", role);

      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Decor Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-64 h-64 bg-[#FF6AC1] ${blackBorder} rounded-full opacity-20 rotate-12`} />
        <div className={`absolute -bottom-20 -right-20 w-80 h-80 bg-[#FFD600] ${blackBorder} rounded-full opacity-20 -rotate-12`} />
      </div>

      <div className="w-full max-w-[460px] z-10">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-6 mb-10"
        >
          <div className={`relative h-20 w-20 bg-[#8E97FD] rounded-2xl ${blackBorder} ${hardShadow} flex items-center justify-center rotate-3`}>
            <GraduationCap className="text-black w-10 h-10" strokeWidth={3} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.4em]">
              Nexus System
            </p>
            <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-none">
              Admin<span className="text-[#8E97FD]"> Console</span>
            </h1>
            <div className="relative inline-block mt-2">
              <span className="text-[10px] font-black text-black uppercase tracking-widest bg-[#A3E635] px-3 py-1 border-2 border-black">
                Master Administrator Access
              </span>
            </div>
          </div>
        </motion.div>

        {/* TAB NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex bg-white ${blackBorder} p-1.5 rounded-2xl mb-8 ${hardShadow}`}
        >
          <Link href="/institute-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Faculty
          </Link>
          <div className="flex-1 text-center py-3 bg-[#8E97FD] border-2 border-black rounded-xl text-[10px] font-black uppercase text-black cursor-default">
            Admin
          </div>
          <Link href="/institute-register" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Register
          </Link>
        </motion.div>

        {/* LOGIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white ${blackBorder} p-8 md:p-10 rounded-[2.5rem] ${hardShadow} space-y-8`}
        >
          {/* Role Alert */}
          <div className="flex items-center gap-3 p-4 bg-[#F9F4F1] border-2 border-black rounded-2xl">
            <ShieldCheck size={20} className="text-[#8E97FD] shrink-0" strokeWidth={3} />
            <p className="text-[11px] font-black text-black uppercase tracking-tight leading-tight">
              Verifying master credentials for high-level operations.
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 p-4 bg-[#FF6AC1] border-2 border-black rounded-2xl"
              >
                <AlertTriangle size={18} className="text-black shrink-0" strokeWidth={3} />
                <p className="text-xs font-black text-black leading-tight uppercase">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-widest block ml-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
                <input
                  type="email"
                  placeholder="admin@nexus.io"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-widest block ml-1">
                Console Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full relative bg-[#FFD600] text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm ${blackBorder} ${hardShadow} ${hoverEffect} flex items-center justify-center gap-3 disabled:opacity-50`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                Enter Console
                <Zap size={18} strokeWidth={3} fill="currentColor" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/" className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-widest hover:translate-x-1 transition-transform">
            Back to main portal <ArrowRight size={14} strokeWidth={3} />
          </Link>
        </motion.div>

        {/* Bottom Note */}
        <p className="mt-8 text-center text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">
          Official Academic Gateway v2.0
        </p>
      </div>
    </div>
  );
}