"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { DepartmentWorkloadChart } from "@/components/charts/DepartmentWorkloadChart";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { D3DonutChart } from "@/components/charts/D3DonutChart";
import { Building2, BedDouble, AlertOctagon, TrendingDown } from "lucide-react";

export const DepartmentView: React.FC = () => {
  const { summary } = useAnalytics();

  // Department volume bar chart
  const deptVolumeData = Object.entries(summary.department_workload)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: label === "Cardiology" ? "#2563eb" : label === "Intensive Care Unit (ICU)" ? "#ef4444" : "#0d9488",
    }));

  // LOS by Department
  const losBarData = [...summary.los_by_department]
    .sort((a, b) => b.mean - a.mean)
    .map((d) => ({
      label: d.department,
      value: d.mean,
      secondaryValue: `Median: ${d.median}d (±${d.std}d)`,
      color: d.department === "Intensive Care Unit (ICU)" ? "#ef4444" : "#3b82f6",
    }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="text-base font-semibold text-slate-100 mb-1">
          Departmental Workload & Operational Capacity Utilization
        </h2>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Evaluation of patient throughput, clinical staffing pressure, and bed-day consumption across 9 hospital units.
        </p>
      </div>

      {/* Main Dual-Axis Chart */}
      <DepartmentWorkloadChart
        data={summary.los_by_department}
        title="Department Admissions Volume vs. Average Length of Stay (Days)"
        subtitle="Comparing sheer patient volume against clinical stay duration across operational divisions"
        height={320}
      />

      {/* Grid: Admissions Volume & Stay Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <D3BarChart
          data={deptVolumeData}
          title="Total Admissions Volume by Department"
          subtitle="Cardiology leads hospital throughput (786 admissions, 19.7%)"
          height={320}
          valueLabel="patients"
          showPercentages={true}
        />

        <D3BarChart
          data={losBarData}
          title="Mean Length of Stay by Department (Days)"
          subtitle="ICU exhibits prolonged inpatient care (13.86 days mean)"
          height={320}
          valueLabel="days"
          showPercentages={false}
        />
      </div>

      {/* Operational Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-slate-200 tracking-wide">
            Department Performance & Bed-Day Metrics
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-2">Department Name</th>
                <th className="py-2 px-2">Admissions</th>
                <th className="py-2 px-2">Workload Share</th>
                <th className="py-2 px-2">Mean Stay (Days)</th>
                <th className="py-2 px-2">Median Stay</th>
                <th className="py-2 px-2">Std Dev (±)</th>
                <th className="py-2 px-2 text-right">Total Bed-Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {summary.los_by_department
                .sort((a, b) => b.count - a.count)
                .map((dept) => {
                  const totalBedDays = Math.round(dept.count * dept.mean);
                  const isIcu = dept.department === "Intensive Care Unit (ICU)";
                  return (
                    <tr key={dept.department} className="hover:bg-slate-800/40">
                      <td className="py-1.5 px-2 font-medium text-slate-200 flex items-center space-x-1.5">
                        {isIcu && <AlertOctagon className="w-3 h-3 text-red-400 shrink-0" />}
                        <span>{dept.department}</span>
                      </td>
                      <td className="py-1.5 px-2 font-bold text-blue-400">
                        {dept.count.toLocaleString()}
                      </td>
                      <td className="py-1.5 px-2 text-slate-400">
                        {((dept.count / summary.kpis.total_admissions) * 100).toFixed(1)}%
                      </td>
                      <td className={`py-1.5 px-2 font-bold ${isIcu ? "text-red-400" : "text-slate-100"}`}>
                        {dept.mean}d
                      </td>
                      <td className="py-1.5 px-2 text-emerald-400">{dept.median}d</td>
                      <td className="py-1.5 px-2 text-slate-400">±{dept.std}d</td>
                      <td className="py-1.5 px-2 text-right font-bold text-slate-200">
                        {totalBedDays.toLocaleString()}
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
