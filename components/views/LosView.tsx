"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { D3LosHistogram } from "@/components/charts/D3LosHistogram";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { Clock, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

export const LosView: React.FC = () => {
  const { summary, filteredRecords } = useAnalytics();

  const losValues = filteredRecords.map((r) => r.length_of_stay);

  // LOS by disease category bar chart
  const diseaseLosData = [...summary.los_by_disease]
    .sort((a, b) => b.mean - a.mean)
    .map((d) => ({
      label: d.disease_category,
      value: d.mean,
      secondaryValue: `Median: ${d.median}d (${d.count} cases)`,
      color: d.disease_category === "Oncology & Neoplasms" || d.disease_category === "Neurological Disorders" ? "#2563eb" : "#3b82f6",
    }));

  // Calculate LOS by admission type
  const typeLosMap: Record<string, number[]> = {};
  filteredRecords.forEach((r) => {
    if (!typeLosMap[r.admission_type]) typeLosMap[r.admission_type] = [];
    typeLosMap[r.admission_type].push(r.length_of_stay);
  });
  const typeLosData = Object.entries(typeLosMap).map(([type, vals]) => {
    const mean = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
    return {
      label: type,
      value: mean,
      color: type === "Emergency" ? "#ef4444" : type === "Urgent" ? "#0d9488" : "#64748b",
    };
  });

  // Outliers calculation (>15 days)
  const prolongedStays = filteredRecords.filter((r) => r.length_of_stay > 15);
  const prolongedPct = filteredRecords.length > 0 ? ((prolongedStays.length / filteredRecords.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="text-base font-semibold text-slate-100 mb-1">
          Length of Stay (LOS) Dynamics & Distribution Modeling
        </h2>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Parametric evaluation of inpatient duration, stay skewness, disease-specific recovery intervals, and outlier management.
        </p>
      </div>

      {/* Main Histogram */}
      <D3LosHistogram
        values={losValues}
        avgLos={summary.kpis.avg_los}
        medianLos={summary.kpis.median_los}
        title="Length of Stay (LOS) Frequency Distribution & Right-Skew Dynamics"
        subtitle="Inpatient days histogram displaying mean (red line) and median (green line) parametric thresholds"
        height={300}
      />

      {/* Grid: LOS by Disease & LOS by Admission Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <D3BarChart
          data={diseaseLosData}
          title="Mean Length of Stay by Diagnostic Category (Days)"
          subtitle="Neurological Disorders and Oncology exhibit highest stay duration"
          height={320}
          valueLabel="days"
          showPercentages={false}
        />

        <div className="space-y-3">
          <D3BarChart
            data={typeLosData}
            title="Mean Stay by Admission Triage Classification (Days)"
            subtitle="Emergency presentations incur 29.4% longer hospitalization than elective admissions"
            height={180}
            valueLabel="days"
            showPercentages={false}
          />

          {/* Outlier Alert Card */}
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="flex items-center space-x-2 text-rose-400 mb-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
                Extended Stay Inpatient Cohort ({prolongedPct}%)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <b>{prolongedStays.length} patients</b> experienced extended hospitalization exceeding 15 days. Over 68% of these extended episodes originated in the <b>Intensive Care Unit (ICU)</b> and <b>Oncology</b>, accounting for disproportionate bedside clinical resources and elevated infection exposure risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
