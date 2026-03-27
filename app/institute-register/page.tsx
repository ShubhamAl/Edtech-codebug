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
} from "lucide-react";
import Link from "next/link";

export default function InstituteRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    instituteName: "",
  });
  const [loading, setLoading] = useState(false);

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

      /**
       * EXPECTED RESPONSE:
       * {
       *   token: "...",
       *   user: {
       *     name,
       *     email,
       *     role: "admin",
       *     instituteId
       *   }
       * }
       */

      // 🔐 Store auth data
      setToken(res.token);
      localStorage.setItem("user_name", res.user?.name || name);
      localStorage.setItem("user_email", res.user?.email || email);
      localStorage.setItem("user_role", (res.user?.role || "admin").toLowerCase());
      localStorage.setItem("institute_id", res.user?.instituteId || "");
      sessionStorage.setItem("user_name", res.user?.name || name);
      sessionStorage.setItem("user_email", res.user?.email || email);
      sessionStorage.setItem("user_role", (res.user?.role || "admin").toLowerCase());
      sessionStorage.setItem("institute_id", res.user?.instituteId || "");

      // 🚀 Go to admin dashboard
      router.push("/admin");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Institute registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#63D2F3]/20 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#63D2F3]/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#D6BCFA]/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-[420px] z-10">
        {/* Header */}
        <div className="flex flex-col items-center space-y-6 mb-10">
          <div className="w-20 h-20 bg-[#63D2F3] rounded-[2.2rem] flex items-center justify-center shadow-[0_8px_0_0_#48BBDB]">
            <Building2 className="text-white w-12 h-12" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-800 uppercase">
              Institute <span className="text-[#63D2F3]">Register</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Create Institute Admin Account
            </p>
          </div>
        </div>

        {/* Toggle Nav */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 border border-slate-100 shadow-sm">
          <Link href="/institute-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all">
            Faculty Login
          </Link>
          <Link href="/admin-login" className="flex-1 text-center py-3 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all">
            Admin Login
          </Link>
          <div className="flex-1 text-center py-3 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase text-[#63D2F3] cursor-default">
            Register
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-slate-50 p-10 rounded-[3rem] shadow-xl space-y-6">
          {/* Admin Name */}
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="Admin Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Institute Name */}
          <div className="relative">
            <School className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="Institute Name"
              value={form.instituteName}
              onChange={(e) =>
                setForm({ ...form, instituteName: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#63D2F3] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_6px_0_0_#48BBDB] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Institute"}
            {!loading && <Zap size={16} />}
          </button>

        </div>

        <p className="mt-10 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Authorized Institutions Only
        </p>
      </div>
    </div>
  );
}
