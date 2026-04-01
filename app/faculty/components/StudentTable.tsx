"use client";

import { useState } from "react";
import Link from "next/link";
import RiskBadge from "./RiskBadge";
import { ChevronRight, User, BrainCircuit, MessageCircleMore, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Student = {
  _id: string;
  email: string;
  name: string;
  studentId: string;
  Course: string;
  attendance: string;
  classes: string;
  marks: string;
  phoneNo?: string;
  parentsNo?: string;
  parents?: string;
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

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onSendNote: (studentId: string, note: string) => Promise<{ notificationSent?: boolean; notificationMessage?: string }>;
}

export default function StudentTable({ students, loading, onSendNote }: StudentTableProps) {
  const [noteStudent, setNoteStudent] = useState<Student | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  const submitNote = async () => {
    if (!noteStudent) return;
    const clean = note.trim();
    if (clean.length < 2 || clean.length > 1000) {
      alert("Note must be between 2 and 1000 characters.");
      return;
    }

    try {
      setSending(true);
      const result = await onSendNote(noteStudent.studentId, clean);
      if (result?.notificationSent === false) {
        alert(`Annotation sent, but push notification failed${result.notificationMessage ? `: ${result.notificationMessage}` : "."}`);
      } else {
        alert("Faculty annotation and notification sent successfully.");
      }
      setNote("");
      setNoteStudent(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send note";
      alert(message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className={`w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] ${blackBorder} ${hardShadow} p-8`}>
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-black/10 dark:bg-white/10 rounded-2xl w-full" />
          <div className="h-14 bg-black/5 dark:bg-white/5 rounded-2xl w-full" />
          <div className="h-14 bg-black/5 dark:bg-white/5 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className={`w-full bg-white dark:bg-zinc-900 rounded-[3rem] ${blackBorder} ${hardShadow} p-20 text-center`}>
        <div className="inline-flex p-6 bg-[#F9F4F1] dark:bg-zinc-800 rounded-full mb-6 border-2 border-black dark:border-white">
          <User size={40} className="text-black/20" />
        </div>
        <p className="text-xl font-black text-black dark:text-white uppercase tracking-tight">No entities detected in the current cohort.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] ${blackBorder} ${hardShadow} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F4F1] dark:bg-zinc-800 border-b-[3px] border-black dark:border-white">
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] text-black dark:text-white">Student Profile</th>
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] text-black dark:text-white">Academic Risk</th>
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.3em] text-black dark:text-white hidden md:table-cell">Performance Index</th>
                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.3em] text-black dark:text-white">Neural Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-[2px] divide-black/10 dark:divide-white/10">
              {students.map((s, index) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-[#8E97FD]/5 transition-colors"
                >
                  {/* NAME & AVATAR */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 bg-white dark:bg-zinc-800 ${blackBorder} rounded-xl flex items-center justify-center text-black dark:text-white group-hover:bg-[#8E97FD] group-hover:rotate-3 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                        <User size={24} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-black dark:text-white tracking-tighter leading-none mb-1">{s.name}</p>
                        <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest leading-none">
                          {s.studentId} <span className="mx-1 opacity-20">•</span> {s.Course}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* RISK BADGE */}
                  <td className="px-8 py-6">
                    <RiskBadge level={s.performance?.riskLevel || "Low"} />
                  </td>

                  {/* PERFORMANCE SCORE */}
                  <td className="px-8 py-6 hidden md:table-cell">
                    <div className="w-40">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-wider">P-Score: {s.performance?.score || 0}%</span>
                      </div>
                      <div className={`w-full bg-[#F9F4F1] dark:bg-zinc-800 rounded-full h-4 ${blackBorder} p-[2px] overflow-hidden`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.performance?.score || 0}%` }}
                          transition={{ duration: 1.2, ease: "circOut" }}
                          className={`h-full rounded-full border-r-2 border-black dark:border-white ${(s.performance?.score || 0) < 50 ? 'bg-[#FF6AC1]' : (s.performance?.score || 0) < 80 ? 'bg-[#FFD600]' : 'bg-[#A3E635]'
                            }`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {["High", "Medium"].includes(s.performance?.riskLevel || "") && (
                        <button
                          onClick={() => {
                            setNoteStudent(s);
                            setNote("");
                          }}
                          className={`inline-flex items-center gap-2 bg-[#FFD600] text-black px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all`}
                        >
                          <MessageCircleMore size={16} strokeWidth={3} />
                          Intervene
                        </button>
                      )}

                      <Link href={`/faculty/students/${s.studentId}`}>
                        <button className={`inline-flex items-center gap-2 bg-[#8E97FD] text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all`}>
                          <BrainCircuit size={16} strokeWidth={3} />
                          Deep Insights
                        </button>
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {noteStudent && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-xl bg-white dark:bg-zinc-900 ${blackBorder} rounded-[3rem] p-10 ${hardShadow}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8E97FD]">
                    Intervention Log
                  </h3>
                  <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter">
                    Faculty Annotation
                  </h2>
                </div>
                <button
                  onClick={() => setNoteStudent(null)}
                  className={`p-3 rounded-xl bg-[#F9F4F1] dark:bg-zinc-800 ${blackBorder} hover:bg-[#FF6AC1] transition-colors`}
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className={`p-6 bg-[#F9F4F1] dark:bg-zinc-800 ${blackBorder} rounded-2xl mb-8 flex items-center gap-4`}>
                <div className={`h-12 w-12 bg-white dark:bg-zinc-900 ${blackBorder} rounded-xl flex items-center justify-center`}>
                  <User size={24} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xl font-black text-black dark:text-white tracking-tight leading-none mb-1">
                    {noteStudent.name}
                  </p>
                  <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest leading-none">
                    {noteStudent.studentId} • {noteStudent.Course}
                  </p>
                </div>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="Initialize risk mitigation protocol message..."
                className={`w-full rounded-2xl bg-[#F9F4F1] dark:bg-zinc-950 ${blackBorder} p-6 text-base font-bold outline-none focus:ring-4 focus:ring-[#8E97FD]/20 transition-all placeholder:text-black/20 dark:placeholder:text-white/20`}
              />

              <div className="flex items-center justify-between mt-8">
                <span className={`text-[11px] font-black uppercase tracking-widest ${note.length > 900 ? 'text-[#FF6AC1]' : 'text-black/40'}`}>
                  {note.trim().length} / 1000 CHARS
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setNoteStudent(null)}
                    className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-black dark:text-white border-2 border-transparent hover:border-black dark:hover:border-white transition-all`}
                  >
                    Abort
                  </button>
                  <button
                    disabled={sending || note.trim().length < 2}
                    onClick={submitNote}
                    className={`px-8 py-3 rounded-xl bg-[#A3E635] text-black text-[11px] font-black uppercase tracking-widest ${blackBorder} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-40 transition-all`}
                  >
                    {sending ? "Transmitting..." : "Initialize Alert"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}