"use client";

import { useState, useEffect } from "react";
import {
  Database, UploadCloud, FileSpreadsheet, Users, ArrowRight,
  Loader2, X, Download, Lock, AlertCircle, CheckCircle2, Zap
} from "lucide-react";
import Papa from "papaparse";
import { getToken } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function RegistrationPipeline() {
  interface Student {
    _id?: string;
    studentId: string;
    name: string;
    email: string;
    classes: string;
    Course: string;
    marks?: string;
    attendance?: string;
    password?: string;
    dateOfJoin?: string;
    language?: string;
    instituteName?: string;
    instituteId?: string;
    phoneNo?: string;
    parentsNo?: string;
    parents?: string;
  }

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [responseMessage, setResponseMessage] = useState<any>(null);
  const [token, setToken] = useState("");

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  useEffect(() => {
    const stored = getToken();
    if (stored) setToken(stored);
  }, []);

  const instituteName = "My Institute";
  const instituteId = "INST001";
  const API_AUTH_REGISTER = "https://campuspp-f7qx.onrender.com/api/auth/register";
  const API_STUDENT_EXPORT = "https://campuspp-f7qx.onrender.com/api/faculty/students/export";

  const fetchExistingStudents = async () => {
    if (!token) {
      alert("Session expired or missing. Please login again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_STUDENT_EXPORT, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      const dataArray = result.data || result.students || [];
      if (Array.isArray(dataArray)) {
        setStudents(dataArray);
        setFileName("Live Server Cloud");
        setIsReady(true);
      }
    } catch (err: any) {
      alert(`Fetch Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const currentYear = new Date().getFullYear();
        const formatted: Student[] = results.data.map((row: any, index: number) => ({
          email: row.email || row.Email || "",
          name: row.name || row.Name || "",
          studentId: `STU${currentYear}${Math.floor(Math.random() * 1000) + 1000 + index}`,
          dateOfJoin: row.dateOfJoin || row.DateOfJoin || new Date().toISOString().split('T')[0],
          classes: row.classes || row.Class || "SYIT",
          Course: row.Course || row.course || "Computer Science",
          language: row.language || row.Language || "English",
          phoneNo: row.phoneNo || row.PhoneNo || "",
          parentsNo: row.parentsNo || row.ParentsNo || "",
          parents: row.parents || row.Parents || "",
          password: row.password || Math.random().toString(36).slice(-8).toUpperCase(),
          instituteName: instituteName,
          instituteId: instituteId
        }));
        setStudents(formatted);
        setIsReady(true);
        setLoading(false);
      }
    });
  };

  const executeSync = async () => {
    if (responseMessage) {
      setResponseMessage(null);
      setStudents([]);
      setFileName("");
      return;
    }
    try {
      setLoading(true);
      const payloadStudents = students.map(({ _id, ...rest }) => ({
        ...rest,
        password: rest.password || "student123",
        instituteName: rest.instituteName || instituteName,
        instituteId: rest.instituteId || instituteId
      }));
      const res = await fetch(API_AUTH_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instituteName, instituteId, students: payloadStudents }),
      });
      const data = await res.json();
      setResponseMessage(data);
      if (res.ok) setIsReady(false);
    } catch (err) {
      alert("Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto space-y-12">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
                <Database className="text-black w-6 h-6" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">
                Nexus System / Data Node
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-none p-2">
              Student <br />
              <span className="relative inline-block mt-2">
                Registration.
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
              </span>
            </h1>
          </div>

          <button
            onClick={fetchExistingStudents}
            disabled={loading}
            className={`flex items-center gap-3 bg-white dark:bg-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${blackBorder} ${hardShadow} ${hoverEffect} disabled:opacity-50`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="text-[#8E97FD]" strokeWidth={3} />}
            Fetch Records
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* UPLOAD PANEL */}
          <div className="lg:col-span-4">
            <motion.div
              animate={isReady ? { rotate: [0, -1, 1, 0] } : {}}
              className={`relative min-h-[450px] rounded-[3rem] ${blackBorder} transition-all duration-300 flex flex-col items-center justify-center p-12 text-center
                ${isReady
                  ? 'bg-[#A3E635] shadow-none translate-x-[2px] translate-y-[2px]'
                  : `bg-white dark:bg-zinc-900 ${hardShadow}`}
              `}
            >
              {!isReady ? (
                <>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  <div className={`w-28 h-28 bg-[#F9F4F1] dark:bg-zinc-800 rounded-[2.5rem] ${blackBorder} flex items-center justify-center mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                    <UploadCloud size={48} className="text-[#8E97FD]" strokeWidth={3} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-black text-3xl uppercase tracking-tighter text-black dark:text-white">Upload Manifest</h3>
                    <p className="text-[11px] text-black/40 dark:text-white/40 font-black uppercase tracking-[0.2em]">Select Student .CSV Source</p>
                  </div>
                </>
              ) : (
                <div className="text-black w-full space-y-8">
                  <div className="flex justify-between items-start">
                    <FileSpreadsheet size={64} strokeWidth={3} />
                    <button onClick={() => { setStudents([]); setIsReady(false); setFileName(""); }} className={`bg-white p-3 rounded-xl ${blackBorder} hover:bg-[#FF6AC1] transition-colors`}>
                      <X size={24} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="text-left border-t-2 border-black pt-6">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-1">Source Uplinked</p>
                    <p className="text-3xl font-black truncate leading-none uppercase">{fileName}</p>
                    <div className="mt-6 inline-block bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest">
                      {students.length} Entities Detected
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* PREVIEW & RESPONSE PANEL */}
          <div className="lg:col-span-8">
            <div className={`bg-white dark:bg-zinc-900 rounded-[3rem] p-10 min-h-[550px] ${blackBorder} ${hardShadow} flex flex-col`}>

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4 text-black dark:text-white">
                  <div className={`p-2 bg-[#FFD600] ${blackBorder} rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                    <Users size={20} strokeWidth={3} />
                  </div>
                  <h3 className="font-black uppercase tracking-[0.3em] text-sm">
                    {responseMessage ? "Sync Summary" : "Pipeline Preview"}
                  </h3>
                </div>
              </div>

              <div className="flex-grow overflow-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {responseMessage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8"
                    >
                      <div className={`p-8 bg-[#A3E635] ${blackBorder} rounded-[2rem] flex items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                        <CheckCircle2 className="text-black" size={48} strokeWidth={3} />
                        <div>
                          <p className="text-black font-black uppercase text-xl leading-none mb-2">{responseMessage.message}</p>
                          <p className="text-black/60 text-xs font-black uppercase tracking-widest">Master ID: {responseMessage.instituteId || "NEX-01"}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : students.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-white dark:bg-zinc-900 border-b-[3px] border-black dark:border-white z-10">
                        <tr className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.25em]">
                          <th className="pb-6 px-4">Student Profile</th>
                          <th className="pb-6 px-4">Cohort / Program</th>
                          <th className="pb-6 px-4">Guardian / Contact</th>
                          <th className="pb-6 px-4">Auth Key</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-[2px] divide-black/5 dark:divide-white/5">
                        {students.slice(0, 10).map((s, i) => (
                          <tr key={i} className="text-black dark:text-white group">
                            <td className="py-6 px-4">
                              <p className="font-black text-base tracking-tight uppercase leading-none mb-1">{s.name}</p>
                              <p className="text-[10px] text-black/40 dark:text-white/40 font-black uppercase tracking-widest">{s.email}</p>
                            </td>
                            <td className="py-6 px-4">
                              <p className="text-[#8E97FD] text-xs font-black uppercase tracking-widest leading-none mb-1">{s.Course || "N/A"}</p>
                              <p className="text-black/40 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">{s.studentId}</p>
                              {s.language && <p className="text-[9px] font-black text-[#A3E635] uppercase mt-1">Lang: {s.language}</p>}
                            </td>
                            <td className="py-6 px-4">
                              <p className="font-black text-xs uppercase tracking-tight leading-none mb-1 text-black dark:text-white">{s.parents || "No Guardian"}</p>
                              <div className="flex flex-col gap-1">
                                <p className="text-[9px] text-black/40 dark:text-white/40 font-black uppercase tracking-widest">S: {s.phoneNo || "N/A"}</p>
                                <p className="text-[9px] text-black/40 dark:text-white/40 font-black uppercase tracking-widest">P: {s.parentsNo || "N/A"}</p>
                              </div>
                            </td>
                            <td className="py-6 px-4">
                              <div className={`inline-flex items-center gap-3 bg-[#F9F4F1] dark:bg-zinc-800 px-4 py-2 rounded-xl ${blackBorder}`}>
                                <Lock size={12} className="text-black/40 dark:text-white/40" strokeWidth={3} />
                                <p className="text-[11px] font-black uppercase tracking-widest">
                                  {s.password || "••••••"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <AlertCircle size={80} strokeWidth={1} />
                      <p className="text-sm font-black uppercase tracking-[0.5em] mt-6">Awaiting Data Uplink</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-10">
                <button
                  disabled={(!isReady && !responseMessage) || loading}
                  onClick={executeSync}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-base flex items-center justify-center gap-4 transition-all ${blackBorder}
                    ${(isReady || responseMessage) && !loading
                      ? `bg-[#FFD600] text-black ${hardShadow} ${hoverEffect}`
                      : 'bg-black/10 dark:bg-white/10 text-black/20 dark:text-white/20 cursor-not-allowed'}
                  `}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      {responseMessage ? "Clear & Re-initialize" : "Execute Registration"}
                      <Zap size={20} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}