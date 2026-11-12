"use client";

import React from "react";
import { AnalyticsProvider, useAnalytics } from "@/context/AnalyticsContext";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { OverviewView } from "@/components/views/OverviewView";
import { AdmissionsView } from "@/components/views/AdmissionsView";
import { DiseaseView } from "@/components/views/DiseaseView";
import { DemographicsView } from "@/components/views/DemographicsView";
import { DepartmentView } from "@/components/views/DepartmentView";
import { LosView } from "@/components/views/LosView";
import { InsightsView } from "@/components/views/InsightsView";
import { DatasetView } from "@/components/views/DatasetView";
import { SubmissionView } from "@/components/views/SubmissionView";
import { GraduationCap, Github, FileText, Presentation } from "lucide-react";

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useAnalytics();

  const renderActiveView = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewView />;
      case "admissions":
        return <AdmissionsView />;
      case "diseases":
        return <DiseaseView />;
      case "demographics":
        return <DemographicsView />;
      case "departments":
        return <DepartmentView />;
      case "los":
        return <LosView />;
      case "insights":
        return <InsightsView />;
      case "dataset":
        return <DatasetView />;
      case "submission":
        return <SubmissionView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center space-x-3 truncate">
            <span className="text-xs font-semibold text-slate-200 tracking-wide truncate">
              SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Continuous Learning Assessment – 2 (21CSE423T)
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="/documents/Hospital_Patient_Admission_Analysis_Report.pdf"
              download
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded flex items-center space-x-1.5 transition-colors"
              title="Download 22-page Academic PDF Report"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">PDF Report</span>
            </a>

            <a
              href="/documents/Hospital_Patient_Admission_Analysis_Presentation.pptx"
              download
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded flex items-center space-x-1.5 transition-colors"
              title="Download 15-slide PowerPoint Presentation"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Slide Deck</span>
            </a>

            <a
              href="https://github.com/000Shreeharish000/BDV-ASSIGNMENT"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Global Filter Bar */}
        <FilterBar />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 overflow-y-auto">{renderActiveView()}</main>

        {/* Minimal Enterprise Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-2">
          <div>
            SRM IST Tiruchirappalli • Faculty of Engineering & Technology • Dr. Ganagavalli K
          </div>
          <div className="flex items-center space-x-3">
            <span>Course: 21CSE423T Big Data Visualization</span>
            <span>•</span>
            <span>Max Marks: 20 (CO2 & CO4)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <AnalyticsProvider>
      <MainContent />
    </AnalyticsProvider>
  );
}

