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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      // Validate role
      const role = (res.institute?.role || "").toLowerCase();
      if (role !== "master" && role !== "admin") {
        setError(
          "Access denied. This portal is for Master Admins only. Faculty should use the Faculty Login."
        );
        return;
      }

      // Store auth data
      setToken(res.token);

      const name = res.institute?.name || "Admin";
      const userEmail = res.institute?.email || email;

      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", userEmail);
      localStorage.setItem("user_role", role);

      sessionStorage.setItem("user_name", name);
      sessionStorage.setItem("user_email", userEmail);
      sessionStorage.setItem("user_role", role);

      // Redirect to admin dashboard
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Animated background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-700 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500 rounded-full blur-[120px]"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-[440px] z-10">
        {/* TOP BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6 mb-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-40 rounded-full scale-150" />
            <div className="relative h-20 w-20 bg-violet-600 rounded-[2rem] flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.5)] border border-violet-400/20">
              <GraduationCap className="text-white w-10 h-10" strokeWidth={2} />
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.5em]">
              Campus++ / Nexus System
            </p>
            <h1 className="text-4xl font-[1000] tracking-tighter text-white uppercase leading-none">
              Admin<span className="text-violet-400"> Console</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pt-1">
              Master Administrator Access Only
            </p>
          </div>
        </motion.div>

        {/* Toggle Nav */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/10 shadow-sm"
        >
          <Link href="/institute-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            Faculty Login
          </Link>
          <div className="flex-1 text-center py-3 bg-violet-600/20 border border-violet-500/30 rounded-xl shadow-sm text-[10px] font-black uppercase text-violet-400 cursor-default">
            Admin Login
          </div>
          <Link href="/institute-register" className="flex-1 text-center py-3 rounded-xl text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            Register
          </Link>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] space-y-6"
        >
          {/* Shield badge */}
          <div className="flex items-center gap-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
            <ShieldCheck size={16} className="text-violet-400 shrink-0" />
            <p className="text-[10px] font-black text-violet-300 uppercase tracking-widest">
              Secured Admin Portal — Role verification active
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl"
              >
                <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-rose-300 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Admin Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors"
                size={16}
              />
              <input
                id="admin-email"
                type="email"
                placeholder="admin@institute.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/8 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-400 transition-colors"
                size={16}
              />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/8 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white placeholder:text-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-violet-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            id="admin-login-btn"
            onClick={handleLogin}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center gap-3 disabled:opacity-60 transition-all"
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Verifying Identity...
                </>
              ) : (
                <>
                  Access Admin Console
                  <Zap size={16} strokeWidth={2.5} />
                </>
              )}
            </span>
          </motion.button>

        </motion.div>

        {/* BOTTOM NOTE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]"
        >
          Authorized Personnel Only · Campus++ Nexus v2
        </motion.p>
      </div>
    </div>
  );
}
