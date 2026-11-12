"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import {
  LayoutDashboard,
  CalendarDays,
  Activity,
  Users,
  Building2,
  Clock,
  Sparkles,
  Database,
  QrCode,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "admissions", label: "Patient Admissions", icon: CalendarDays },
  { id: "diseases", label: "Disease Distribution", icon: Activity },
  { id: "demographics", label: "Demographics", icon: Users },
  { id: "departments", label: "Department Workload", icon: Building2 },
  { id: "los", label: "Length of Stay (LOS)", icon: Clock },
  { id: "insights", label: "Clinical Insights", icon: Sparkles, badge: "8 Key" },
  { id: "dataset", label: "About Dataset", icon: Database },
  { id: "submission", label: "Submission Hub & QR", icon: QrCode, badge: "SRM" },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, filteredRecords, records } = useAnalytics();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wider">
            HA
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 leading-tight">
              Hospital Analytics
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              SRM IST • 21CSE423T
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Analytical Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2 font-semibold"
                  : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-blue-400" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Live System Indicator */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-300">SYSTEM ACTIVE</span>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">
            {filteredRecords.length}/{records.length}
          </span>
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          CLA-2 Evaluation • Dr. Ganagavalli K
        </div>
      </div>
    </aside>
  );
};
