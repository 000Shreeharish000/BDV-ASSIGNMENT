"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DemographicsChartProps {
  crossDiseaseAge: Record<string, Record<string, number>>;
  crossDiseaseGender: Record<string, Record<string, number>>;
  height?: number;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  crossDiseaseAge,
  crossDiseaseGender,
  height = 340,
}) => {
  const [mode, setMode] = useState<"age" | "gender">("age");

  const ageCohorts = [
    "Pediatric (0-17)",
    "Young Adult (18-35)",
    "Middle-Aged (36-55)",
    "Senior (56-70)",
    "Geriatric (71+)",
  ];

  const diseases = Object.keys(crossDiseaseGender.Male || crossDiseaseAge["Senior (56-70)"] || {});

  // Build dataset
  const ageData = diseases.map((d) => {
    const item: Record<string, any> = { disease: d };
    ageCohorts.forEach((ac) => {
      item[ac] = crossDiseaseAge[ac]?.[d] || 0;
    });
    return item;
  });

  const genderData = diseases.map((d) => {
    return {
      disease: d,
      Male: crossDiseaseGender.Male?.[d] || 0,
      Female: crossDiseaseGender.Female?.[d] || 0,
      Other: crossDiseaseGender.Other?.[d] || 0,
    };
  });

  const data = mode === "age" ? ageData : genderData;

  const ageColors: Record<string, string> = {
    "Pediatric (0-17)": "#0284c7",
    "Young Adult (18-35)": "#2563eb",
    "Middle-Aged (36-55)": "#4f46e5",
    "Senior (56-70)": "#7c3aed",
    "Geriatric (71+)": "#d97706",
  };

  const genderColors: Record<string, string> = {
    Male: "#2563eb",
    Female: "#ec4899",
    Other: "#64748b",
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const tot = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
          <div className="font-bold text-blue-400 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
            <span>{label}</span>
            <span className="text-slate-100">{tot} total</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3 text-[11px] py-0.5">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300">{entry.name}:</span>
              </span>
              <span className="font-bold text-slate-100">
                {entry.value} ({tot > 0 ? ((entry.value / tot) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-semibold text-slate-200 tracking-wide">
            {mode === "age"
              ? "Disease Distribution Across Age Cohorts"
              : "Disease Distribution Stratified by Gender"}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            {mode === "age"
              ? "Vulnerability patterns across pediatric to geriatric populations"
              : "Comparative clinical volume between male and female presentations"}
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center bg-slate-950 p-0.5 border border-slate-800 rounded text-xs font-mono">
          <button
            onClick={() => setMode("age")}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === "age"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Age Cohorts
          </button>
          <button
            onClick={() => setMode("gender")}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === "gender"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Gender Split
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 100, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis
              type="category"
              dataKey="disease"
              stroke="#cbd5e1"
              fontSize={10}
              tickLine={false}
              width={95}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
            />
            {mode === "age"
              ? ageCohorts.map((ac) => (
                  <Bar
                    key={ac}
                    dataKey={ac}
                    stackId="a"
                    fill={ageColors[ac]}
                    barSize={16}
                  />
                ))
              : ["Male", "Female", "Other"].map((g) => (
                  <Bar
                    key={g}
                    dataKey={g}
                    stackId="a"
                    fill={genderColors[g]}
                    barSize={16}
                  />
                ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

