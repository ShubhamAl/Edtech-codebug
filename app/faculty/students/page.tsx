"use client";

import { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import { Search, Filter, Users, AlertTriangle, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";

const PERFORMANCE_API = "https://campuspp-f7qx.onrender.com/api";

type Student = {
  _id: string;
  email: string;
  name: string;
  studentId: string;
  instituteName: string;
  dateOfJoin: string;
  instituteId: string;
  Course: string;
  attendance: string;
  classes: string;
  language: string;
  marks: string;
  performance: {
    score: number;
    riskLevel: "High" | "Medium" | "Low";
    trend: string;
    intervention: {
      required: boolean;
      priority?: string;
    };
  };
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";

  const hydrateWithLatestPerformance = async (baseStudents: Student[]) => {
    const token = getToken();
    const settled = await Promise.allSettled(
      baseStudents.map(async (s) => {
        const res = await fetch(`${PERFORMANCE_API}/student/public/performance/${s.studentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return s;
        const json = await res.json();
        const perf = json?.data?.currentPerformance;
        if (!perf) return s;
        return {
          ...s,
          performance: {
            score: Number(perf.score ?? s.performance?.score ?? 0),
            riskLevel: (perf.riskLevel || s.performance?.riskLevel || "Low") as "High" | "Medium" | "Low",
            trend: String(perf.trends || s.performance?.trend || "Stable"),
            intervention: {
              required: Boolean(perf.intervention?.required),
              priority: perf.intervention?.priority,
            },
          },
        } as Student;
      })
    );
    return settled.map((r, i) => (r.status === "fulfilled" ? r.value : baseStudents[i]));
  };

  const sendFacultyNote = async (studentId: string, note: string) => {
    const token = getToken();
    const facultyName = sessionStorage.getItem("user_name") || localStorage.getItem("user_name") || "Faculty";
    const res = await fetch("/api/faculty-annotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-user-name": facultyName,
        "x-user-role": "FACULTY",
      },
      body: JSON.stringify({ studentId, note, metadata: { source: "faculty_dashboard_chat" } }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to send annotation");
    return {
      notificationSent: json?.notification?.attempted ? Boolean(json?.notification?.sent) : undefined,
      notificationMessage: json?.notification?.message,
    };
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res: any = await apiRequest("/faculty/students", { method: "GET" });
        const rawStudents = res.data || [];
        const mergedStudents = await hydrateWithLatestPerformance(rawStudents);
        setStudents(mergedStudents);
        setFilteredStudents(mergedStudents);
        setError(null);
      } catch (err) {
        setError("Unable to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (riskFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.performance?.riskLevel?.toLowerCase() === riskFilter.toLowerCase()
      );
    }
    setFilteredStudents(filtered);
  }, [searchQuery, riskFilter, students]);

  const highRiskCount = students.filter((s) => s.performance?.riskLevel === "High").length;

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen p-6 md:p-12 space-y-12 overflow-hidden transition-colors duration-300">

      {/* 1. HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#FFD600] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <BrainCircuit size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Student Intelligence</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-none p-2">
            Risk <br />
            <span className="relative inline-block mt-2">
              Analysis.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#8E97FD] -z-10 -rotate-1" />
            </span>
          </h1>
        </div>
        <div className={`text-[11px] font-black text-black dark:text-white uppercase tracking-widest bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl ${blackBorder} ${hardShadow}`}>
          Status: Engine Monitoring
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 bg-[#FF6AC1] ${blackBorder} rounded-2xl flex items-center gap-4 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        >
          <AlertTriangle size={24} strokeWidth={3} />
          <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          <button onClick={() => window.location.reload()} className="ml-auto bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest">Retry</button>
        </motion.div>
      )}

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col lg:flex-row gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] ${blackBorder} ${hardShadow}`}
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder="Scan student profile, ID or nexus email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-black dark:text-white outline-none focus:bg-white transition-all`}
          />
        </div>

        <div className="flex gap-4">
          <div className="relative min-w-[200px]">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-black dark:text-white appearance-none cursor-pointer outline-none focus:bg-white`}
            >
              <option value="all">Filter: ALL LEVELS</option>
              <option value="high">Filter: CRITICAL (HIGH)</option>
              <option value="medium">Filter: WARNING (MED)</option>
              <option value="low">Filter: NOMINAL (LOW)</option>
            </select>
          </div>

          <button className={`p-4 bg-[#A3E635] ${blackBorder} rounded-2xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all`}>
            <Filter size={24} strokeWidth={3} />
          </button>
        </div>
      </motion.div>

      {/* 3. QUICK STATS SUMMARY */}
      <div className="flex flex-wrap gap-8 px-10 py-6 bg-white dark:bg-zinc-900 rounded-[2rem] ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex items-center gap-4">
          <div className={`p-2 bg-[#63D2F3] ${blackBorder} rounded-lg`}>
            <Users size={18} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-[12px] font-black text-black dark:text-white uppercase tracking-wider">
            Cohorts Enrolled: <span className="ml-1 opacity-60">{students.length}</span>
          </span>
        </div>
        <div className="h-6 w-[2px] bg-black/10 dark:bg-white/10 hidden md:block" />
        <div className="flex items-center gap-4">
          <div className={`h-4 w-4 rounded-full bg-[#FF6AC1] ${blackBorder} animate-pulse`} />
          <span className="text-[12px] font-black text-black dark:text-white uppercase tracking-wider">
            Urgent Interventions: <span className="text-[#FF6AC1] ml-1">{highRiskCount}</span>
          </span>
        </div>
        <div className="h-6 w-[2px] bg-black/10 dark:bg-white/10 hidden md:block" />
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-black text-black dark:text-white uppercase tracking-wider">
            Viewing: <span className="opacity-60 ml-1">{filteredStudents.length} Profiles</span>
          </span>
        </div>
      </div>

      {/* 4. MAIN TABLE SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <StudentTable students={filteredStudents} loading={loading} onSendNote={sendFacultyNote} />
      </motion.div>

    </div>
  );
}