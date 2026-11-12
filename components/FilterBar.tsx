"use client";

import React from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { Search, RotateCcw, Download, Filter } from "lucide-react";

export const FilterBar: React.FC = () => {
  const {
    filters,
    setFilter,
    resetFilters,
    activeFilterCount,
    exportCsv,
    filteredRecords,
  } = useAnalytics();

  const departments = [
    "ALL",
    "Cardiology",
    "Pulmonology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Endocrinology",
    "Oncology",
    "Intensive Care Unit (ICU)",
    "General Medicine",
  ];

  const diseaseCategories = [
    "ALL",
    "Cardiovascular Diseases",
    "Respiratory Infections",
    "Gastrointestinal Conditions",
    "Neurological Disorders",
    "Orthopedic Trauma",
    "Endocrine & Metabolic",
    "Oncology & Neoplasms",
    "Infectious & Parasitic",
  ];

  const admissionTypes = [
    "ALL",
    "Emergency",
    "Urgent",
    "Elective / Scheduled",
  ];

  const ageGroups = [
    "ALL",
    "Pediatric (0-17)",
    "Young Adult (18-35)",
    "Middle-Aged (36-55)",
    "Senior (56-70)",
    "Geriatric (71+)",
  ];

  const genders = ["ALL", "Male", "Female", "Other"];

  const months = [
    "ALL",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-2.5">
      {/* Top row: search + action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient ID, diagnosis, department..."
              value={filters.searchQuery}
              onChange={(e) => setFilter("searchQuery", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
          </div>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/70 border border-blue-800/80 px-2 py-1 rounded flex items-center space-x-1 shrink-0">
              <Filter className="w-3 h-3" />
              <span>{activeFilterCount} active</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
              activeFilterCount > 0
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white"
                : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
            }`}
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
            title="Download currently filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Bottom row: multi-dropdown filter controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
        {/* Department */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => setFilter("department", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "ALL" ? "All Departments" : d}
              </option>
            ))}
          </select>
        </div>

        {/* Disease Category */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Disease Category
          </label>
          <select
            value={filters.diseaseCategory}
            onChange={(e) => setFilter("diseaseCategory", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {diseaseCategories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Diseases" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Type */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Admission Type
          </label>
          <select
            value={filters.admissionType}
            onChange={(e) => setFilter("admissionType", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {admissionTypes.map((t) => (
              <option key={t} value={t}>
                {t === "ALL" ? "All Admission Types" : t}
              </option>
            ))}
          </select>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Age Group
          </label>
          <select
            value={filters.ageGroup}
            onChange={(e) => setFilter("ageGroup", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {ageGroups.map((g) => (
              <option key={g} value={g}>
                {g === "ALL" ? "All Age Groups" : g}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilter("gender", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g === "ALL" ? "All Genders" : g}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
            Calendar Month
          </label>
          <select
            value={filters.month}
            onChange={(e) => setFilter("month", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-xs truncate"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m === "ALL" ? "Full Year (2024)" : m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
