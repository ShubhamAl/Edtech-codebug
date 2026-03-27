"use client";

import { FileUp, CloudUpload, CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";

interface UploadCardProps {
  title: string;
  description?: string;
  isActive: boolean; // Controls if the user can interact
  isCompleted: boolean; // Shows success state
  onUploadSuccess: () => void; // Triggered when "Initialize" is clicked
}

export default function UploadCard({
  title,
  isActive,
  isCompleted,
  onUploadSuccess
}: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && isActive) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    setUploading(false);
    onUploadSuccess();
  };

  return (
    <div className={`
      relative p-8 rounded-[2.5rem] ${blackBorder} transition-all duration-300
      ${isCompleted
        ? "bg-[#A3E635] shadow-none translate-x-[2px] translate-y-[2px]"
        : `bg-white dark:bg-zinc-900 ${hardShadow}`}
      ${!isActive && !isCompleted ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}
    `}>

      {!isActive && !isCompleted && (
        <div className="absolute top-6 right-6 text-black dark:text-white">
          <Lock size={20} strokeWidth={3} />
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
          {title}
          {isCompleted && <CheckCircle2 size={24} className="text-black" strokeWidth={3} />}
        </h3>
        <p className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] mt-1">
          {isCompleted ? "Module Synchronized" : "Data Ingestion Node"}
        </p>
      </div>

      <label
        className={`
          relative group cursor-pointer flex flex-col items-center justify-center 
          w-full h-52 rounded-[2rem] border-[3px] border-dashed transition-all
          ${isCompleted
            ? "border-black bg-black/5"
            : "border-black/20 dark:border-white/20 bg-[#F9F4F1] dark:bg-zinc-800/50 hover:border-[#8E97FD]"}
        `}
      >
        <input type="file" className="hidden" accept=".csv, .xls, .xlsx" onChange={handleFileChange} disabled={!isActive || isCompleted} />

        <div className="flex flex-col items-center gap-4">
          <div className={`p-5 rounded-2xl ${blackBorder} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${isCompleted ? "bg-white text-black" : "bg-[#8E97FD] text-black"}`}>
            {isCompleted ? <CheckCircle2 size={32} strokeWidth={3} /> : <CloudUpload size={32} strokeWidth={3} />}
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-black text-black dark:text-white uppercase tracking-wider truncate max-w-[240px]">
              {isCompleted ? "Verified & Locked" : file ? file.name : "Drop Source File"}
            </p>
            {!file && !isCompleted && (
              <p className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase mt-1">CSV, XLS, or XLSX</p>
            )}
          </div>
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || isCompleted || !isActive}
        className={`w-full mt-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${blackBorder}
          ${isCompleted
            ? "bg-black text-white cursor-default"
            : file
              ? "bg-[#FFD600] text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              : "bg-gray-200 dark:bg-zinc-800 text-black/20 dark:text-white/20 cursor-not-allowed"}
        `}
      >
        <FileUp size={18} strokeWidth={3} />
        {uploading ? "Processing..." : isCompleted ? "System Locked" : "Initialize Sync"}
      </button>
    </div>
  );
}