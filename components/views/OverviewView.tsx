"use client";

import React, { useState } from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { KpiGrid } from "@/components/KpiGrid";
import { D3DonutChart } from "@/components/charts/D3DonutChart";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { DepartmentWorkloadChart } from "@/components/charts/DepartmentWorkloadChart";
import { ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";

export const OverviewView: React.FC = () => {
  const { summary, filteredRecords, setActiveTab } = useAnalytics();
  const [tablePage, setTablePage] = useState<number>(1);
  const pageSize = 10;

  // Prepare Donut data for admission types
  const admColors: Record<string, string> = {
    Emergency: "#2563eb",
    Urgent: "#0d9488",
    "Elective / Scheduled": "#64748b",
  };
  const admissionDonutData = Object.entries(summary.admission_types).map(([label, value]) => ({
    label,
    value,
    color: admColors[label] || "#4f46e5",
  }));

  // Prepare Bar data for top diseases
  const topDiseasesBarData = Object.entries(summary.disease_distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: label === "Cardiovascular Diseases" ? "#2563eb" : "#3b82f6",
    }));

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">
            SRM Institute of Science & Technology — Continuous Learning Assessment 2
          </span>
          <span className="text-slate-500 font-mono text-xs">|</span>
          <span className="text-xs text-slate-400 font-mono">21CSE423T Big Data Visualization</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("submission")}
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Submission Hub & Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KpiGrid />

      {/* Primary Analytics Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <MonthlyTrendChart
            monthlyByType={summary.monthly_by_type}
            title="Monthly Admission Dynamics by Triage Classification"
            subtitle="Comparing Emergency, Urgent, and Elective throughput across FY2024"
            height={280}
          />
        </div>
        <div>
          <D3DonutChart
            data={admissionDonutData}
            title="Admission Classification"
            subtitle="Emergency vs Urgent vs Scheduled"
            centerLabel="Total Influx"
            height={280}
          />
        </div>
      </div>

      {/* Secondary Analytics Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <D3BarChart
            data={topDiseasesBarData}
            title="Clinical Disease Spectrum Ranking"
            subtitle="Confirmed patient admissions across 8 primary diagnostic chapters"
            height={310}
            valueLabel="admissions"
          />
        </div>
        <div>
          <DepartmentWorkloadChart
            data={summary.los_by_department}
            title="Department Operational Load vs. Length of Stay"
            subtitle="Patient volume (bars) vs average inpatient days (line)"
            height={310}
          />
        </div>
      </div>

      {/* Recent Admissions Live Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 tracking-wide">
              Patient Clinical Admission Records ({filteredRecords.length.toLocaleString()})
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Live synchronized ledger reflecting currently applied multi-dimensional filters
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-slate-400">
              Page {tablePage} of {totalPages}
            </span>
            <button
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              disabled={tablePage === totalPages}
              className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-2">Patient ID</th>
                <th className="py-2 px-2">Admission Date</th>
                <th className="py-2 px-2">Age / Gender</th>
                <th className="py-2 px-2">Diagnosis</th>
                <th className="py-2 px-2">Department</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">LOS</th>
                <th className="py-2 px-2">Severity</th>
                <th className="py-2 px-2 text-right">Charges (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {paginatedRecords.map((r) => {
                const badgeColor =
                  r.admission_type === "Emergency"
                    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    : r.admission_type === "Urgent"
                    ? "text-teal-400 bg-teal-500/10 border-teal-500/20"
                    : "text-slate-400 bg-slate-800 border-slate-700";
                return (
                  <tr key={r.patient_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-1.5 px-2 font-bold text-blue-400">{r.patient_id}</td>
                    <td className="py-1.5 px-2 text-slate-400">{r.admission_date}</td>
                    <td className="py-1.5 px-2">
                      {r.age}y • {r.gender}
                    </td>
                    <td className="py-1.5 px-2 font-medium text-slate-200 truncate max-w-[180px]">
                      {r.diagnosis}
                    </td>
                    <td className="py-1.5 px-2 text-slate-300">{r.department}</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badgeColor}`}>
                        {r.admission_type}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 font-bold text-slate-100">{r.length_of_stay}d</td>
                    <td className="py-1.5 px-2">
                      <span
                        className={`text-[10px] ${
                          r.severity === "Critical"
                            ? "text-red-400 font-bold"
                            : r.severity === "Severe"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-right font-medium text-emerald-400">
                      ₹{r.total_cost_inr.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

