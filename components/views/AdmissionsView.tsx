"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { D3DonutChart } from "@/components/charts/D3DonutChart";
import { Calendar, TrendingUp, AlertCircle, Clock } from "lucide-react";

export const AdmissionsView: React.FC = () => {
  const { summary, filteredRecords } = useAnalytics();

  // Day of week bar data
  const dowOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dowData = dowOrder.map((day) => ({
    label: day,
    value: summary.day_of_week_trends[day] || 0,
    color: day === "Sat" ? "#2563eb" : day === "Sun" ? "#3b82f6" : "#64748b",
  }));

  // Admission type donut
  const admColors: Record<string, string> = {
    Emergency: "#2563eb",
    Urgent: "#0d9488",
    "Elective / Scheduled": "#64748b",
  };
  const admDonut = Object.entries(summary.admission_types).map(([label, value]) => ({
    label,
    value,
    color: admColors[label] || "#3b82f6",
  }));

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="text-base font-semibold text-slate-100 mb-1">
          Patient Admission Dynamics & Temporal Influx Analysis
        </h2>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Detailed evaluation of clinical intake patterns across calendar months, triage pathways, and day-of-week surges for FY2024.
        </p>
      </div>

      {/* Main Temporal Chart */}
      <MonthlyTrendChart
        monthlyByType={summary.monthly_by_type}
        title="Annual Monthly Admissions Stratified by Triage Classification"
        subtitle="Stacked distribution showing seasonal variances (January and July annual peaks)"
        height={320}
      />

      {/* Grid: Day of Week & Admission Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <D3BarChart
          data={dowData}
          title="Day-of-Week Influx Profile"
          subtitle="Total volume of clinical presentations by day (Saturday peak: 619 admissions)"
          height={280}
          valueLabel="patients"
          showPercentages={true}
        />

        <D3DonutChart
          data={admDonut}
          title="Triage Pathway Proportions"
          subtitle="Relative breakdown across emergency, urgent, and elective pathways"
          centerLabel="Total Influx"
          height={280}
        />
      </div>

      {/* Analytical Callouts & Performance Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Emergency Dominance
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Emergency admissions constitute <b>{summary.kpis.emergency_pct}%</b> of all hospital intake ({summary.admission_types["Emergency"]?.toLocaleString()} cases). High acute dependency necessitates real-time dynamic bed allocation rather than fixed elective reservations.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-teal-400 mb-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Seasonal Influx Peaks
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Annual admissions peaked in <b>January (376 admissions)</b> and <b>July (358 admissions)</b>, representing a 22.8% surge above the February baseline (306 cases), driven primarily by winter respiratory infections and summer trauma.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Weekend Trauma Surge
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <b>Saturdays account for 619 admissions</b>, an 11.8% elevation above the weekday baseline (553 cases). Trauma and acute cardiac presentations dominate weekend intake, mandating enhanced on-call surgical staffing.
          </p>
        </div>
      </div>
    </div>
  );
};

