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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";

type Faculty = {
  _id: string;
  name: string;
  email: string;
  studentCount?: number;
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
      const list = res.data ?? res.faculty ?? res ?? [];
      setFaculty(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load faculty.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res: any = await apiRequest("/faculty/students", { method: "GET" });
      const list = res.data ?? res.students ?? res ?? [];
      setStudents(Array.isArray(list) ? list : []);
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
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* TOAST */}
      <div className="fixed top-6 right-6 z-[200] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-sm ${
                t.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {t.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-violet-500/20 rounded-lg">
              <UserCog size={18} className="text-violet-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Admin / Faculty</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase">
            Faculty <span className="text-violet-500">Management</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Create, view and assign students to faculty members
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-3 bg-violet-500 hover:bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} strokeWidth={3} />
          Add Faculty
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
          <AlertTriangle size={18} />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchFaculty} className="ml-auto text-xs font-black uppercase underline">
            Retry
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search faculty by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none dark:text-white shadow-sm"
        />
      </div>

      {/* FACULTY LIST */}
      {loading ? (
        <div className="flex items-center justify-center h-40 gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-sm font-bold">Loading faculty...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <UserCog size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No faculty found.</p>
          <p className="text-xs mt-1">Create your first faculty member above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((f, idx) => (
            <motion.div
              key={f._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <UserCog size={22} className="text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">{f.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail size={10} /> {f.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                    <Users size={13} className="text-violet-500" />
                    <span className="text-[10px] font-black text-slate-600 dark:text-zinc-300 uppercase">
                      {f.studentCount ?? f.students?.length ?? 0} students
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAssignFaculty(f);
                      setSelectedStudentIds([]);
                    }}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                  >
                    Assign Students
                  </button>
                  <button
                    onClick={() => setExpandedFaculty(expandedFaculty === f._id ? null : f._id)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-violet-500 transition-colors"
                  >
                    {expandedFaculty === f._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expandedFaculty === f._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800"
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Faculty ID: <span className="text-violet-500">{f._id}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      {(f.studentCount ?? f.students?.length ?? 0) === 0
                        ? "No students assigned yet."
                        : `${f.studentCount ?? f.students?.length} student(s) currently assigned.`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE FACULTY MODAL */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Create Faculty
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Add a new faculty member
                  </p>
                </div>
                <button
                  onClick={() => { setShowCreate(false); setCreateError(""); }}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "jane@campus.edu" },
                  { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1.5 block">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(createForm as any)[field.key]}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500 dark:text-white transition-all"
                    />
                  </div>
                ))}

                {createError && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-2">
                    <AlertTriangle size={14} /> {createError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowCreate(false); setCreateError(""); }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={createLoading}
                    className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {createLoading ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ASSIGN STUDENTS MODAL */}
      <AnimatePresence>
        {assignFaculty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-zinc-800 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Assign Students
                  </h2>
                  <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mt-1">
                    To: {assignFaculty.name}
                  </p>
                </div>
                <button
                  onClick={() => setAssignFaculty(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold text-sm">No students available</p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                    Select students ({selectedStudentIds.length} selected)
                  </p>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {students.map((s) => {
                      const isSelected = selectedStudentIds.includes(s._id);
                      return (
                        <button
                          key={s._id}
                          onClick={() => toggleStudent(s._id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                            isSelected
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                              : "border-slate-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? "bg-violet-500 border-violet-500" : "border-slate-300 dark:border-zinc-600"
                          }`}>
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase">{s.name}</p>
                            <p className="text-[9px] font-bold text-slate-400">{s.studentId} · {s.email}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4 shrink-0">
                    <button
                      onClick={() => setAssignFaculty(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssign}
                      disabled={assignLoading || selectedStudentIds.length === 0}
                      className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {assignLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      {assignLoading ? "Assigning..." : `Assign ${selectedStudentIds.length}`}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
