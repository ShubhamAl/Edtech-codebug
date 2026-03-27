"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";

type Student = {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  Course?: string;
  attendance?: string;
  marks?: string;
  performance?: {
    score: number;
    riskLevel: "High" | "Medium" | "Low";
    trend?: string;
    intervention?: { required: boolean; priority?: string };
  };
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [searchId, setSearchId] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await apiRequest("/faculty/students", { method: "GET" });
      const list: Student[] = res.data ?? res.students ?? res ?? [];
      setStudents(Array.isArray(list) ? list : []);
      setFiltered(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    let list = students;
    if (search) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.studentId.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (riskFilter !== "all") {
      list = list.filter(
        (s) => s.performance?.riskLevel?.toLowerCase() === riskFilter.toLowerCase()
      );
    }
    setFiltered(list);
  }, [search, riskFilter, students]);

  const handleSearchById = () => {
    if (!searchId.trim()) return;
    router.push(`/admin/students/${searchId.trim()}`);
  };

  const highRisk = students.filter((s) => s.performance?.riskLevel === "High").length;
  const medRisk = students.filter((s) => s.performance?.riskLevel === "Medium").length;

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-violet-500/20 rounded-lg">
              <Users size={18} className="text-violet-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Admin / Students</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase">
            Student <span className="text-violet-500">Directory</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Institute-wide student monitoring & risk analysis
          </p>
        </div>

        {/* Quick ID Search */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-2 shadow-sm">
          <input
            type="text"
            placeholder="Go to Student ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchById()}
            className="bg-transparent text-xs font-bold outline-none pl-3 dark:text-white w-40 placeholder:text-slate-400"
          />
          <button
            onClick={handleSearchById}
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1"
          >
            <ArrowUpRight size={14} strokeWidth={3} />
            Go
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
          <AlertTriangle size={18} />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchStudents} className="ml-auto text-xs font-black uppercase underline">
            Retry
          </button>
        </div>
      )}

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MiniStatCard label="Total Enrolled" value={students.length} color="violet" />
        <MiniStatCard label="High Risk" value={highRisk} color="red" />
        <MiniStatCard label="Medium Risk" value={medRisk} color="amber" />
        <MiniStatCard label="Showing" value={filtered.length} color="emerald" />
      </div>

      {/* SEARCH + FILTER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4 p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, student ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border-none rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-950 border-none rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-violet-500 cursor-pointer outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          <button className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl text-slate-500 hover:text-violet-500 transition-colors">
            <Filter size={20} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>

      {/* STUDENTS TABLE */}
      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-sm font-bold">Loading students...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No students found.</p>
          <p className="text-xs mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
            {["Student", "ID", "Course", "Attendance", "Score", "Risk", "Action"].map((h) => (
              <p key={h} className={`text-[9px] font-black uppercase tracking-widest text-slate-400 ${
                h === "Student" ? "col-span-3" : h === "Action" ? "col-span-2 text-right" : "col-span-1"
              }`}>
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50 dark:divide-zinc-800">
            {filtered.map((s, idx) => {
              const risk = s.performance?.riskLevel ?? "Low";
              const score = s.performance?.score ?? 0;
              const trend = s.performance?.trend;
              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="grid grid-cols-2 md:grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Name + Email */}
                  <div className="col-span-2 md:col-span-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-violet-500 uppercase">
                        {s.name.charAt(0)}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">{s.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 truncate">{s.email}</p>
                    </div>
                  </div>

                  {/* Student ID */}
                  <p className="hidden md:block md:col-span-1 text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase">
                    {s.studentId}
                  </p>

                  {/* Course */}
                  <p className="hidden md:block md:col-span-1 text-[10px] font-bold text-slate-400 truncate">
                    {s.Course ?? "—"}
                  </p>

                  {/* Attendance */}
                  <div className="hidden md:flex md:col-span-1 items-center gap-1">
                    <span className="text-[11px] font-black text-slate-700 dark:text-zinc-200">
                      {s.attendance ? `${s.attendance}%` : "—"}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="hidden md:flex md:col-span-1 items-center gap-1.5">
                    <span className="text-[11px] font-black text-slate-700 dark:text-zinc-200">
                      {score > 0 ? score : "—"}
                    </span>
                    {trend === "up" && <TrendingUp size={12} className="text-emerald-500" />}
                    {trend === "down" && <TrendingDown size={12} className="text-rose-500" />}
                    {trend === "stable" && <Minus size={12} className="text-slate-400" />}
                  </div>

                  {/* Risk Badge */}
                  <div className="md:col-span-1">
                    <RiskBadge level={risk} />
                  </div>

                  {/* Action */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      onClick={() => router.push(`/admin/students/${s.studentId}`)}
                      className="flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                    >
                      Deep Insight
                      <ArrowUpRight size={12} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const styles = {
    High: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  const icon = { High: AlertTriangle, Medium: TrendingUp, Low: ShieldCheck };
  const Icon = icon[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[level]}`}>
      <Icon size={10} strokeWidth={2.5} />
      {level}
    </span>
  );
}

function MiniStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const styles: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-500",
    red: "bg-rose-500/10 text-rose-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-[1000] tracking-tighter ${styles[color]}`}>{value}</p>
    </div>
  );
}
