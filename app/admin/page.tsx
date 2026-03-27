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

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

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
    { name: "High Risk", value: safeRisk, color: "#FF6AC1" },
    { name: "Med Risk", value: safeMedium, color: "#FFD600" },
    { name: "Safe Zone", value: safeLow, color: "#A3E635" },
  ];

  const barData = [
    { name: "Faculty", value: info?.totalFaculty ?? 0, color: "#8E97FD" },
    { name: "Students", value: safeStudents, color: "#63D2F3" },
    { name: "Critical", value: safeRisk, color: "#FF6AC1" },
  ];

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen px-6 md:px-12 py-10 space-y-12 overflow-hidden transition-colors duration-300">

      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <Fingerprint size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">
              Nexus System / Admin Console
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-none p-2">
            Hello, <br />
            <span className="relative inline-block mt-2">
              {adminName.split(" ")[0]}.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h1>
          {info?.instituteName && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 ${blackBorder} rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
              <Building2 size={16} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-widest">{info.instituteName}</span>
            </div>
          )}
        </div>

        <div className={`hidden md:flex items-center gap-4 bg-white dark:bg-zinc-900 ${blackBorder} p-4 rounded-2xl ${hardShadow}`}>
          <div className="w-12 h-12 bg-[#8E97FD] border-2 border-black dark:border-white flex items-center justify-center rounded-xl">
            <Activity size={24} className="text-black" strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 leading-none mb-1">Nexus Status</p>
            <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight">All Systems Nominal</p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Students"
          value={loading ? "—" : String(info?.totalStudents ?? 0)}
          icon={Users}
          color="#63D2F3"
          sub="Institute-wide"
        />
        <StatCard
          title="Total Faculty"
          value={loading ? "—" : String(info?.totalFaculty ?? 0)}
          icon={UserCog}
          color="#8E97FD"
          sub="Active members"
        />
        <StatCard
          title="High Risk"
          value={loading ? "—" : String(info?.highRiskStudents ?? 0)}
          icon={AlertTriangle}
          color="#FF6AC1"
          sub="Urgent attention"
          alert
        />
        <StatCard
          title="Academy"
          value={loading ? "—" : info?.instituteName?.split(" ")[0] ?? "Nexus"}
          icon={GraduationCap}
          color="#A3E635"
          sub="Operational site"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart Card */}
        <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] p-8 ${hardShadow}`}>
          <div className="mb-8">
            <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Core Metrics</p>
            <h3 className="text-3xl font-black tracking-tight text-black dark:text-white">Institution Overview</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#88888833" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-black dark:text-white" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '3px solid black', fontWeight: '900', backgroundColor: '#fff', color: '#000' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="currentColor" strokeWidth={2} className="text-black dark:text-white" />
                  ))}
                  <LabelList dataKey="value" position="top" style={{ fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] p-8 ${hardShadow}`}>
          <div className="mb-8">
            <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Stability Breakdown</p>
            <h3 className="text-3xl font-black tracking-tight text-black dark:text-white">Student Risk Profile</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData.filter(d => d.value > 0)}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="text-black dark:text-white"
                >
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '3px solid black', fontWeight: '900' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BENTO QUICK ACTIONS */}
      <div className="grid lg:grid-cols-12 gap-10">
        <motion.div
          whileHover={{ y: -5 }}
          className={`lg:col-span-8 bg-white dark:bg-zinc-900 ${blackBorder} rounded-[3rem] p-12 relative overflow-hidden ${hardShadow}`}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#8E97FD] border-[3px] border-black rounded-full z-0 opacity-20" />

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center h-full">
            <div className="space-y-8 flex-1">
              <div className={`p-5 bg-[#8E97FD] w-fit rounded-3xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-3`}>
                <UserCog className="text-black" size={40} strokeWidth={3} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-black dark:text-white uppercase leading-[0.9]">
                  Manage Your <br />
                  <span className="text-[#8E97FD]">Faculty Team.</span>
                </h2>
                <p className="text-black/60 dark:text-white/60 font-bold text-lg max-w-sm leading-tight">
                  Add new members, view existing faculty, and assign student cohorts to ensure oversight.
                </p>
              </div>

              <Link href="/admin/faculty" className="block w-full sm:w-fit">
                <button className={`w-full sm:w-auto bg-[#FFD600] text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${blackBorder} ${hardShadow} ${hoverEffect}`}>
                  Open Faculty Panel
                  <ArrowUpRight size={20} strokeWidth={3} />
                </button>
              </Link>
            </div>

            <div className="hidden md:flex flex-col gap-4">
              <QuickStat icon={Users} label="Cohort" value={String(info?.totalStudents ?? "—")} color="#63D2F3" />
              <QuickStat icon={UserCog} label="Team" value={String(info?.totalFaculty ?? "—")} color="#8E97FD" />
              <QuickStat icon={AlertTriangle} label="Critical" value={String(info?.highRiskStudents ?? "—")} color="#FF6AC1" alert />
            </div>
          </div>
        </motion.div>

        <div className={`lg:col-span-4 bg-[#F9F4F1] dark:bg-zinc-900/50 ${blackBorder} rounded-[3rem] p-10 flex flex-col justify-between ${hardShadow}`}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className={`p-4 bg-white dark:bg-zinc-800 ${blackBorder} rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
                <ShieldCheck size={32} className="text-[#A3E635]" strokeWidth={3} />
              </div>
              <span className={`text-[11px] font-black text-black dark:text-white uppercase tracking-widest bg-[#A3E635] px-4 py-1.5 rounded-full ${blackBorder}`}>
                Nexus Security
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-4xl font-black text-black dark:text-white leading-none">
                {info?.highRiskStudents ?? 0} High-Risk <br /> Entities.
              </h3>
              <p className="text-black/50 dark:text-white/50 font-bold text-base leading-tight">
                {info?.highRiskStudents
                  ? `${info.highRiskStudents} entities flagged for immediate mitigation and tactical review.`
                  : "Scanning complete. No high-risk patterns detected currently."}
              </p>
            </div>
          </div>

          <Link href="/admin/students" className={`mt-10 group flex items-center justify-between bg-white dark:bg-zinc-800 p-6 rounded-2xl ${blackBorder} ${hardShadow} ${hoverEffect}`}>
            <span className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Audit Directory</span>
            <ChevronRight className="group-hover:translate-x-2 transition-transform text-black dark:text-white" size={24} strokeWidth={4} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, sub, alert }: any) {
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  return (
    <div className={`bg-white dark:bg-zinc-900 ${blackBorder} p-8 rounded-[2.5rem] ${hardShadow} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group relative overflow-hidden`}>
      <div className="flex items-center gap-4 mb-6">
        <div style={{ backgroundColor: color }} className={`p-3 rounded-2xl border-[3px] border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
          <Icon size={24} strokeWidth={3} />
        </div>
        <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em]">{title}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className={`text-5xl font-black tracking-tighter ${alert ? 'text-[#FF6AC1]' : 'text-black dark:text-white'}`}>
          {value || 0}
        </h3>
      </div>
      <p className="text-[11px] font-black text-black uppercase dark:text-white tracking-widest mt-2 opacity-40">{sub}</p>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, alert, color }: any) {
  const blackBorder = "border-[3px] border-black dark:border-white";
  return (
    <div className={`flex items-center gap-4 bg-white dark:bg-zinc-800 px-6 py-4 rounded-2xl ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] min-w-[160px]`}>
      <Icon size={20} style={{ color: alert ? '#FF6AC1' : color }} strokeWidth={4} />
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 leading-none mb-1">{label}</p>
        <p className={`text-sm font-black ${alert ? "text-[#FF6AC1]" : "text-black dark:text-white"}`}>{value}</p>
      </div>
    </div>
  );
}