"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { Database, Download, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export const DatasetView: React.FC = () => {
  const { exportCsv } = useAnalytics();

  const dataDictionary = [
    { attr: "patient_id", type: "String", domain: "PAT-00001 to PAT-04000", desc: "Unique anonymized patient identification token." },
    { attr: "admission_date", type: "ISO Date", domain: "2024-01-01 to 2024-12-31", desc: "Timestamp of clinical triage presentation." },
    { attr: "discharge_date", type: "ISO Date", domain: "2024-01-02 to 2025-01-28", desc: "Timestamp of completed inpatient discharge." },
    { attr: "age / age_group", type: "Int / Categorical", domain: "0–94 yrs; 5 cohorts", desc: "Demographic stratum (Pediatric to Geriatric)." },
    { attr: "gender", type: "Categorical", domain: "Male, Female, Other", desc: "Patient biological and recorded gender classification." },
    { attr: "disease_category", type: "Categorical", domain: "8 Primary Chapters", desc: "Primary clinical chapter (Cardiovascular, Respiratory, etc.)." },
    { attr: "diagnosis", type: "String", domain: "32 Specific ICD Diagnoses", desc: "Granular confirmed diagnosis (e.g., Acute Myocardial Infarction)." },
    { attr: "department", type: "Categorical", domain: "9 Operational Units", desc: "Treating clinical specialty ward or intensive care unit." },
    { attr: "admission_type", type: "Categorical", domain: "Emergency, Urgent, Elective", desc: "Triage classification at hospital presentation." },
    { attr: "length_of_stay", type: "Integer", domain: "1 to 35 inpatient days", desc: "Completed stay duration modeled via right-skewed lognormal distribution." },
    { attr: "severity", type: "Categorical", domain: "Mild, Moderate, Severe, Critical", desc: "Triage severity index assessed upon clinical intake." },
    { attr: "discharge_status", type: "Categorical", domain: "Home, Rehab, Transferred, Mortality", desc: "Clinical outcome upon hospital departure." },
    { attr: "total_cost_inr", type: "Numeric", domain: "₹14,500 to ₹385,000", desc: "Comprehensive patient billing expenditure in Indian Rupees." },
    { attr: "insurance_type", type: "Categorical", domain: "Private, Govt Scheme, Out-of-Pocket", desc: "Payer insurance category absorbing hospitalization cost." },
  ];

  const downloadJson = () => {
    const link = document.createElement("a");
    link.href = "/data/hospital_admissions.json";
    link.download = "hospital_admissions.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex items-center space-x-2 text-blue-400 mb-1">
          <Database className="w-4 h-4 shrink-0" />
          <h2 className="text-base font-semibold text-slate-100">
            Dataset Architecture, Data Dictionary & ETL Pipeline
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Full technical provenance, attribute constraints, and data engineering transformations for the 4,000 record clinical corpus.
        </p>
      </div>

      {/* Dataset Provenance Alert */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <h4 className="font-bold text-slate-100 mb-1">
              Ethical Disclosure & Data Provenance
            </h4>
            To protect patient medical confidentiality and comply with international healthcare privacy statutes (HIPAA / GDPR), real identifiable patient records are not published. This dataset was synthesized deterministically based on standardized clinical healthcare distributions mimicking the <b>CDC National Hospital Discharge Survey (NHDS)</b> and <b>MIMIC-IV clinical databases</b>. All distributions, seasonal trends, and length-of-stay parameters strictly reflect authentic clinical dynamics.
          </div>
        </div>
      </div>

      {/* Download Action Bar */}
      <div className="flex items-center space-x-3">
        <button
          onClick={exportCsv}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Processed Dataset (CSV)</span>
        </button>
        <button
          onClick={downloadJson}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Download Structured Schema (JSON)</span>
        </button>
      </div>

      {/* Comprehensive Data Dictionary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide uppercase font-mono mb-2">
          Clinical and Operational Data Dictionary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-2">Attribute</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Domain / Constraints</th>
                <th className="py-2 px-2">Description & Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {dataDictionary.map((item) => (
                <tr key={item.attr} className="hover:bg-slate-800/40">
                  <td className="py-1.5 px-2 font-bold text-blue-400">{item.attr}</td>
                  <td className="py-1.5 px-2 text-slate-400">{item.type}</td>
                  <td className="py-1.5 px-2 text-emerald-400">{item.domain}</td>
                  <td className="py-1.5 px-2 text-slate-300">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
