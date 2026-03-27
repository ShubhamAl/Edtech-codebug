"use client";

import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import ProtectedRoute from "../../components/ProtectedRoute";
import { DashboardThemeProvider } from "../../components/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={["master", "admin"]} redirectTo="/admin-login">
      <DashboardThemeProvider>
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
          {/* SIDEBAR */}
          <AdminSidebar isOpen={open} setIsOpen={setOpen} />

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader onOpenSidebar={() => setOpen(true)} />

            <main className="flex-1 overflow-y-auto p-6 text-slate-900 dark:text-zinc-100">
              {children}
            </main>
          </div>
        </div>
      </DashboardThemeProvider>
    </ProtectedRoute>
  );
}
