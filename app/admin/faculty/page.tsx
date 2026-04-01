"use client";

import { useEffect, useState, useCallback } from "react";
import {
  UserCog,
  Plus,
  Users,
  Mail,
  X,
  Check,
  Search,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";

type Faculty = {
  _id: string;
  name: string;
  email: string;
  studentCount?: number;
  assignedStudentCount?: number;
  students?: string[];
};

type Student = {
  _id: string;
  name: string;
  studentId: string;
  email: string;
};

type Toast = { id: number; message: string; type: "success" | "error" };

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [facultyStudentsMap, setFacultyStudentsMap] = useState<{ [fid: string]: Student[] }>({});
  const [fetchingStudents, setFetchingStudents] = useState<string | null>(null);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
  const [createError, setCreateError] = useState("");

  // Assign modal state
  const [assignFaculty, setAssignFaculty] = useState<Faculty | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchFaculty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await apiRequest("/faculty/admin/faculty", { method: "GET" });
      
      const payload = res?.data || res || {};
      const list = payload?.faculty || payload?.data || payload || [];
      
      setFaculty(Array.isArray(list) ? list : (Array.isArray(res?.data?.data) ? res.data.data : []));
    } catch (err: any) {
      setError(err?.message || "Failed to load faculty.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res: any = await apiRequest("/faculty/students", { method: "GET" });
      
      const payload = res?.data || res || {};
      const list = payload?.students || payload?.data || payload || [];
      
      setStudents(Array.isArray(list) ? list : (Array.isArray(res?.data?.data) ? res.data.data : []));
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
    fetchStudents();
  }, [fetchFaculty, fetchStudents]);

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      setCreateError("All fields are required.");
      return;
    }
    try {
      setCreateLoading(true);
      setCreateError("");
      await apiRequest("/faculty/admin/faculty/create", {
        method: "POST",
        body: JSON.stringify(createForm),
      });
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "" });
      addToast("Faculty created successfully!", "success");
      await fetchFaculty();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create faculty.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignFaculty || selectedStudentIds.length === 0) return;
    try {
      setAssignLoading(true);
      await apiRequest(`/faculty/admin/faculty/${assignFaculty._id}/assign`, {
        method: "POST",
        body: JSON.stringify({ studentIds: selectedStudentIds }),
      });
      setAssignFaculty(null);
      setSelectedStudentIds([]);
      addToast(`${selectedStudentIds.length} student(s) assigned to ${assignFaculty.name}`, "success");
      await fetchFaculty();
    } catch (err: any) {
      addToast(err?.message || "Assignment failed.", "error");
    } finally {
      setAssignLoading(false);
    }
  };

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen p-6 md:p-12 space-y-12 transition-colors duration-300">

      {/* TOAST SYSTEM */}
      <div className="fixed top-10 right-10 z-[250] space-y-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl ${blackBorder} ${hardShadow} font-black text-xs uppercase tracking-widest ${t.type === "success" ? "bg-[#A3E635] text-black" : "bg-[#FF6AC1] text-black"
                }`}
            >
              {t.type === "success" ? <Check size={20} strokeWidth={3} /> : <AlertTriangle size={20} strokeWidth={3} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-[#8E97FD] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
              <UserCog size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Nexus / Personnel</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-none p-2">
            Faculty <br />
            <span className="relative inline-block mt-2">
              Management.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#A3E635] -z-10 -rotate-1" />
            </span>
          </h1>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className={`flex items-center gap-3 bg-[#FFD600] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${blackBorder} ${hardShadow} ${hoverEffect}`}
        >
          <Plus size={20} strokeWidth={4} />
          Add Faculty Member
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 bg-[#FF6AC1] ${blackBorder} rounded-2xl flex items-center gap-4 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
          <AlertTriangle size={24} strokeWidth={3} />
          <p className="text-sm font-black uppercase">{error}</p>
          <button onClick={fetchFaculty} className="ml-auto bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase underline">Retry</button>
        </motion.div>
      )}

      {/* SEARCH BAR */}
      <div className="relative group max-w-3xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black dark:text-white group-focus-within:text-[#8E97FD] transition-colors" size={20} strokeWidth={3} />
        <input
          type="text"
          placeholder="Scan personnel by name or nexus email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2rem] py-5 pl-16 pr-8 text-sm font-bold text-black dark:text-white outline-none focus:shadow-none transition-all ${hardShadow}`}
        />
      </div>

      {/* FACULTY LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-black dark:text-white opacity-40">
          <Loader2 className="animate-spin" size={48} strokeWidth={3} />
          <span className="text-sm font-black uppercase tracking-[0.4em]">Syncing Personnel Data...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] ${blackBorder} ${hardShadow}`}>
          <UserCog size={80} className="mx-auto mb-6 opacity-10" strokeWidth={1} />
          <p className="text-2xl font-black uppercase text-black dark:text-white">No Personnel Detected.</p>
          <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-40">Initialize your first faculty member above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filtered.map((f, idx) => (
            <motion.div
              key={f._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white dark:bg-zinc-900 ${blackBorder} rounded-[2.5rem] p-8 ${hardShadow} ${hoverEffect}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`h-16 w-16 rounded-[1.5rem] bg-[#8E97FD] ${blackBorder} flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <UserCog size={32} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-black dark:text-white text-2xl uppercase tracking-tighter leading-none mb-1">{f.name}</h3>
                    <p className="text-[11px] font-black text-black/40 dark:text-white/40 flex items-center gap-2 uppercase tracking-widest">
                      <Mail size={12} strokeWidth={3} /> {f.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className={`flex items-center gap-2 bg-[#F9F4F1] dark:bg-zinc-800 px-5 py-2.5 rounded-xl border-2 border-black dark:border-white`}>
                    <Users size={16} className="text-[#8E97FD]" strokeWidth={3} />
                    <span className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest">
                      {facultyStudentsMap[f._id] ? facultyStudentsMap[f._id].length : (f.assignedStudentCount ?? f.studentCount ?? f.students?.length ?? 0)} Students
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAssignFaculty(f);
                      // Pre-load existing assignments from the map if it exists
                      const existing = facultyStudentsMap[f._id]?.map(s => s._id) || [];
                      setSelectedStudentIds(existing);
                    }}
                    className={`bg-[#A3E635] text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${blackBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`}
                  >
                    Assign
                  </button>
                  <button
                    onClick={async () => {
                      const fid = f._id;
                      if (expandedFaculty === fid) {
                        setExpandedFaculty(null);
                      } else {
                        setExpandedFaculty(fid);
                        // Fetch their students if not already cached
                        if (!facultyStudentsMap[fid]) {
                          try {
                            setFetchingStudents(fid);
                            const res: any = await apiRequest(`/faculty/admin/faculty/${fid}/students`, { method: "GET" });
                            const data = res?.data || res || [];
                            setFacultyStudentsMap(prev => ({ ...prev, [fid]: Array.isArray(data) ? data : [] }));
                          } catch (err) {
                            console.error("Failed to fetch faculty students:", err);
                          } finally {
                            setFetchingStudents(null);
                          }
                        }
                      }
                    }}
                    className={`p-2.5 rounded-xl bg-white dark:bg-zinc-800 ${blackBorder} text-black dark:text-white hover:bg-[#FFD600] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {expandedFaculty === f._id ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedFaculty === f._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t-[3px] border-black/10 dark:border-white/10 space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Assigned Cohort Entities</h4>
                        <div className="h-1 flex-grow mx-4 border-b border-black/5" />
                      </div>

                      {fetchingStudents === f._id ? (
                        <div className="flex items-center gap-3 py-4 opacity-50">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Accessing student directory...</span>
                        </div>
                      ) : (facultyStudentsMap[f._id]?.length ?? 0) === 0 ? (
                        <div className="py-4 text-[10px] font-black uppercase tracking-widest opacity-20">No students linked to this node.</div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {facultyStudentsMap[f._id].map(s => (
                            <div key={s._id} className={`group/item flex items-center justify-between p-3 bg-[#F9F4F1] dark:bg-zinc-800/50 rounded-xl border-2 border-black/5 dark:border-white/5 hover:border-black transition-all`}>
                              <div className="flex items-center gap-3 truncate">
                                <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-black/10">
                                  <Users size={14} className="text-[#8E97FD]" />
                                </div>
                                <div className="truncate">
                                  <p className="text-[11px] font-black uppercase truncate text-black dark:text-white">{s.name}</p>
                                  <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter truncate">{s.studentId}</p>
                                </div>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (confirm(`Remove ${s.name} from this faculty unit?`)) {
                                    try {
                                      const remainingIds = facultyStudentsMap[f._id].filter(st => st._id !== s._id).map(st => st._id);
                                      await apiRequest(`/faculty/admin/faculty/${f._id}/assign`, {
                                        method: "POST",
                                        body: JSON.stringify({ studentIds: remainingIds }),
                                      });
                                      addToast("Student unlinked successfully.", "success");
                                      // Refresh only this map
                                      const res: any = await apiRequest(`/faculty/admin/faculty/${f._id}/students`, { method: "GET" });
                                      setFacultyStudentsMap(prev => ({ ...prev, [f._id]: res.data || [] }));
                                      await fetchFaculty();
                                    } catch (err: any) {
                                      addToast(err.message || "Removal failed.", "error");
                                    }
                                  }
                                }}
                                className="p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 bg-[#FF6AC1] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                              >
                                <X size={12} strokeWidth={4} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#8E97FD] border border-black" />
                        <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                          UUID: <span className="text-black dark:text-white">{f._id}</span>
                        </p>
                      </div>
                      <p className="text-sm font-black text-black dark:text-white uppercase">
                        Status: <span className="text-[#A3E635]">Operational</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white dark:bg-zinc-900 rounded-[3rem] p-10 w-full max-w-xl ${blackBorder} ${hardShadow}`}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">Add Faculty</h2>
                  <p className="text-[10px] font-black text-[#8E97FD] uppercase tracking-[0.3em]">Initialize Personnel Node</p>
                </div>
                <button onClick={() => { setShowCreate(false); setCreateError(""); }} className={`p-3 rounded-xl bg-[#F9F4F1] dark:bg-zinc-800 ${blackBorder} hover:bg-[#FF6AC1] transition-colors`}>
                  <X size={24} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "jane@nexus.edu" },
                  { key: "password", label: "Security Key", type: "password", placeholder: "••••••••" },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(createForm as any)[field.key]}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} rounded-2xl py-4 px-6 text-sm font-bold text-black dark:text-white outline-none focus:bg-white transition-all`}
                    />
                  </div>
                ))}

                {createError && (
                  <p className="text-xs font-black text-[#FF6AC1] uppercase flex items-center gap-2 mt-4">
                    <AlertTriangle size={16} strokeWidth={3} /> {createError}
                  </p>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => { setShowCreate(false); setCreateError(""); }}
                    className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-black dark:border-white hover:bg-black/5 transition-all`}
                  >
                    Abort
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={createLoading}
                    className={`flex-1 py-5 rounded-2xl bg-[#A3E635] text-black font-black uppercase text-xs tracking-widest ${blackBorder} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-50 flex items-center justify-center gap-3`}
                  >
                    {createLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={4} />}
                    Initialize
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN MODAL */}
      <AnimatePresence>
        {assignFaculty && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white dark:bg-zinc-900 rounded-[3rem] p-10 w-full max-w-2xl ${blackBorder} ${hardShadow} max-h-[85vh] flex flex-col`}
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">Assign Cohort</h2>
                  <p className="text-[10px] font-black text-[#8E97FD] uppercase tracking-[0.3em]">Linking Entities to: {assignFaculty.name}</p>
                </div>
                <button onClick={() => setAssignFaculty(null)} className={`p-3 rounded-xl bg-[#F9F4F1] dark:bg-zinc-800 ${blackBorder} hover:bg-[#FF6AC1] transition-colors`}>
                  <X size={24} strokeWidth={3} />
                </button>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <Users size={64} className="mx-auto mb-4" strokeWidth={1} />
                  <p className="text-xl font-black uppercase tracking-widest">No entities available</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6 px-1">
                    <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">
                      Available Student Directory
                    </p>
                    <div className="bg-black text-white px-3 py-1 rounded-md text-[10px] font-black">
                      {selectedStudentIds.length} SELECTED
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
                    {students.map((s) => {
                      const isSelected = selectedStudentIds.includes(s._id);
                      return (
                        <button
                          key={s._id}
                          onClick={() => toggleStudent(s._id)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl border-[3px] transition-all text-left ${isSelected
                              ? "border-black bg-[#FFD600] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1"
                              : "border-black/5 dark:border-white/5 bg-[#F9F4F1] dark:bg-zinc-800/50 hover:border-black"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-6 w-6 rounded-lg border-[3px] border-black flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-black" : "bg-white"
                              }`}>
                              {isSelected && <Check size={16} className="text-[#A3E635]" strokeWidth={4} />}
                            </div>
                            <div>
                              <p className="text-base font-black text-black dark:text-white uppercase leading-none mb-1">{s.name}</p>
                              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{s.studentId} • {s.email}</p>
                            </div>
                          </div>
                          <Zap size={16} className={isSelected ? "text-black" : "opacity-5"} fill="currentColor" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 pt-8 shrink-0">
                    <button
                      onClick={() => setAssignFaculty(null)}
                      className={`flex-1 py-5 rounded-2xl border-2 border-black dark:border-white font-black uppercase text-xs tracking-widest transition-all`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssign}
                      disabled={assignLoading || selectedStudentIds.length === 0}
                      className={`flex-1 py-5 rounded-2xl bg-[#8E97FD] text-black font-black uppercase text-xs tracking-widest ${blackBorder} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-40 flex items-center justify-center gap-3 transition-all`}
                    >
                      {assignLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={4} />}
                      Link Entities
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}