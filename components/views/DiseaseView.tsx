"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { D3DonutChart } from "@/components/charts/D3DonutChart";
import { DemographicsChart } from "@/components/charts/DemographicsChart";
import { Activity, Stethoscope, HeartPulse, ShieldAlert } from "lucide-react";

export const DiseaseView: React.FC = () => {
  const { summary, filteredRecords } = useAnalytics();

  const diseaseColors = [
    "#2563eb",
    "#0d9488",
    "#4f46e5",
    "#d97706",
    "#e11d48",
    "#0284c7",
    "#7c3aed",
    "#059669",
  ];

  // Bar Data
  const barData = Object.entries(summary.disease_distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label,
      value,
      color: diseaseColors[i % diseaseColors.length],
    }));

  // Donut Data
  const donutData = Object.entries(summary.disease_distribution).map(([label, value], i) => ({
    label,
    value,
    color: diseaseColors[i % diseaseColors.length],
  }));

  // Calculate top granular diagnoses
  const diagnosisCounts: Record<string, number> = {};
  filteredRecords.forEach((r) => {
    diagnosisCounts[r.diagnosis] = (diagnosisCounts[r.diagnosis] || 0) + 1;
  });
  const topDiagnoses = Object.entries(diagnosisCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="text-base font-semibold text-slate-100 mb-1">
          Clinical Disease Distribution & Epidemiological Stratification
        </h2>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Surveillance of 8 primary diagnostic chapters and specific ICD diagnoses across inpatient cohorts.
        </p>
      </div>

      {/* Primary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <D3BarChart
            data={barData}
            title="Primary Diagnostic Category Burden"
            subtitle="Ranking of confirmed inpatient admissions by clinical chapter"
            height={320}
            valueLabel="admissions"
          />
        </div>
        <div>
          <D3DonutChart
            data={donutData}
            title="Disease Spectrum Proportions"
            subtitle="Relative chapter distribution"
            centerLabel="Cases"
            height={320}
          />
        </div>
      </div>

      {/* Cross-tabulation: Disease by Age and Gender */}
      <DemographicsChart
        crossDiseaseAge={summary.cross_disease_age}
        crossDiseaseGender={summary.cross_disease_gender}
        height={340}
      />

      {/* Granular Diagnoses Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Stethoscope className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-slate-200 tracking-wide">
            Top 10 Granular Clinical Diagnoses
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {topDiagnoses.map(([diag, count], idx) => {
            const pct = filteredRecords.length > 0 ? ((count / filteredRecords.length) * 100).toFixed(1) : 0;
            return (
              <div
                key={diag}
                className="bg-slate-950 border border-slate-800/80 rounded p-2.5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400">
                    #{idx + 1}
                  </span>
                  <div className="text-xs font-medium text-slate-200 mt-1 line-clamp-2">
                    {diag}
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">{count} cases</span>
                  <span className="text-emerald-400 font-bold">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
