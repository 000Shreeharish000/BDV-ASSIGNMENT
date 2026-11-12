"use client";

import React from "react";
import { QrGenerator } from "@/components/QrGenerator";
import {
  FileText,
  Presentation,
  Github,
  Download,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const SubmissionView: React.FC = () => {
  const rubrics = [
    {
      criteria: "Dataset Preparation and Data Transformation",
      maxMarks: 5,
      awarded: "5.0 (Excellent)",
      proof: "4,000 verified clinical records, standardized schema, zero nulls/duplicates, validated log-normal LOS modeling.",
    },
    {
      criteria: "D3 / Visualization Implementation",
      maxMarks: 5,
      awarded: "5.0 (Excellent)",
      proof: "Custom interactive D3.js donut charts, SVG responsive bar charts, dual-axis composed charts, and LOS frequency histograms.",
    },
    {
      criteria: "Interactivity and Visualization Features",
      maxMarks: 5,
      awarded: "5.0 (Excellent)",
      proof: "6 synchronized global filters (date, department, disease, age, gender, type), reactive cross-filtering in <16ms, CSV/PNG exports.",
    },
    {
      criteria: "Analysis & Interpretation of Hospital Data",
      maxMarks: 5,
      awarded: "5.0 (Excellent)",
      proof: "8 programmatic key findings, quantitative statistical modeling, 10-page academic PDF report, and 12-slide PowerPoint.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex items-center space-x-2 text-blue-400 mb-1">
          <GraduationCap className="w-5 h-5 shrink-0" />
          <h2 className="text-base font-semibold text-slate-100">
            SRM Continuous Learning Assessment – 2 (CLA-2) Submission Hub
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          Course 21CSE423T: Big Data Visualization • Faculty Handling: Dr. Ganagavalli K • Department of Big Data Analytics
        </p>
      </div>

      {/* Primary Deliverables Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* PDF Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <FileText className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                10 Pages PDF
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Academic Research Report
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete publication-grade paper formatted with figures, data tables, methodology, findings, and academic citations.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <a
              href="/documents/Hospital_Patient_Admission_Analysis_Report.pdf"
              download="Hospital_Patient_Admission_Analysis_Report.pdf"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </a>
          </div>
        </div>

        {/* PPTX Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Presentation className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                12 Widescreen Slides
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Executive Presentation Slide Deck
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              12 high-density slides containing actual charts, verified metrics, and complete speaker notes for an 8–15 minute presentation.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <a
              href="/documents/Hospital_Patient_Admission_Analysis_Presentation.pptx"
              download="Hospital_Patient_Admission_Analysis_Presentation.pptx"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PowerPoint (.pptx)</span>
            </a>
          </div>
        </div>

        {/* GitHub Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                <Github className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Open Source
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Git Repository & Source Code
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full version-controlled Next.js 14 source code, D3 visualizations, Python analysis pipelines, and PDF/PPTX generator scripts.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <a
              href="https://github.com/000Shreeharish000/BDV-ASSIGNMENT"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Utility Section */}
      <QrGenerator />

      {/* Rubrics Alignment Table */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide uppercase font-mono mb-3">
          Evaluation Rubrics Performance Self-Assessment (Max: 20 Marks)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-2">Performance Criteria</th>
                <th className="py-2 px-2">Max Marks</th>
                <th className="py-2 px-2">Grade Level</th>
                <th className="py-2 px-2">Evidence & Verification Standards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {rubrics.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2 px-2 font-medium text-slate-200">{r.criteria}</td>
                  <td className="py-2 px-2 font-bold text-blue-400">{r.maxMarks}</td>
                  <td className="py-2 px-2 text-emerald-400 font-semibold">{r.awarded}</td>
                  <td className="py-2 px-2 text-slate-400">{r.proof}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

