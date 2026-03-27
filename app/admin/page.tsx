"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  GraduationCap,
  UserCog,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Fingerprint,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
  PieChart,
  Pie,
  Legend,
} from "recharts";

type InstituteInfo = {
  instituteName: string;
  adminName: string;
  totalStudents: number;
  totalFaculty: number;
  highRiskStudents: number;
};

export default function AdminDashboard() {
  const [info, setInfo] = useState<InstituteInfo | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("user_name") || localStorage.getItem("user_name");
    if (stored) setAdminName(stored);

    async function fetchInfo() {
      try {
        const res: any = await apiRequest("/faculty/admin/institute-info", { method: "GET" });
        const d = res.data ?? res;
        setInfo({
          instituteName: d.instituteName ?? d.name ?? "Campus++",
          adminName: d.adminName ?? stored ?? "Admin",
          totalStudents: d.totalStudents ?? 0,
          totalFaculty: d.totalFaculty ?? 0,
          highRiskStudents: d.highRiskStudents ?? 0,
        });
      } catch (err) {
        console.error("Institute info fetch failed:", err);
        setInfo({
          instituteName: "Campus++ Institute",
          adminName: stored ?? "Admin",
          totalStudents: 0,
          totalFaculty: 0,
          highRiskStudents: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  const safeStudents = info?.totalStudents ?? 0;
  const safeRisk = info?.highRiskStudents ?? 0;
  const safeMedium = Math.max(0, Math.round(safeStudents * 0.3));
  const safeLow = Math.max(0, safeStudents - safeRisk - safeMedium);

  const riskData = [
    { name: "High Risk", value: safeRisk, color: "#fb7185" },
    { name: "Medium Risk", value: safeMedium, color: "#f59e0b" },
    { name: "Safe Zone", value: safeLow, color: "#22c55e" },
  ];

  const barData = [
    { name: "Faculty", value: info?.totalFaculty ?? 0, color: "#8B5CF6" },
    { name: "Students", value: safeStudents, color: "#63D2F3" },
    { name: "High Risk", value: safeRisk, color: "#fb7185" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16 px-2 pt-2 transition-colors duration-500">

      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 text-violet-500 rounded-xl">
              <Fingerprint size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-zinc-500">
              Nexus System / Admin Console
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter text-slate-900 dark:text-zinc-100 leading-none">
            Hello, <span className="text-violet-500">{adminName.split(" ")[0]}.</span>
          </h1>
          {info?.instituteName && (
            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Building2 size={14} />
              {info.instituteName}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-2 pr-6 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-violet-500/10 flex items-center justify-center rounded-xl text-violet-500">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</p>
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase italic">All Systems Nominal</p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={loading ? "—" : String(info?.totalStudents ?? 0)}
          icon={Users}
          color="bg-sky-500"
          sub="Enrolled institute-wide"
        />
        <StatCard
          title="Total Faculty"
          value={loading ? "—" : String(info?.totalFaculty ?? 0)}
          icon={UserCog}
          color="bg-violet-500"
          sub="Active faculty members"
        />
        <StatCard
          title="High Risk"
          value={loading ? "—" : String(info?.highRiskStudents ?? 0)}
          icon={AlertTriangle}
          color="bg-rose-500"
          sub="Immediate attention"
          alert
        />
        <StatCard
          title="Institute"
          value={loading ? "—" : info?.instituteName?.split(" ")[0] ?? "—"}
          icon={GraduationCap}
          color="bg-emerald-500"
          sub="Active institution"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
          <div className="mb-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Overview
            </p>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
              Institute Metrics
            </h3>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 14, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#64748b" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
          <div className="mb-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Risk Distribution
            </p>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
              Student Risk Breakdown
            </h3>
            {safeStudents === 0 && !loading && (
              <p className="text-[11px] font-semibold text-slate-400 mt-1">
                No student data available yet.
              </p>
            )}
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BENTO QUICK ACTIONS */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Faculty Management Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center h-full">
            <div className="space-y-6 flex-1">
              <div className="p-4 bg-violet-500 w-fit rounded-3xl shadow-lg shadow-violet-200 dark:shadow-none">
                <UserCog className="text-white" size={32} />
              </div>
              <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-zinc-100 uppercase leading-[0.95]">
                Manage Your <br />
                <span className="text-violet-500">Faculty Team.</span>
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm max-w-sm">
                Add new faculty members, view existing ones, and assign students to ensure balanced oversight.
              </p>

              <Link href="/admin/faculty" className="block w-fit">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95">
                  Open Faculty Panel
                  <ArrowUpRight size={18} strokeWidth={3} />
                </button>
              </Link>
            </div>

            <div className="hidden md:flex flex-col gap-3">
              <QuickStat icon={Users} label="Students" value={String(info?.totalStudents ?? "—")} />
              <QuickStat icon={UserCog} label="Faculty" value={String(info?.totalFaculty ?? "—")} />
              <QuickStat icon={AlertTriangle} label="High Risk" value={String(info?.highRiskStudents ?? "—")} alert />
            </div>
          </div>
        </motion.div>

        {/* Student Insights Card */}
        <div className="lg:col-span-4 bg-[#F5F3FF] dark:bg-zinc-900/50 border border-violet-100 dark:border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-violet-500 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-white dark:bg-zinc-800 px-3 py-1 rounded-full">
                AI Risk
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-zinc-100 leading-tight">
                {info?.highRiskStudents ?? 0} High-Risk Students.
              </h3>
              <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs leading-relaxed">
                {info?.highRiskStudents
                  ? `${info.highRiskStudents} student(s) flagged for immediate academic intervention.`
                  : "No high-risk students detected. Keep monitoring."}
              </p>
            </div>
          </div>

          <Link href="/admin/students" className="mt-8 group flex items-center justify-between bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-violet-100 dark:border-zinc-700 hover:border-violet-300 transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-200">View Student Directory</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform text-violet-500" size={18} strokeWidth={3} />
          </Link>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon: Icon, color, sub, alert }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute -right-4 -top-4 w-20 h-20 ${color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`} />

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-current/10`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className={`text-4xl font-[1000] tracking-tighter ${alert ? "text-rose-500" : "text-slate-900 dark:text-zinc-100"}`}>
          {value}
        </h3>
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{sub}</p>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, alert }: any) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800/50 px-5 py-3 rounded-2xl border border-slate-100 dark:border-zinc-800 min-w-[140px]">
      <Icon size={16} className={alert ? "text-rose-400" : "text-violet-500"} />
      <div>
        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-sm font-black ${alert ? "text-rose-500" : "text-slate-800 dark:text-zinc-100"}`}>{value}</p>
      </div>
    </div>
  );
}
