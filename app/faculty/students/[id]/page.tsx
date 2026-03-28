"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Target,
  GraduationCap,
  Zap,
  Shield,
  Activity,
  Brain,
  BarChart3,
  Gauge,
  ArrowUpRight,
  Minus,
  Lightbulb,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
// ── CONSTANTS ─────────────────────────────────────────────────
const PERFORMANCE_API = "https://campuspp-f7qx.onrender.com/api";

// ── DESIGN TOKENS (Neubrutalism) ──────────────────────────────
const BB  = "border-[3px] border-black dark:border-white";
const HS  = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";
const HE  = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";
// Legacy aliases so unchanged JSX still compiles
const BORDER = BB;
const HOVER  = HE;

// ── TYPES ─────────────────────────────────────────────────────
interface CurrentPerformance {
  isAtRisk: boolean;
  riskFactors: string[];
  attendance: number;
  internalMarks: number;
  subjectMarks?: Record<string, number>;
  lowSubjectMarks?: Array<{ subject: string; marks: number }>;
  subjectRecommendations?: Array<{
    subject: string;
    currentMarks: number;
    recommendation: string;
    focusAreas: string[];
  }>;
  assignmentScore: number;
  lmsEngagement: number;
  quizScore: number | null;
  trends: string;
  recommendations: string[];
  analysisDate: string;
  score: number;
  riskLevel: "High" | "Medium" | "Low";
  reason: string;
  strengths: string[];
  concerns: string[];
  intervention: {
    required: boolean;
    priority?: string;
    owner?: string;
    triggeredBy?: string;
    actions?: Array<{
      type: string;
      description: string;
      status: string;
      initiatedAt?: string;
      completedAt?: string | null;
      _id?: string;
    }>;
    nextReviewDate?: string;
    lastReviewDate?: string | null;
    interventionHistory?: Array<{
      date: string;
      action: string;
      outcome: string;
      performedBy: string;
      _id?: string;
    }>;
  };
  metadata?: {
    attendance?: number;
    marks?: number;
    lmsEngagement?: number;
    assignmentsSubmitted?: number;
    totalAssignments?: number;
    assignmentCompletion?: number;
    quizScore?: number;
  };
  predictiveIntelligence?: {
    academicStability?: {
      stabilityScore: number;
      baseFailureRisk: number;
      finalRisk: number;
      predictionConfidence: number;
      quizScoreSource: string;
      resolvedQuizScore: number;
      label: string;
    };
    trendAnalysis?: {
      trend: string;
      direction: string;
      riskAdjustment: number;
      trendBreakdown: Record<string, string>;
      historicalStabilityScores: number[];
      historicalCount: number;
      label: string;
    };
    riskBreakdown?: {
      primaryWeakness: string;
      primaryWeaknessValue: number;
      reasons: string[];
      positiveFactors: string[];
      negativeFactors: string[];
      metricValues: Record<string, number>;
    };
    impactSimulator?: Array<{
      metric: string;
      metricLabel: string;
      currentValue: number;
      simulatedValue: number;
      currentRisk: number;
      newRisk: number;
      riskReduction: number;
      newStability: number;
      label: string;
    }>;
    actionPlan?: {
      focusArea: string;
      expectedRiskReduction: string;
      days: Array<{ day: number; task: string }>;
      startDate: string;
      endDate: string;
    };
    smartAlert?: {
      level: string;
      icon: string;
      color: string;
      message: string;
      notifyMentor: boolean;
      actionRequired: boolean;
    };
    generatedAt?: string;
  };
}

interface StudentPerformanceResponse {
  studentId: string;
  studentName: string;
  totalAnalyses: number;
  fallbackUsed: boolean;
  currentPerformance: CurrentPerformance;
}

// ── SKELETON ──────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-black/10 dark:bg-white/10 rounded-2xl ${className}`} />
);

// ── CARD COMPONENT ────────────────────────────────────────────
const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-white dark:bg-zinc-900 ${BB} ${HS} rounded-[2rem] p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ── PROGRESS RING ─────────────────────────────────────────────
function ProgressRing({ value, size = 120, strokeWidth = 10, color = "#61C6EA", label }: { value: number; size?: number; strokeWidth?: number; color?: string; label?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-slate-100 dark:text-zinc-800" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-[1000] tracking-tighter">{value}</span>
        {label && <span className="text-[8px] font-black uppercase tracking-widest text-[#8799B5]">{label}</span>}
      </div>
    </div>
  );
}

// ── METRIC BAR ────────────────────────────────────────────────
function MetricBar({ label, value, max = 100, color = "#63D2F3" }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">{label}</span>
        <span className="text-sm font-black text-black dark:text-white">{value}<span className="text-black/40 dark:text-white/40 text-xs">/{max}</span></span>
      </div>
      <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-none border-[2px] border-black dark:border-white overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, badge }: { icon: React.ComponentType<any>; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 bg-[#8E97FD] ${BB} rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
        <Icon size={18} strokeWidth={3} className="text-black" />
      </div>
      <h2 className="text-lg font-black uppercase tracking-tighter text-black dark:text-white">{title}</h2>
      {badge && (
        <span className={`ml-auto px-3 py-1 ${BB} rounded-lg text-[9px] font-black uppercase bg-[#FFD600] text-black`}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ── MAIN PAGE COMPONENT ───────────────────────────────────────
export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [data, setData] = useState<StudentPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentPerformance() {
      try {
        const token = getToken();
        const res = await fetch(`${PERFORMANCE_API}/student/public/performance/${studentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        setData(json.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch student performance:", err);
        setError("Unable to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (studentId) fetchStudentPerformance();
  }, [studentId]);

  // ── LOADING STATE ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6 bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // ── ERROR STATE ─────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-10 bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black dark:text-white mb-6 ${BB} px-4 py-2 rounded-xl ${HE} ${HS} bg-white dark:bg-zinc-900`}
        >
          <ArrowLeft size={16} strokeWidth={3} /> Back to Students
        </button>
        <div className={`${BB} ${HS} rounded-[2rem] p-12 text-center bg-white dark:bg-zinc-900`}>
          <AlertTriangle size={48} className="mx-auto text-[#FF6AC1] mb-4" strokeWidth={3} />
          <p className="font-black text-lg uppercase text-black dark:text-white">{error || "Student not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-6 px-6 py-3 bg-[#FF6AC1] text-black ${BB} ${HS} ${HE} font-black text-xs uppercase tracking-wider rounded-2xl`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const perf = data.currentPerformance;
  const pi = perf.predictiveIntelligence;
  const stability = pi?.academicStability;
  const trend = pi?.trendAnalysis;
  const riskBreak = pi?.riskBreakdown;
  const simulator = pi?.impactSimulator;
  const actionPlan = pi?.actionPlan;
  const smartAlert = pi?.smartAlert;

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": case "critical": return { bg: "bg-[#E96D7C]/10", border: "border-[#E96D7C]/30", text: "text-[#E96D7C]", fill: "#E96D7C" };
      case "medium": return { bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/30", text: "text-[#F5A623]", fill: "#F5A623" };
      default: return { bg: "bg-[#61C6EA]/10", border: "border-[#61C6EA]/30", text: "text-[#61C6EA]", fill: "#61C6EA" };
    }
  };
  const risk = getRiskColor(perf.riskLevel);

  const getTrendIcon = (val: string) => {
    if (val?.includes("↑") || val === "Improving") return <TrendingUp size={16} className="text-emerald-500" />;
    if (val?.includes("↓") || val === "Declining") return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-[#8799B5]" />;
  };

  const getAlertStyles = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "danger": case "critical": return { bg: "bg-red-500/10 border-red-500/20", text: "text-red-500" };
      case "warning": return { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-500" };
      default: return { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-500" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 md:px-10 bg-[#F9F4F1] dark:bg-zinc-950 min-h-screen pt-8">

      {/* ── BACK BUTTON ────────────────────────────────────── */}
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black dark:text-white ${BB} px-4 py-2 rounded-xl ${HE} ${HS} bg-white dark:bg-zinc-900`}
      >
        <ArrowLeft size={16} strokeWidth={3} /> Back to Students
      </button>

      {/* ── SMART ALERT BANNER ─────────────────────────────── */}
      {smartAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-4 p-5 ${BB} ${HS} rounded-[2rem] ${
            smartAlert.level?.toLowerCase() === 'danger' || smartAlert.level?.toLowerCase() === 'critical'
              ? 'bg-[#FF6AC1]'
              : smartAlert.level?.toLowerCase() === 'warning'
              ? 'bg-[#FFD600]'
              : 'bg-[#A3E635]'
          }`}
        >
          <span className="text-3xl">{smartAlert.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-black uppercase tracking-tight text-black">{smartAlert.message}</p>
            <div className="flex gap-4 mt-1">
              {smartAlert.notifyMentor && <span className="text-[9px] font-black uppercase tracking-widest text-black/60">⚡ Mentor Notified</span>}
              {smartAlert.actionRequired && <span className="text-[9px] font-black uppercase tracking-widest text-black/60">🔴 Action Required</span>}
            </div>
          </div>
          <span className={`px-4 py-2 ${BB} rounded-xl text-[9px] font-black uppercase text-black bg-white/60`}>
            {smartAlert.level}
          </span>
        </motion.div>
      )}

      {/* ── STUDENT HEADER ─────────────────────────────────── */}
      <Card delay={0.05} className="relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`h-20 w-20 bg-[#8E97FD] ${BB} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center rotate-3`}>
              <User size={36} strokeWidth={3} className="text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black dark:text-white">{data.studentName}</h1>
            </div>
          </div>

          {/* Risk Badge */}
          <div className={`flex flex-col items-center gap-2 px-8 py-5 ${BB} ${HS} rounded-[2rem] ${
            perf.riskLevel === 'High' ? 'bg-[#FF6AC1]' : perf.riskLevel === 'Medium' ? 'bg-[#FFD600]' : 'bg-[#A3E635]'
          }`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-black/60">Risk Level</p>
            <p className="text-4xl font-black text-black uppercase">{perf.riskLevel}</p>
          </div>
        </div>
      </Card>

      {/* ── TOP METRIC CARDS ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Score",        value: perf.score,                                 suffix: "/100", icon: Target,        bg: "#63D2F3" },
          { label: "Stability",    value: stability?.stabilityScore ?? 0,             suffix: "/100", icon: Gauge,          bg: "#8E97FD" },
          { label: "Failure Risk", value: stability?.finalRisk ?? 0,                  suffix: "%",    icon: AlertTriangle,  bg: "#FF6AC1" },
          { label: "Confidence",   value: stability?.predictionConfidence ?? 0,       suffix: "%",    icon: Brain,          bg: "#A3E635" },
          { label: "Quiz Score",   value: stability?.resolvedQuizScore ?? perf.quizScore ?? 0, suffix: "/100", icon: Sparkles, bg: "#FFD600" },
        ].map((m, i) => (
          <Card key={i} delay={0.1 + i * 0.05} className="flex flex-col items-center text-center">
            <div className={`p-3 ${BB} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl mb-3 group-hover:rotate-6 transition-transform`} style={{ backgroundColor: m.bg }}>
              <m.icon size={22} strokeWidth={3} className="text-black" />
            </div>
            <p className="text-4xl font-black tracking-tighter text-black dark:text-white">
              {m.value}<span className="text-sm text-black/40 dark:text-white/40 ml-0.5">{m.suffix}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 mt-2">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* ── ACADEMIC METRICS ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Bars */}
        <Card delay={0.2} className="lg:col-span-2">
          <SectionHeader icon={BarChart3} title="Academic Metrics" badge="Live Data" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricBar label="Attendance" value={perf.attendance} color="#61C6EA" />
            <MetricBar label="Internal Marks" value={perf.internalMarks} color="#B7A4EA" />
            <MetricBar label="Assignment Score" value={perf.assignmentScore} color="#8DB6E8" />
            <MetricBar label="LMS Engagement" value={perf.lmsEngagement} color="#91BFEF" />
            <MetricBar label="Quiz Score" value={perf.quizScore ?? 0} color="#F5A623" />
            {perf.metadata?.assignmentsSubmitted != null && (
              <MetricBar label="Assignments Submitted" value={perf.metadata.assignmentsSubmitted} max={perf.metadata.totalAssignments ?? 10} color="#61C6EA" />
            )}
          </div>
        </Card>

        {/* Stability Ring */}
        <Card delay={0.25}>
          <SectionHeader icon={Gauge} title="Stability" />
          <div className="flex flex-col items-center">
            <ProgressRing value={stability?.stabilityScore ?? 0} color={risk.fill} label="Score" size={140} />
            <div className="mt-4 w-full space-y-2">
              <div className={`flex items-center justify-between p-3 ${BB} rounded-xl bg-[#F9F4F1] dark:bg-zinc-800`}>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">Base Risk</span>
                <span className="text-sm font-black text-black dark:text-white">{stability?.baseFailureRisk ?? 0}%</span>
              </div>
              <div className={`flex items-center justify-between p-3 ${BB} rounded-xl bg-[#FF6AC1]`}>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/70">Final Risk</span>
                <span className="text-sm font-black text-black">{stability?.finalRisk ?? 0}%</span>
              </div>
              <div className={`flex items-center justify-between p-3 ${BB} rounded-xl bg-[#F9F4F1] dark:bg-zinc-800`}>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">Quiz Source</span>
                <span className="text-[10px] font-black uppercase text-black dark:text-white">{stability?.quizScoreSource ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── TREND ANALYSIS ─────────────────────────────────── */}
      {(perf.subjectMarks || perf.lowSubjectMarks?.length || perf.subjectRecommendations?.length) && (
        <Card delay={0.28}>
          <SectionHeader icon={GraduationCap} title="Subject Intelligence" badge="Weak Subject Recovery" />

          {perf.subjectMarks && (
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8799B5] mb-3">Subject Marks</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(perf.subjectMarks).map(([subject, marks]) => (
                  <div key={subject} className={`p-4 ${BORDER} rounded-[1.25rem] text-center`}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">{subject}</p>
                    <p className={`text-2xl font-[1000] mt-1 ${marks < 40 ? "text-[#E96D7C]" : marks < 70 ? "text-[#F5A623]" : "text-emerald-500"}`}>
                      {marks}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">/100</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perf.lowSubjectMarks && perf.lowSubjectMarks.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E96D7C] mb-3">Priority Weak Subjects</p>
              <div className="flex flex-wrap gap-2">
                {perf.lowSubjectMarks.map((it, idx) => (
                  <span key={`${it.subject}-${idx}`} className="px-3 py-1.5 rounded-xl bg-[#E96D7C]/10 text-[#E96D7C] text-[10px] font-black uppercase tracking-widest border border-[#E96D7C]/20">
                    {it.subject}: {it.marks}/100
                  </span>
                ))}
              </div>
            </div>
          )}

          {perf.subjectRecommendations && perf.subjectRecommendations.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8799B5] mb-3">Targeted Recommendations</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {perf.subjectRecommendations.map((rec, idx) => (
                  <div key={`${rec.subject}-${idx}`} className={`p-5 ${BORDER} rounded-3xl`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-[1000] uppercase tracking-tight">{rec.subject}</p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#E96D7C]">{rec.currentMarks}/100</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{rec.recommendation}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.focusAreas?.map((fa) => (
                        <span key={fa} className="px-2 py-1 rounded-lg bg-[#61C6EA]/10 text-[#61C6EA] text-[9px] font-black uppercase tracking-wider">
                          {fa}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── TREND ANALYSIS ─────────────────────────────────── */}
      {trend && (
        <Card delay={0.3}>
          <SectionHeader icon={Activity} title="Trend Analysis" badge={`${trend.historicalCount} Record${trend.historicalCount !== 1 ? "s" : ""}`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Trend */}
            <div className={`flex items-center gap-6 p-6 ${BORDER} rounded-[1.5rem]`}>
              <div className="text-5xl">{trend.direction}</div>
              <div>
                <p className="text-2xl font-[1000] uppercase tracking-tighter">{trend.trend}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8799B5] mt-1">
                  Risk Adjustment: <span className={trend.riskAdjustment > 0 ? "text-[#E96D7C]" : trend.riskAdjustment < 0 ? "text-emerald-500" : "text-[#8799B5]"}>
                    {trend.riskAdjustment > 0 ? "+" : ""}{trend.riskAdjustment}%
                  </span>
                </p>
              </div>
            </div>

            {/* Trend Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trend.trendBreakdown && Object.entries(trend.trendBreakdown).map(([key, val]) => (
                <div key={key} className={`p-3 ${BORDER} rounded-xl flex items-center gap-2`}>
                  {getTrendIcon(val)}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">{key}</p>
                    <p className={`text-xs font-[1000] ${val === "Declining" ? "text-[#E96D7C]" : val === "Improving" ? "text-emerald-500" : ""}`}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ── RISK BREAKDOWN ─────────────────────────────────── */}
      {riskBreak && (
        <Card delay={0.35}>
          <SectionHeader icon={Shield} title="Risk Breakdown" badge={`Weakness: ${riskBreak.primaryWeakness}`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metric Values */}
            <div className="lg:col-span-2 space-y-3">
              {riskBreak.metricValues && Object.entries(riskBreak.metricValues).map(([key, val]) => {
                const isNeg = riskBreak.negativeFactors?.includes(key);
                const color = isNeg ? "#E96D7C" : "#61C6EA";
                return <MetricBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} color={color} />;
              })}
            </div>

            {/* Factors */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-3">✅ Positive Factors</p>
                <div className="space-y-2">
                  {riskBreak.positiveFactors?.map((f) => (
                    <div key={f} className={`p-3 ${BORDER} rounded-xl text-xs font-bold flex items-center gap-2`}>
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="capitalize">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#E96D7C] mb-3">⚠️ Negative Factors</p>
                <div className="space-y-2">
                  {riskBreak.negativeFactors?.map((f) => (
                    <div key={f} className={`p-3 ${BORDER} rounded-xl text-xs font-bold flex items-center gap-2`}>
                      <AlertTriangle size={14} className="text-[#E96D7C] shrink-0" />
                      <span className="capitalize">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              {riskBreak.reasons?.length > 0 && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5] mb-3">📋 Reasons</p>
                  <div className="space-y-2">
                    {riskBreak.reasons.map((r, i) => (
                      <p key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <ChevronRight size={12} className="text-[#61C6EA] mt-0.5 shrink-0" /> {r}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ── IMPACT SIMULATOR ───────────────────────────────── */}
      {simulator && simulator.length > 0 && (
        <Card delay={0.4}>
          <SectionHeader icon={Zap} title="Impact Simulator" badge="What If?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulator.map((sim, i) => (
              <motion.div
                key={sim.metric}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-5 ${BORDER} rounded-[1.5rem] group hover:border-[#61C6EA]/50 transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-[1000] uppercase tracking-tight">{sim.metricLabel}</span>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${sim.riskReduction > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-zinc-800 text-[#8799B5]"}`}>
                    {sim.riskReduction > 0 ? `-${sim.riskReduction}% Risk` : "No Change"}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase text-[#8799B5]">Current</p>
                    <p className="text-xl font-[1000]">{sim.currentValue}%</p>
                  </div>
                  <ArrowUpRight size={20} className="text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase text-[#8799B5]">Simulated</p>
                    <p className="text-xl font-[1000] text-emerald-500">{sim.simulatedValue}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black text-[#8799B5] uppercase">
                  <span>Risk: {sim.currentRisk}% → {sim.newRisk}%</span>
                  <span>Stability: {sim.newStability}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ── STRENGTHS & CONCERNS ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card delay={0.45} className="bg-emerald-50/50 dark:bg-emerald-900/5">
          <SectionHeader icon={CheckCircle2} title="Strengths" />
          <ul className="space-y-3">
            {perf.strengths?.length ? perf.strengths.map((s, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                className={`flex items-start gap-3 p-3 ${BORDER} rounded-xl bg-white/70 dark:bg-zinc-900/50`}
              >
                <Zap size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{s}</p>
              </motion.li>
            )) : <p className="text-sm text-[#8799B5]">No strengths recorded yet.</p>}
          </ul>
        </Card>

        {/* Concerns */}
        <Card delay={0.45} className="bg-red-50/50 dark:bg-red-900/5">
          <SectionHeader icon={AlertTriangle} title="Concerns" />
          <ul className="space-y-3">
            {perf.concerns?.length ? perf.concerns.map((c, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                className={`flex items-start gap-3 p-3 ${BORDER} rounded-xl bg-white/70 dark:bg-zinc-900/50`}
              >
                <AlertCircle size={14} className="text-[#E96D7C] mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{c}</p>
              </motion.li>
            )) : <p className="text-sm text-[#8799B5]">No concerns recorded.</p>}
          </ul>
        </Card>
      </div>

      {/* ── AI ANALYSIS REASON ─────────────────────────────── */}
      {perf.reason && (
        <Card delay={0.5}>
          <SectionHeader icon={Brain} title="AI Analysis" />
          <div className={`p-6 ${BORDER} rounded-[1.5rem] bg-gradient-to-r from-[#61C6EA]/5 to-[#B7A4EA]/5`}>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
              &quot;{perf.reason}&quot;
            </p>
          </div>
        </Card>
      )}

      {/* ── 7-DAY ACTION PLAN ──────────────────────────────── */}
      {actionPlan && (
        <Card delay={0.55}>
          <SectionHeader icon={Lightbulb} title={actionPlan.focusArea} badge={`${actionPlan.startDate} → ${actionPlan.endDate}`} />
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-4 py-2 ${BORDER} rounded-xl text-[10px] font-black uppercase bg-[#B7A4EA]/10 text-[#B7A4EA]`}>
              Expected Risk Reduction: {actionPlan.expectedRiskReduction}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {actionPlan.days.map((d) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + d.day * 0.05 }}
                className={`p-4 ${BORDER} rounded-[1.5rem] group hover:border-[#61C6EA]/50 transition-all`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 bg-[#61C6EA]/10 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-[1000] text-[#61C6EA]">D{d.day}</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug">{d.task}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ── RECOMMENDATIONS ────────────────────────────────── */}
      {perf.recommendations && perf.recommendations.length > 0 && (
        <Card delay={0.6}>
          <SectionHeader icon={Lightbulb} title="Recommendations" badge={`${perf.recommendations.length} Actions`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perf.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
                className={`p-5 ${BORDER} rounded-[1.5rem] group hover:border-[#61C6EA]/50 transition-all`}
              >
                <div className="h-10 w-10 bg-[#61C6EA]/10 rounded-xl flex items-center justify-center mb-3">
                  <Zap size={18} className="text-[#61C6EA]" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ── INTERVENTION STATUS ─────────────────────────────── */}
      {perf.intervention && (
        <Card delay={0.65} className="bg-amber-50/50 dark:bg-amber-900/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <SectionHeader icon={Shield} title={perf.intervention.required ? "Intervention Required" : "Intervention Status"} />
            <div className="flex items-center gap-3">
              {!perf.intervention.required && (
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase bg-emerald-500/10 text-emerald-500`}>
                  Not Required
                </span>
              )}
              {perf.intervention.priority && (
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${perf.intervention.priority === "high" ? "bg-[#E96D7C] text-white" :
                    perf.intervention.priority === "medium" ? "bg-[#F5A623] text-white" :
                      "bg-[#61C6EA]/10 text-[#61C6EA]"
                  }`}>
                  {perf.intervention.priority} Priority
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 ${BORDER} rounded-xl bg-white/70 dark:bg-zinc-900/50`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">Owner</p>
              <p className="text-sm font-[1000] capitalize mt-1">{perf.intervention.owner ?? "N/A"}</p>
            </div>
            <div className={`p-4 ${BORDER} rounded-xl bg-white/70 dark:bg-zinc-900/50`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">Triggered By</p>
              <p className="text-sm font-[1000] capitalize mt-1">{perf.intervention.triggeredBy?.replace(/_/g, " ") ?? "N/A"}</p>
            </div>
            <div className={`p-4 ${BORDER} rounded-xl bg-white/70 dark:bg-zinc-900/50`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8799B5]">Next Review</p>
              <p className="text-sm font-[1000] mt-1 flex items-center gap-2">
                <Calendar size={14} className="text-[#61C6EA]" />
                {perf.intervention.nextReviewDate ? new Date(perf.intervention.nextReviewDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Actions */}
          {perf.intervention.actions && perf.intervention.actions.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8799B5]">Action Items</p>
              {perf.intervention.actions.map((action, idx) => (
                <div key={action._id || idx} className={`p-4 ${BORDER} rounded-[1.5rem] bg-white/70 dark:bg-zinc-900/50`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black uppercase text-[#F5A623]">{action.type.replace(/_/g, " ")}</p>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${action.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                        action.status === "in_progress" ? "bg-[#61C6EA]/10 text-[#61C6EA]" :
                          "bg-slate-100 dark:bg-zinc-800 text-[#8799B5]"
                      }`}>
                      {action.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{action.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── INTERVENTION HISTORY ────────────────────────────── */}
      {perf.intervention?.interventionHistory && perf.intervention.interventionHistory.length > 0 && (
        <Card delay={0.7}>
          <SectionHeader icon={Clock} title="Intervention History" />
          <div className="space-y-4">
            {perf.intervention.interventionHistory.map((entry, idx) => (
              <div key={entry._id || idx} className={`border-l-4 border-l-[#61C6EA] pl-6 py-4 ${BORDER} rounded-r-[1.5rem] bg-slate-50 dark:bg-zinc-900/50`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <p className="text-xs font-black uppercase text-[#61C6EA]">{entry.action.replace(/_/g, " ")}</p>
                  <p className="text-[9px] font-bold text-[#8799B5]">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{entry.outcome}</p>
                <p className="text-xs text-[#8799B5]">Performed by: <span className="capitalize">{entry.performedBy.replace(/_/g, " ")}</span></p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── PI FOOTER ──────────────────────────────────────── */}
      {pi?.generatedAt && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-[9px] font-black uppercase tracking-widest text-[#8799B5] py-4"
        >
          Predictive Intelligence generated at {new Date(pi.generatedAt).toLocaleString()}
        </motion.div>
      )}
    </div>
  );
}