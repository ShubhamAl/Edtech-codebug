"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Megaphone, FolderOpen, Send, UploadCloud, X, Loader2, FileText, Trash2, Download, AlertCircle, CheckCircle2, MessageSquare, AlertTriangle, FileUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";

type Tab = "notices" | "resources";

interface Notice {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
  downloadUrl: string;
  originalFileName: string;
  resourceType: string;
  mimeType: string;
  fileSizeLabel: string;
  fileSizeBytes: number;
  isPdf: boolean;
  isBroadcast: boolean;
  facultyName: string;
  facultyEmail: string;
  createdAt: string;
}

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notices");

  // Notices State
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticePriority, setNoticePriority] = useState("normal");
  const [noticeTag, setNoticeTag] = useState("general");
  const [sendingNotice, setSendingNotice] = useState(false);

  // Resources State
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceSubject, setResourceSubject] = useState("");
  const [resourceDesc, setResourceDesc] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploadingResource, setUploadingResource] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global State
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  // Neubrutalism Style Variables
  const blackBorder = "border-[3px] border-black dark:border-white";
  const hardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]";
  const hoverEffect = "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100";

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchNotices = useCallback(async () => {
    try {
      setNoticesLoading(true);
      const res: any = await apiRequest("/faculty-notices", { method: "GET" });
      const list = res.data ?? res.notices ?? res ?? [];
      setNotices(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("Failed to fetch notices", err);
    } finally {
      setNoticesLoading(false);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      setResourcesLoading(true);
      // ✅ Correct endpoint: /student/resources
      const res: any = await apiRequest("/student/resources", { method: "GET" });
      const list = res.data ?? res.resources ?? res ?? [];
      setResources(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("Failed to fetch resources", err);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "notices") fetchNotices();
    else fetchResources();
  }, [activeTab, fetchNotices, fetchResources]);

  const handleSendNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      showMessage("Please complete all fields to send a notice.", "error");
      return;
    }
    try {
      setSendingNotice(true);
      await apiRequest("/faculty-notices", {
        method: "POST",
        body: JSON.stringify({ title: noticeTitle, message: noticeMessage, priority: noticePriority, tag: noticeTag }),
      });
      showMessage("Notice sent successfully to all students.", "success");
      setNoticeTitle("");
      setNoticeMessage("");
      setNoticePriority("normal");
      setNoticeTag("general");
      fetchNotices();
    } catch (err: any) {
      showMessage(err?.message || "Failed to send notice.", "error");
    } finally {
      setSendingNotice(false);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceFile) {
      showMessage("Please provide a title and select a file.", "error");
      return;
    }
    try {
      setUploadingResource(true);
      const formData = new FormData();
      formData.append("title", resourceTitle);
      if (resourceSubject.trim()) formData.append("subject", resourceSubject);
      if (resourceDesc.trim()) formData.append("description", resourceDesc);
      formData.append("file", resourceFile);

      await apiRequest("/faculty-resources/upload", {
        method: "POST",
        body: formData,
      });
      showMessage("Resource uploaded successfully.", "success");
      setResourceTitle("");
      setResourceSubject("");
      setResourceDesc("");
      setResourceFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchResources();
    } catch (err: any) {
      showMessage(err?.message || "Failed to upload resource.", "error");
    } finally {
      setUploadingResource(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await apiRequest(`/faculty-resources/${id}`, { method: "DELETE" });
      showMessage("Resource deleted successfully.", "success");
      fetchResources();
    } catch (err: any) {
      showMessage(err?.message || "Failed to delete resource.", "error");
    }
  };

  // ✅ Use downloadUrl directly from resource — no backend redirect needed
  const handleDownloadResource = (resource: Resource) => {
    const url = resource.downloadUrl || resource.fileUrl;
    if (!url) return;
    // Force download using a hidden anchor
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.originalFileName || resource.title || "download";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Just now";
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl ${blackBorder} ${hardShadow} font-black text-xs uppercase tracking-widest ${
                message.type === "success" ? "bg-[#A3E635] text-black" : "bg-[#FF6AC1] text-black"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 size={20} strokeWidth={3} /> : <AlertTriangle size={20} strokeWidth={3} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-[#FFD600] ${blackBorder} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
                <Megaphone className="text-black w-6 h-6" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">
                Nexus Systems / Comm Link
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-none p-2">
              Institute <br />
              <span className="relative inline-block mt-2">
                Broadcasts.
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#FF6AC1] -z-10 -rotate-1" />
              </span>
            </h1>
          </div>
        </header>

        {/* TABS */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-base uppercase tracking-widest transition-all ${
              activeTab === "notices"
                ? `bg-[#8E97FD] text-black ${blackBorder} ${hardShadow}`
                : "bg-white dark:bg-zinc-900 text-black/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <MessageSquare size={20} strokeWidth={3} />
            Notices
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-base uppercase tracking-widest transition-all ${
              activeTab === "resources"
                ? `bg-[#A3E635] text-black ${blackBorder} ${hardShadow}`
                : "bg-white dark:bg-zinc-900 text-black/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <FolderOpen size={20} strokeWidth={3} />
            Study Materials
          </button>
        </div>

        {/* TAB CONTENT: NOTICES */}
        <AnimatePresence mode="wait">
          {activeTab === "notices" && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* SEND NOTICE FORM */}
              <div className="lg:col-span-5">
                <form onSubmit={handleSendNotice} className={`bg-white dark:bg-zinc-900 p-10 rounded-[3rem] ${blackBorder} ${hardShadow} flex flex-col gap-6`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 bg-[#8E97FD] rounded-xl ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <Send size={24} className="text-black ml-1" strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">New Notice</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Headline</label>
                    <input
                      type="text"
                      className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none`}
                      placeholder="e.g., Mid-Term Exam Schedule"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Priority</label>
                      <select
                        className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none appearance-none`}
                        value={noticePriority}
                        onChange={(e) => setNoticePriority(e.target.value)}
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Tag</label>
                      <input
                        type="text"
                        className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none`}
                        placeholder="e.g., exam, event"
                        value={noticeTag}
                        onChange={(e) => setNoticeTag(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Message Body</label>
                    <textarea
                      className={`w-full h-40 bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none resize-none custom-scrollbar`}
                      placeholder="Enter the broadcast details here..."
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingNotice}
                    className={`mt-4 w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#000000] dark:bg-white text-white dark:text-black font-black uppercase text-sm tracking-widest hover:bg-[#FF6AC1] dark:hover:bg-[#FF6AC1] hover:text-black transition-all disabled:opacity-50`}
                  >
                    {sendingNotice ? <Loader2 className="animate-spin" /> : <Megaphone size={18} />}
                    Broadcast to Students
                  </button>
                </form>
              </div>

              {/* RECENT NOTICES LIST */}
              <div className="lg:col-span-7">
                <div className={`h-full bg-white dark:bg-zinc-900 p-10 rounded-[3rem] ${blackBorder} ${hardShadow} flex flex-col`}>
                  <h3 className="text-xl font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-8 border-b-[3px] border-black/10 dark:border-white/10 pb-4">
                    Broadcast History
                  </h3>
                  
                  {noticesLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                      <Loader2 className="animate-spin mb-4" size={48} strokeWidth={3} />
                      <p className="font-black uppercase tracking-widest text-sm">Syncing Data...</p>
                    </div>
                  ) : notices.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center">
                      <MessageSquare size={64} strokeWidth={1} className="mb-4" />
                      <p className="font-black uppercase tracking-[0.2em] text-lg">No Broadcasts Yet</p>
                      <p className="font-bold text-xs mt-2">Send your first notice using the terminal.</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {notices.map((notice) => (
                        <div key={notice._id} className={`p-6 rounded-2xl border-[3px] border-black/10 dark:border-white/10 bg-[#F9F4F1] dark:bg-zinc-800 transition-all hover:border-black dark:hover:border-white group`}>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-black text-xl uppercase tracking-tighter text-black dark:text-white leading-tight">{notice.title}</h4>
                            <span className="shrink-0 text-[10px] font-black bg-black/10 dark:bg-white/10 px-3 py-1 rounded-md uppercase tracking-widest">
                              {formatDate(notice.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-black/70 dark:text-white/70 whitespace-pre-wrap">{notice.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: RESOURCES */}
          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
               {/* UPLOAD RESOURCE FORM */}
               <div className="lg:col-span-5">
                <form onSubmit={handleUploadResource} className={`bg-white dark:bg-zinc-900 p-10 rounded-[3rem] ${blackBorder} ${hardShadow} flex flex-col gap-6`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 bg-[#A3E635] rounded-xl ${blackBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <FileUp size={24} className="text-black" strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">Upload File</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Resource Title</label>
                    <input
                      type="text"
                      className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none`}
                      placeholder="e.g., Chapter 1 Notes (PDF)"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Subject (Optional)</label>
                    <input
                      type="text"
                      className={`w-full bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none`}
                      placeholder="e.g., AI, DBMS"
                      value={resourceSubject}
                      onChange={(e) => setResourceSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Description (Optional)</label>
                    <textarea
                      className={`w-full h-24 bg-[#F9F4F1] dark:bg-zinc-950 px-6 py-4 rounded-2xl ${blackBorder} font-bold text-black dark:text-white focus:bg-white transition-colors outline-none resize-none custom-scrollbar`}
                      placeholder="Brief details about the file..."
                      value={resourceDesc}
                      onChange={(e) => setResourceDesc(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] ml-2">Attach File</label>
                    <div className={`relative flex items-center justify-center w-full h-32 bg-[#F9F4F1] dark:bg-zinc-950 rounded-2xl ${blackBorder} overflow-hidden group hover:bg-[#FFD600] transition-colors`}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="text-center group-hover:text-black">
                        {resourceFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText size={32} strokeWidth={2.5} className="text-black dark:text-white group-hover:text-black" />
                            <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white group-hover:text-black truncate max-w-[200px]">{resourceFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-black/40 dark:text-white/40 group-hover:text-black">
                            <UploadCloud size={32} strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Click to browse or drag file</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingResource}
                    className={`mt-4 w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#000000] dark:bg-white text-white dark:text-black font-black uppercase text-sm tracking-widest hover:bg-[#A3E635] dark:hover:bg-[#A3E635] hover:text-black transition-all disabled:opacity-50`}
                  >
                    {uploadingResource ? <Loader2 className="animate-spin" /> : <UploadCloud size={18} />}
                    Upload to Cloud
                  </button>
                </form>
              </div>

              {/* RECENT RESOURCES LIST */}
              <div className="lg:col-span-7">
                <div className={`h-full bg-white dark:bg-zinc-900 p-10 rounded-[3rem] ${blackBorder} ${hardShadow} flex flex-col`}>
                  <h3 className="text-xl font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-8 border-b-[3px] border-black/10 dark:border-white/10 pb-4">
                    Study Materials Archive
                  </h3>
                  
                  {resourcesLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                      <Loader2 className="animate-spin mb-4" size={48} strokeWidth={3} />
                      <p className="font-black uppercase tracking-widest text-sm">Syncing Archive...</p>
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center">
                      <FolderOpen size={64} strokeWidth={1} className="mb-4" />
                      <p className="font-black uppercase tracking-[0.2em] text-lg">No Resources Uploaded</p>
                      <p className="font-bold text-xs mt-2">Upload materials to share with your students.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar content-start">
                      {resources.map((res) => (
                        <div key={res._id} className={`flex flex-col p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border-[3px] border-black transition-all ${hoverEffect} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl border-2 border-black ${res.isPdf ? "bg-[#FF6AC1]" : "bg-[#63D2F3]"}`}>
                              <FileText size={20} className="text-black" strokeWidth={3} />
                            </div>
                            <div className="flex items-center gap-2">
                              {res.isPdf && (
                                <span className="text-[9px] font-black uppercase px-2 py-1 bg-[#FF6AC1] text-black border-2 border-black rounded-lg">PDF</span>
                              )}
                              {res.resourceType === "image" && (
                                <span className="text-[9px] font-black uppercase px-2 py-1 bg-[#63D2F3] text-black border-2 border-black rounded-lg">IMG</span>
                              )}
                              <button
                                onClick={() => handleDeleteResource(res._id)}
                                className="p-2 text-black/20 hover:text-[#FF6AC1] transition-colors"
                                title="Delete Resource"
                              >
                                <Trash2 size={18} strokeWidth={3} />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-black text-lg uppercase tracking-tight text-black dark:text-white leading-tight mb-1 truncate" title={res.title}>{res.title}</h4>

                          {res.subject && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8E97FD] mb-2">{res.subject}</span>
                          )}

                          <p className="text-[11px] font-bold text-black/50 dark:text-white/50 line-clamp-2 mb-3 flex-1">
                            {res.description || "No description provided."}
                          </p>

                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">
                            <span>👤 {res.facultyName || "Unknown"}</span>
                            <span>{res.fileSizeLabel || "—"}</span>
                          </div>

                          <button
                            onClick={() => handleDownloadResource(res)}
                            className={`w-full py-3 rounded-xl border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#FFD600] hover:text-black transition-colors flex items-center justify-center gap-2`}
                          >
                            <Download size={14} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
