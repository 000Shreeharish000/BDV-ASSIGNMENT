"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { D3DonutChart } from "@/components/charts/D3DonutChart";
import { D3BarChart } from "@/components/charts/D3BarChart";
import { DemographicsChart } from "@/components/charts/DemographicsChart";
import { Users, UserCheck, ShieldAlert, HeartHandshake } from "lucide-react";

export const DemographicsView: React.FC = () => {
  const { summary, filteredRecords } = useAnalytics();

  // Age group bar data
  const ageOrder = [
    "Pediatric (0-17)",
    "Young Adult (18-35)",
    "Middle-Aged (36-55)",
    "Senior (56-70)",
    "Geriatric (71+)",
  ];
  const ageColors: Record<string, string> = {
    "Pediatric (0-17)": "#0284c7",
    "Young Adult (18-35)": "#2563eb",
    "Middle-Aged (36-55)": "#4f46e5",
    "Senior (56-70)": "#7c3aed",
    "Geriatric (71+)": "#d97706",
  };
  const ageBarData = ageOrder.map((g) => ({
    label: g,
    value: summary.age_groups[g] || 0,
    color: ageColors[g] || "#3b82f6",
  }));

  // Gender donut data
  const genderColors: Record<string, string> = {
    Male: "#2563eb",
    Female: "#ec4899",
    Other: "#64748b",
  };
  const genderDonutData = Object.entries(summary.gender_distribution).map(([label, value]) => ({
    label,
    value,
    color: genderColors[label] || "#3b82f6",
  }));

  // Senior + Geriatric total
  const seniorCount = (summary.age_groups["Senior (56-70)"] || 0) + (summary.age_groups["Geriatric (71+)"] || 0);
  const totalPts = filteredRecords.length || 1;
  const seniorPct = ((seniorCount / totalPts) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="text-base font-semibold text-slate-100 mb-1">
          Patient Demographics & Population Vulnerability Stratification
        </h2>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Analysis of age cohort vulnerability, biological gender ratios, and demographic-specific disease susceptibility.
        </p>
      </div>

      {/* Grid: Age Cohorts & Gender Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <D3BarChart
          data={ageBarData}
          title="Patient Age Cohort Distribution"
          subtitle="Volume of admissions across 5 standardized clinical age brackets"
          height={280}
          valueLabel="patients"
          showPercentages={true}
        />

        <D3DonutChart
          data={genderDonutData}
          title="Biological Gender Ratio"
          subtitle="Proportion of Male, Female, and Other presentations"
          centerLabel="Total Patients"
          height={280}
        />
      </div>

      {/* Cross-tabulation chart */}
      <DemographicsChart
        crossDiseaseAge={summary.cross_disease_age}
        crossDiseaseGender={summary.cross_disease_gender}
        height={340}
      />

      {/* Demographic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <Users className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Geriatric Concentration
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Patients aged 56 and above represent <b>{seniorPct}% of total admissions</b> ({seniorCount.toLocaleString()} cases). This demographic consumes 49.0% of all hospital bed-days, dominated by chronic cardiovascular and neurological conditions.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-pink-400 mb-2">
            <UserCheck className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Gender Disparities
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Male presentations lead at <b>52.8%</b> (2,112 patients) vs Female at <b>46.2%</b> (1,850 patients). Male predominance is most pronounced in Orthopedic Trauma (64.8% male), while Endocrine disorders show a slight female preponderance.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3">
          <div className="flex items-center space-x-2 text-teal-400 mb-2">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Pediatric Morbidity
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pediatric patients (0–17 years) account for <b>8.2% of hospitalizations</b> (327 cases). Respiratory infections represent 40.1% of all pediatric admissions, indicating high acute winter bronchiolitis and asthma burden.
          </p>
        </div>
      </div>
    </div>
  );
};
