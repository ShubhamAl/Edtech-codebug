"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Building2, Mail, Lock, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function InstituteLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await apiRequest("/auth/insti-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(res.token);

      localStorage.setItem("user_name", res.institute?.name || "Institute Admin");
      localStorage.setItem("user_email", res.institute?.email || email);
      localStorage.setItem("user_role", (res.institute?.role || "FACULTY").toLowerCase());

      sessionStorage.setItem("user_name", res.institute?.name || "Institute Admin");
      sessionStorage.setItem("user_email", res.institute?.email || email);
      sessionStorage.setItem("user_role", (res.institute?.role || "FACULTY").toLowerCase());

      const role = (res.institute?.role || "faculty").toLowerCase();
      if (role === "master" || role === "admin") {
        router.push("/admin");
      } else {
        router.push("/faculty");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Institute login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-64 h-64 bg-[#63D2F3] ${blackBorder} rounded-full opacity-20 rotate-12`} />
        <div className={`absolute -bottom-20 -right-20 w-80 h-80 bg-[#FFD600] ${blackBorder} rounded-full opacity-20 -rotate-12`} />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-6 mb-10"
        >
          <div className={`w-20 h-20 bg-[#63D2F3] rounded-2xl ${blackBorder} flex items-center justify-center ${hardShadow} rotate-3`}>
            <Building2 className="text-black w-10 h-10" strokeWidth={2.5} />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-none">
              Faculty <span className="text-[#63D2F3]">Login</span>
            </h1>
            <div className="relative inline-block mt-1">
              <span className="text-[10px] font-black text-black uppercase tracking-widest bg-[#A3E635] px-3 py-1 border-2 border-black">
                Authorized Faculty Portal
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
          <div className="flex-1 text-center py-3 bg-[#63D2F3] border-2 border-black rounded-xl text-[10px] font-black uppercase text-black cursor-default">
            Faculty
          </div>
          <Link href="/admin-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Admin
          </Link>
          <Link href="/institute-register" className="flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase text-black/40 hover:text-black hover:bg-[#F9F4F1] transition-all">
            Register
          </Link>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white ${blackBorder} p-8 md:p-10 rounded-[2.5rem] ${hardShadow} space-y-8`}
        >
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest block ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                type="email"
                placeholder="admin@institute.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-6 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest block ml-1">
              Security Key
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F9F4F1] ${blackBorder} rounded-2xl py-4 pl-12 pr-12 font-bold text-black placeholder:text-black/30 outline-none focus:bg-white transition-all`}
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

          {/* Submit Button */}
          <motion.button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full relative bg-[#63D2F3] text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm ${blackBorder} ${hardShadow} ${hoverEffect} flex items-center justify-center gap-3 disabled:opacity-50`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                Accessing...
              </>
            ) : (
              <>
                Login to Portal
                <Zap size={18} strokeWidth={3} fill="currentColor" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Home Navigation */}
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
          Authorized Personnel Only · Campus++ v1.0.4
        </p>
      </div>
    </div>
  );
}