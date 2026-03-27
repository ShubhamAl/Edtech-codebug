"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  BrainCircuit,
  Bell,
  BookOpen,
  Trophy,
  Activity,
  Loader2,
  Star,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";

type StudentDetail = {
  student: {
    name: string;
    email: string;
    studentId: string;
    Course?: string;
    attendance?: string | number;
    marks?: string | number;
    dateOfJoin?: string;
    language?: string;
  };
  performance?: {
    score: number;
    riskLevel: "High" | "Medium" | "Low";
    trend: string;
    intervention?: { required: boolean; priority?: string };
    stabilityScore?: number;
    riskPercentage?: number;
    trends?: string;
  };
  aiInsights?: {
    summary?: string;
    agents?: string[];
    keyPoints?: string[];
  };
  notes?: { note: string; createdAt?: string; createdBy?: string }[];
  notifications?: { message: string; type?: string; createdAt?: string }[];
  rewards?: { title: string; description?: string }[];
};

const RISK_COLORS = {
  High: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30", bar: "#fb7185" },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30", bar: "#f59e0b" },
  Low: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30", bar: "#22c55e" },
};

export default function StudentInsightPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetch() {
      try {
        setLoading(true);
        const res: any = await apiRequest(`/faculty/admin/student/${id}`, { method: "GET" });
        // Handle various response shapes
        const payload = res.data ?? res;
        setData({
          student: payload.student ?? payload,
          performance: payload.performance ?? payload.currentPerformance,
          aiInsights: payload.aiInsights ?? payload.insights,
          notes: payload.notes ?? payload.facultyNotes ?? [],
          notifications: payload.notifications ?? [],
          rewards: payload.rewards ?? [],
        });
      } catch (err: any) {
        setError(err?.message || `Failed to load student ${id}.`);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] gap-3 text-slate-400">
        <Loader2 className="animate-spin" size={28} />
        <span className="font-bold">Loading student analysis...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-slate-400">
        <AlertTriangle size={48} className="text-rose-400" />
        <p className="font-black text-xl text-slate-700 dark:text-white uppercase">{id}</p>
        <p className="font-bold text-sm text-slate-400">{error || "Student not found."}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mt-4 px-6 py-3 bg-violet-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const s = data.student;
  const perf = data.performance;
  const risk = (perf?.riskLevel ?? "Low") as keyof typeof RISK_COLORS;
  const riskStyle = RISK_COLORS[risk];
  const score = perf?.score ?? 0;
  const stability = perf?.stabilityScore ?? Math.max(0, 100 - (perf?.riskPercentage ?? 30));
  const riskPct = perf?.riskPercentage ?? (risk === "High" ? 72 : risk === "Medium" ? 45 : 18);

  const trendIcon = perf?.trend === "up" || perf?.trends === "Improving"
    ? TrendingUp
    : perf?.trend === "down" || perf?.trends === "Declining"
    ? TrendingDown
    : Minus;

  const TrendIcon = trendIcon;

  // Synthetic trend line for viz
  const trendLine = Array.from({ length: 6 }, (_, i) => ({
    week: `W${i + 1}`,
    score: Math.round(Math.max(0, score - (5 - i) * (risk === "High" ? 4 : risk === "Medium" ? 2 : 1) + Math.random() * 5)),
  }));

  const radialData = [{ name: "Score", value: score, fill: riskStyle.bar }];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-2">

      {/* BACK + HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-violet-500 transition-colors font-black text-[11px] uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-1">Admin / Student Insight</p>
          <h1 className="text-3xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase">
            {s.name}
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-0.5">ID: {s.studentId}</p>
        </div>
        <span className={`px-4 py-2 rounded-2xl border text-[11px] font-black uppercase tracking-widest ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}>
          {risk} Risk
        </span>
      </div>

      {/* GRID: PROFILE + RADIAL SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <User size={18} className="text-violet-500" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white">Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-3xl font-black shrink-0">
              {s.name.charAt(0).toUpperCase()}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
              {[
                { label: "Email", value: s.email },
                { label: "Course", value: s.Course ?? "—" },
                { label: "Joined", value: s.dateOfJoin ? new Date(s.dateOfJoin).toLocaleDateString() : "—" },
                { label: "Language", value: s.language ?? "—" },
                { label: "Attendance", value: s.attendance ? `${s.attendance}%` : "—" },
                { label: "Marks", value: s.marks ?? "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-xs font-black text-slate-800 dark:text-zinc-100 truncate">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radial Score + Risk */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Performance Score</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} cornerRadius={10} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 dark:fill-white font-black text-2xl">
                  {score}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <TrendIcon size={16} className={
              perf?.trend === "up" || perf?.trends === "Improving" ? "text-emerald-500" :
              perf?.trend === "down" || perf?.trends === "Declining" ? "text-rose-500" :
              "text-slate-400"
            } />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {perf?.trend ?? perf?.trends ?? "Stable"}
            </span>
          </div>
          {perf?.intervention?.required && (
            <div className="mt-4 w-full flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl px-4 py-2.5">
              <AlertTriangle size={14} className="text-rose-500 shrink-0" />
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">
                Intervention: {perf.intervention.priority ?? "Required"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* TREND CHART */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Activity size={18} className="text-violet-500" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white">Performance Trend</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Weekly score approximation</p>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendLine} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke={riskStyle.bar}
                strokeWidth={3}
                dot={{ r: 5, fill: riskStyle.bar }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PREDICTIVE INTELLIGENCE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <ShieldCheck size={18} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white">Stability Score</h2>
          </div>
          <p className={`text-5xl font-[1000] tracking-tighter mb-2 ${riskStyle.text}`}>{stability}<span className="text-xl">/100</span></p>
          <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stability}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: riskStyle.bar }}
            />
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
            {stability >= 70 ? "Student is academically stable." : stability >= 40 ? "At-risk — monitoring required." : "Critical — immediate intervention."}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <Zap size={18} className="text-rose-500" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white">Risk Probability</h2>
          </div>
          <p className="text-5xl font-[1000] tracking-tighter mb-2 text-rose-500">{riskPct}<span className="text-xl">%</span></p>
          <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-rose-500"
            />
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
            Predicted dropout/fail probability
          </p>
        </div>
      </div>

      {/* AI INSIGHTS */}
      {data.aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900 dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border-2 border-violet-500/30"
        >
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-violet-500/20 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <BrainCircuit className="text-violet-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">AI Insights</h2>
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em]">Predictive Intelligence Engine</p>
              </div>
            </div>

            {data.aiInsights.summary && (
              <div className="mb-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Summary</p>
                <p className="text-sm font-bold text-slate-300 leading-relaxed">{data.aiInsights.summary}</p>
              </div>
            )}

            {data.aiInsights.keyPoints?.length ? (
              <div className="grid md:grid-cols-2 gap-4">
                {data.aiInsights.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                    <CheckCircle2 size={16} className="text-violet-400 mt-0.5 shrink-0 group-hover:scale-125 transition-transform" />
                    <p className="text-xs font-bold text-slate-300 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {data.aiInsights.agents?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {data.aiInsights.agents.map((agent, i) => (
                  <span key={i} className="px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-full text-[9px] font-black text-violet-300 uppercase tracking-widest">
                    {agent}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}

      {/* BOTTOM ROW: Notes + Notifications + Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Faculty Notes */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-sky-500/10 rounded-lg">
              <BookOpen size={16} className="text-sky-500" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white">Faculty Notes</h2>
          </div>
          {data.notes?.length ? (
            <div className="space-y-3">
              {data.notes.map((n, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                  <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 leading-relaxed">{n.note}</p>
                  {n.createdAt && (
                    <p className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={9} /> {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-bold text-slate-400 text-center py-6">No faculty notes yet.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Bell size={16} className="text-amber-500" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white">Notifications</h2>
          </div>
          {data.notifications?.length ? (
            <div className="space-y-3">
              {data.notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-bold text-slate-400 text-center py-6">No notifications.</p>
          )}
        </div>

        {/* Rewards */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-yellow-500/10 rounded-lg">
              <Trophy size={16} className="text-yellow-500" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white">Rewards</h2>
          </div>
          {data.rewards?.length ? (
            <div className="space-y-3">
              {data.rewards.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-2xl">
                  <Star size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-black text-slate-700 dark:text-zinc-200">{r.title}</p>
                    {r.description && <p className="text-[9px] font-bold text-slate-400 mt-0.5">{r.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-bold text-slate-400 text-center py-6">No rewards yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
