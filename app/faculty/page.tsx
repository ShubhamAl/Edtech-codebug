"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Clock,
  FileUp,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Fingerprint,
  Zap,
  Activity
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
  LineChart,
  Line,
} from "recharts";

type DashboardAnalytics = {
  totalStudents: number;
  riskDistribution: { High: number; Medium: number; Low: number };
  studentsAtRisk: number;
  interventionsRequired: number;
  byPriority: { critical: number; moderate: number; low: number };
  studentsJoinedToday?: number;
};

export default function FacultyDashboard() {
  const [facultyName, setFacultyName] = useState("Professor");
  const [stats, setStats] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setFacultyName(storedName);

    async function fetchAnalytics() {
      try {
        const res: any = await apiRequest("/faculty/dashboard/analytics", { method: "GET" });
        setStats(res.data);
      } catch (err) {
        setStats({
          totalStudents: 150,
          riskDistribution: { High: 12, Medium: 45, Low: 93 },
          studentsAtRisk: 57,
          interventionsRequired: 5,
          byPriority: { critical: 1, moderate: 2, low: 2 },
          studentsJoinedToday: 4
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const riskChartData = [
    { name: "High", value: stats?.riskDistribution?.High ?? 0, color: "#FF6AC1" },
    { name: "Med", value: stats?.riskDistribution?.Medium ?? 0, color: "#FFD600" },
    { name: "Low", value: stats?.riskDistribution?.Low ?? 0, color: "#A3E635" },
  ];

  const priorityChartData = [
    { name: "Crit", value: stats?.byPriority?.critical ?? 0 },
    { name: "Mod", value: stats?.byPriority?.moderate ?? 0 },
    { name: "Low", value: stats?.byPriority?.low ?? 0 },
  ];

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen px-6 md:px-12 py-10 space-y-12 overflow-hidden transition-colors duration-300">

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <Fingerprint size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">
              Nexus System / Faculty Node
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-none p-2">
            Hello, <br />
            <span className="relative inline-block mt-2">
              {facultyName.split(' ')[0]}.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h1>
        </div>

        <div className={`hidden md:flex items-center gap-4 bg-white dark:bg-zinc-900 ${blackBorder} p-4 rounded-2xl ${hardShadow}`}>
          <div className="w-12 h-12 bg-[#A3E635] border-2 border-black dark:border-white flex items-center justify-center rounded-xl">
            <Activity size={24} className="text-black" strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 leading-none mb-1">Health Status</p>
            <p className="text-sm font-black text-black dark:text-white uppercase">Risk Engine Nominal</p>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Cohort" value={stats?.totalStudents} icon={Users} color="#63D2F3" sub="Active students" />
        <StatCard title="Critical Risk" value={stats?.riskDistribution.High} icon={AlertTriangle} color="#FF6AC1" sub="Immediate action" alert />
        <StatCard title="At Risk" value={stats?.studentsAtRisk} icon={TrendingUp} color="#FFD600" sub="Pattern detected" />
        <StatCard title="Daily Growth" value={`+${stats?.studentsJoinedToday || 0}`} icon={Zap} color="#8E97FD" sub="New enrollments" />
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] p-8 ${hardShadow}`}>
          <div className="mb-8">
            <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Cohort Analytics</p>
            <h3 className="text-3xl font-black tracking-tight text-black dark:text-white">Risk Distribution</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#88888833" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" width={60} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '3px solid black', fontWeight: '900', backgroundColor: '#fff', color: '#000' }} />
                <Bar dataKey="value" barSize={32} radius={[0, 8, 8, 0]}>
                  {riskChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="currentColor" strokeWidth={2} className="text-black dark:text-white" />
                  ))}
                  <LabelList dataKey="value" position="right" style={{ fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] p-8 ${hardShadow}`}>
          <div className="mb-8">
            <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Intervention Queue</p>
            <h3 className="text-3xl font-black tracking-tight text-black dark:text-white">Priority Trends</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="0" stroke="#88888833" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '3px solid black', fontWeight: '900', backgroundColor: '#fff', color: '#000' }} />
                <Line type="stepAfter" dataKey="value" stroke="currentColor" className="text-black dark:text-white" strokeWidth={4} dot={{ r: 6, fill: '#8E97FD', stroke: 'currentColor', strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. ACTIONS BENTO */}
      <div className="grid lg:grid-cols-12 gap-10">
        <motion.div
          whileHover={{ y: -5 }}
          className={`lg:col-span-8 bg-white dark:bg-zinc-900 ${blackBorder} rounded-[3rem] p-12 relative overflow-hidden ${hardShadow}`}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#63D2F3] border-[3px] border-black dark:border-white rounded-full z-0 opacity-20" />

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="space-y-8 flex-1">
              <div className={`p-5 bg-[#A3E635] w-fit rounded-3xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-3`}>
                <FileUp className="text-black" size={40} strokeWidth={3} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-black dark:text-white uppercase leading-[0.9]">
                  Sync Your <br />
                  <span className="text-[#8E97FD]">Student Data.</span>
                </h2>
                <p className="text-black/60 dark:text-white/60 font-bold text-lg max-w-sm leading-tight">
                  Upload Attendance, Grades, and LMS logs to refresh the Predictive Risk Model.
                </p>
              </div>

              <Link href="/faculty/upload" className="block w-full sm:w-fit">
                <button className={`w-full sm:w-auto bg-[#FFD600] text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${blackBorder} ${hardShadow} ${hoverEffect}`}>
                  Launch Ingestion Portal
                  <ArrowUpRight size={20} strokeWidth={3} />
                </button>
              </Link>
            </div>

            <div className="hidden md:flex flex-col gap-4">
              <ProcessStep icon={Activity} label="Logs" color="#A3E635" />
              <ProcessStep icon={TrendingUp} label="Grades" color="#FF6AC1" />
              <ProcessStep icon={Clock} label="Presence" color="#63D2F3" />
            </div>
          </div>
        </motion.div>

        <div className={`lg:col-span-4 bg-[#F9F4F1] dark:bg-zinc-900/50 ${blackBorder} rounded-[3rem] p-10 flex flex-col justify-between ${hardShadow}`}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className={`p-4 bg-white dark:bg-zinc-800 ${blackBorder} rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
                <BrainCircuit size={32} className="text-[#8E97FD]" strokeWidth={3} />
              </div>
              <span className={`text-[11px] font-black text-black dark:text-white uppercase tracking-widest bg-[#FF6AC1] px-4 py-1.5 rounded-full ${blackBorder}`}>
                AI Insight
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-4xl font-black text-black dark:text-white leading-none">
                {stats?.interventionsRequired} Actions <br /> Required.
              </h3>
              <p className="text-black/50 dark:text-white/50 font-bold text-base leading-tight">
                Our model suggests {stats?.byPriority?.critical} student(s) show high dropout probability based on recent activity.
              </p>
            </div>
          </div>

          <Link href="/faculty/insights" className={`mt-10 group flex items-center justify-between bg-white dark:bg-zinc-800 p-6 rounded-2xl ${blackBorder} ${hardShadow} ${hoverEffect}`}>
            <span className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Detailed Report</span>
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
        <div
          style={{ backgroundColor: color }}
          className={`p-3 rounded-2xl border-[3px] border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
        >
          <Icon size={24} strokeWidth={3} />
        </div>
        <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em]">{title}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className={`text-5xl font-black tracking-tighter ${alert ? 'text-[#FF6AC1]' : 'text-black dark:text-white'}`}>
          {value || 0}
        </h3>
      </div>
      <p className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest mt-2 opacity-40">{sub}</p>
    </div>
  );
}

function ProcessStep({ icon: Icon, label, color }: any) {
  return (
    <div className={`flex items-center gap-4 bg-white dark:bg-zinc-800 px-6 py-4 rounded-2xl border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] min-w-[160px]`}>
      <Icon size={20} style={{ color: color }} strokeWidth={4} />
      <span className="text-[11px] font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
    </div>
  );
}