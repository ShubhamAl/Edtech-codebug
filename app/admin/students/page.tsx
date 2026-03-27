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
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

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
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen p-6 md:p-12 space-y-12 overflow-hidden transition-colors duration-300">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <Users size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Nexus / Directory</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-none p-2">
            Student <br />
            <span className="relative inline-block mt-2">
              Directory.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h1>
        </div>

        {/* Quick ID Search */}
        <div className={`flex items-center gap-3 bg-white dark:bg-zinc-900 ${blackBorder} p-3 rounded-2xl ${hardShadow}`}>
          <input
            type="text"
            placeholder="Go to Student ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchById()}
            className="bg-transparent text-sm font-bold outline-none pl-3 dark:text-white w-48 placeholder:text-black/30 dark:placeholder:text-white/30"
          />
          <button
            onClick={handleSearchById}
            className={`bg-[#FFD600] text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest ${blackBorder} ${hoverEffect}`}
          >
            Jump
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-6 bg-[#FF6AC1] ${blackBorder} rounded-2xl flex items-center gap-4 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
          <AlertTriangle size={24} strokeWidth={3} />
          <p className="text-sm font-black uppercase">{error}</p>
          <button onClick={fetchStudents} className="ml-auto bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase underline">Retry</button>
        </motion.div>
      )}

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MiniStatCard label="Total Enrolled" value={students.length} color="#63D2F3" />
        <MiniStatCard label="Critical Risk" value={highRisk} color="#FF6AC1" />
        <MiniStatCard label="Warning Zone" value={medRisk} color="#FFD600" />
        <MiniStatCard label="Filtered Views" value={filtered.length} color="#A3E635" />
      </div>

      {/* SEARCH + FILTER TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col lg:flex-row gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] ${blackBorder} ${hardShadow}`}
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder="Scan directory by name, ID, or nexus email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-black dark:text-white outline-none focus:bg-white transition-all`}
          />
        </div>
        <div className="flex gap-4">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-black dark:text-white outline-none cursor-pointer focus:bg-white`}
          >
            <option value="all">Levels: ALL</option>
            <option value="high">Levels: HIGH</option>
            <option value="medium">Levels: MED</option>
            <option value="low">Levels: LOW</option>
          </select>
          <button className={`p-4 bg-[#8E97FD] ${blackBorder} rounded-2xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all`}>
            <Filter size={24} strokeWidth={3} />
          </button>
        </div>
      </motion.div>

      {/* STUDENTS TABLE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
          <Loader2 className="animate-spin" size={48} strokeWidth={3} />
          <span className="text-sm font-black uppercase tracking-[0.4em]">Fetching Student Data...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] ${blackBorder} ${hardShadow}`}>
          <Users size={80} className="mx-auto mb-6 opacity-10" strokeWidth={1} />
          <p className="text-2xl font-black uppercase text-black dark:text-white">No Entities Found.</p>
          <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-40">Adjust your search parameters or filter levels.</p>
        </div>
      ) : (
        <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] overflow-hidden ${hardShadow}`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F9F4F1] dark:bg-zinc-800 border-b-[3px] border-black dark:border-white">
                  <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em]">Student Profile</th>
                  <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] hidden md:table-cell">Nexus ID</th>
                  <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] hidden md:table-cell">Attendance</th>
                  <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] hidden md:table-cell">P-Score</th>
                  <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em]">Risk Profile</th>
                  <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.3em]">Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y-[2px] divide-black/10 dark:divide-white/10">
                {filtered.map((s, idx) => {
                  const risk = s.performance?.riskLevel ?? "Low";
                  const score = s.performance?.score ?? 0;
                  const trend = s.performance?.trend;
                  return (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-[#8E97FD]/5 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl bg-[#8E97FD] ${blackBorder} flex items-center justify-center shrink-0`}>
                            <span className="text-xs font-black text-black uppercase">{s.name.charAt(0)}</span>
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-base font-black text-black dark:text-white uppercase leading-none mb-1 truncate">{s.name}</p>
                            <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest truncate">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <span className={`px-3 py-1 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white rounded-lg text-[10px] font-black uppercase`}>
                          {s.studentId}
                        </span>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <p className="text-sm font-black uppercase">{s.attendance ? `${s.attendance}%` : "—"}</p>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black">{score > 0 ? `${score}%` : "—"}</p>
                          {trend === "up" && <TrendingUp size={16} className="text-[#A3E635]" strokeWidth={4} />}
                          {trend === "down" && <TrendingDown size={16} className="text-[#FF6AC1]" strokeWidth={4} />}
                          {trend === "stable" && <Minus size={16} className="text-black/20" strokeWidth={4} />}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <RiskBadge level={risk} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => router.push(`/admin/students/${s.studentId}`)}
                          className={`bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${blackBorder} ${hoverEffect} flex items-center gap-2 ml-auto`}
                        >
                          Insights <ArrowUpRight size={14} strokeWidth={3} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const blackBorder = "border-[2px] border-black";
  const colors = {
    High: "bg-[#FF6AC1]",
    Medium: "bg-[#FFD600]",
    Low: "bg-[#A3E635]",
  };
  const icon = { High: AlertTriangle, Medium: TrendingUp, Low: ShieldCheck };
  const Icon = icon[level];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${blackBorder} ${colors[level]} text-black text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
      <Icon size={12} strokeWidth={4} />
      {level}
    </span>
  );
}

function MiniStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  return (
    <div className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2rem] p-6 ${hardShadow}`}>
      <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mb-4">{label}</p>
      <div className="flex items-center gap-4">
        <div style={{ backgroundColor: color }} className={`h-3 w-3 rounded-full border-2 border-black`} />
        <p className="text-4xl font-black tracking-tighter text-black dark:text-white leading-none">{value}</p>
      </div>
    </div>
  );
}