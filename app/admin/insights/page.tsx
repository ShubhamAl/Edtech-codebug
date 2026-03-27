"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Users,
  AlertCircle,
  Activity,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type InstituteInfo = {
  totalStudents: number;
  totalFaculty: number;
  highRiskStudents: number;
  instituteName?: string;
};

export default function AdminInsightsPage() {
  const [info, setInfo] = useState<InstituteInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res: any = await apiRequest("/faculty/admin/institute-info", { method: "GET" });
        const d = res.data ?? res;
        setInfo({
          totalStudents: d.totalStudents ?? 0,
          totalFaculty: d.totalFaculty ?? 0,
          highRiskStudents: d.highRiskStudents ?? 0,
          instituteName: d.instituteName ?? d.name,
        });
      } catch {
        setInfo({ totalStudents: 0, totalFaculty: 0, highRiskStudents: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  const total = info?.totalStudents ?? 0;
  const highRisk = info?.highRiskStudents ?? 0;
  const medRisk = Math.round(total * 0.3);
  const safeZone = Math.max(0, total - highRisk - medRisk);

  const chartData = [
    { name: "Critical", value: highRisk, color: "#FF6AC1" },
    { name: "Medium", value: medRisk, color: "#FFD600" },
    { name: "Safe", value: safeZone, color: "#A3E635" },
    { name: "Staff", value: info?.totalFaculty ?? 0, color: "#8E97FD" },
  ];

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen p-6 md:p-12 space-y-12 transition-colors duration-300">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <BrainCircuit size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Nexus Intelligence Engine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-none p-2">
            Admin <br />
            <span className="relative inline-block mt-2">
              Insights.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h1>
        </div>
        <div className={`text-[11px] font-black text-black dark:text-white uppercase tracking-widest bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl ${blackBorder} ${hardShadow}`}>
          Powered by Campus++ AI
        </div>
      </div>

      {/* STAT CARDS */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <Loader2 className="animate-spin text-black dark:text-white" size={48} strokeWidth={3} />
            <span className="text-sm font-black uppercase tracking-[0.4em] text-black dark:text-white">Uplinking Data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <InsightStatCard title="Total Cohort" value={String(total)} icon={Users} color="#63D2F3" />
            <InsightStatCard title="High Risk" value={String(highRisk)} icon={AlertCircle} color="#FF6AC1" trend={highRisk > 0} />
            <InsightStatCard title="Medium Risk" value={String(medRisk)} icon={Activity} color="#FFD600" />
            <InsightStatCard title="Total Faculty" value={String(info?.totalFaculty ?? 0)} icon={UserCog} color="#8E97FD" />
          </div>
        )}
      </AnimatePresence>

      {/* BAR CHART */}
      <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[3rem] p-10 ${hardShadow}`}>
        <div className="mb-10">
          <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Distribution Analysis</p>
          <h3 className="text-3xl font-black tracking-tight text-black dark:text-white uppercase">Institute Risk Overview</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#88888833" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} axisLine={false} tickLine={false} className="text-black dark:text-white" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: "currentColor" }} className="text-black dark:text-white" />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '3px solid black', fontWeight: '900', backgroundColor: '#fff' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={56}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="black" strokeWidth={3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INSIGHT BOXES */}
      <div className="grid lg:grid-cols-2 gap-10">
        <InsightBox
          title="Attendance Dynamics"
          icon={TrendingDown}
          accentColor="#FF6AC1"
          points={[
            "Students with <65% attendance face high dropout risk.",
            "Absenteeism spikes during morning and late-evening slots.",
            "Attendance drops are the strongest early-warning signal.",
          ]}
        />
        <InsightBox
          title="Academic Momentum"
          icon={ArrowUpRight}
          accentColor="#8E97FD"
          points={[
            "Active LMS usage correlates with Grade-A outcomes by 78%.",
            "Gamified quizzes increase engagement and score by ~18%.",
            "Faculty note frequency correlates with improved risk scores.",
          ]}
        />
      </div>

      {/* AI RECOMMENDATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-14 ${blackBorder} ${hardShadow}`}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8E97FD] border-[3px] border-black rounded-full opacity-20 rotate-12" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
            <div className={`p-5 bg-[#FFD600] rounded-2xl ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <ShieldCheck className="text-black" size={32} strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">Admin Protocols</h2>
              <p className="text-[11px] font-black text-[#8E97FD] dark:text-[#A3E635] uppercase tracking-[0.3em]">Master Administrator Action Plan</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Assign all high-risk students to experienced faculty mentors immediately.",
              "Initiate mandatory 1-on-1 mentoring sessions for students with risk > 70%.",
              `Create ${Math.ceil((info?.highRiskStudents ?? 0) / 5)} new intervention groups based on clusters.`,
              "Review faculty-to-student ratios — threshold alert at 1:30.",
              "Deploy early-warning notifications for attendance < 60%.",
              "Conduct institute-wide performance review at end of cycle.",
            ].map((text, i) => (
              <div key={i} className={`flex items-start gap-5 p-6 rounded-2xl bg-[#F9F4F1] dark:bg-zinc-800 ${blackBorder} hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all group cursor-default shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <div className={`p-2 rounded-lg bg-white ${blackBorder}`}>
                  <CheckCircle2 size={20} className="text-[#A3E635] group-hover:scale-125 transition-transform" strokeWidth={4} />
                </div>
                <p className="text-base font-black text-black dark:text-white leading-tight uppercase tracking-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Neubrutalism Helper Components ---

interface InsightStatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  color: string;
  trend?: boolean;
}

function InsightStatCard({ title, value, icon: Icon, color, trend }: InsightStatCardProps) {
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";

  return (
    <div className={`bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] ${blackBorder} ${hardShadow} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group`}>
      <div
        style={{ backgroundColor: color }}
        className={`w-14 h-14 rounded-2xl ${blackBorder} flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform`}
      >
        <Icon size={28} strokeWidth={3} className="text-black" />
      </div>
      <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <h3 className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-black bg-[#FF6AC1] text-black px-2 py-0.5 rounded-md ${blackBorder}`}>ALERT ↑</span>
        )}
      </div>
    </div>
  );
}

interface InsightBoxProps {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  points: string[];
  accentColor: string;
}

function InsightBox({ title, icon: Icon, points, accentColor }: InsightBoxProps) {
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";

  return (
    <div className={`bg-white dark:bg-zinc-900 p-10 rounded-[3rem] ${blackBorder} ${hardShadow}`}>
      <div className="flex items-center gap-5 mb-10">
        <div
          style={{ backgroundColor: accentColor }}
          className={`p-3 rounded-xl ${blackBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
        >
          <Icon size={24} strokeWidth={3} className="text-black" />
        </div>
        <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{title}</h2>
      </div>
      <ul className="space-y-6">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4 group">
            <div className={`h-4 w-4 rounded-full ${blackBorder} group-hover:bg-[#FFD600] transition-colors mt-1.5 shrink-0`} style={{ backgroundColor: accentColor }} />
            <p className="text-base font-bold text-black dark:text-white leading-tight opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-tight">{p}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}