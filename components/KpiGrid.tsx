"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import {
  Users,
  Clock,
  AlertTriangle,
  HeartPulse,
  Building2,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

export const KpiGrid: React.FC = () => {
  const { summary, filteredRecords, records } = useAnalytics();
  const { kpis } = summary;

  const pctOfTotal = ((filteredRecords.length / records.length) * 100).toFixed(1);

  const cards = [
    {
      title: "TOTAL ADMISSIONS",
      value: kpis.total_admissions.toLocaleString(),
      subtext: `${pctOfTotal}% of total hospital intake`,
      detail: `${kpis.unique_patients.toLocaleString()} unique patients`,
      icon: Users,
      accent: "text-blue-400",
      badge: "Inpatient",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "AVG LENGTH OF STAY",
      value: `${kpis.avg_los} days`,
      subtext: `Median stay: ${kpis.median_los} days`,
      detail: "Benchmark: 7.2d national norm",
      icon: Clock,
      accent: "text-teal-400",
      badge: "Turnaround",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    },
    {
      title: "EMERGENCY ACUITY",
      value: `${kpis.emergency_pct}%`,
      subtext: `${summary.admission_types["Emergency"]?.toLocaleString() || 0} acute cases`,
      detail: "Primary intake modality",
      icon: AlertTriangle,
      accent: "text-rose-400",
      badge: "High Acuity",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    {
      title: "TOP CLINICAL BURDEN",
      value: kpis.top_disease,
      subtext: `${kpis.top_disease_count} admissions (${kpis.top_disease_pct}%)`,
      detail: "Leading diagnostic chapter",
      icon: HeartPulse,
      accent: "text-indigo-400",
      badge: "Epidemiology",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      title: "PEAK WORKLOAD DEPT",
      value: kpis.top_department,
      subtext: `${kpis.top_department_count} patients (${kpis.top_dept_pct}%)`,
      detail: "Highest bed-day consumption",
      icon: Building2,
      accent: "text-amber-400",
      badge: "Capacity",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "TOTAL BILLING VOLUME",
      value: `₹${(kpis.total_revenue_inr / 10000000).toFixed(2)} Cr`,
      subtext: `Avg: ₹${kpis.avg_cost_inr.toLocaleString()} / episode`,
      detail: "48% private insured",
      icon: IndianRupee,
      accent: "text-emerald-400",
      badge: "Financials",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded p-3 relative flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider">
                  {card.title}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tracking-tight mb-1 truncate">
                {card.value}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 mt-1">
              <div className="text-[11px] text-slate-300 font-medium truncate">
                {card.subtext}
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between mt-0.5">
                <span className="truncate">{card.detail}</span>
                <Icon className={`w-3 h-3 ${card.accent} shrink-0 ml-1`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
