"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { HospitalRecord, AnalyticalSummary, FilterState } from "@/types/analytics";
import {
  allRecords,
  initialSummary,
  initialFilterState,
  filterRecords,
  computeAnalytics,
} from "@/lib/analyticsData";

interface AnalyticsContextType {
  records: HospitalRecord[];
  filteredRecords: HospitalRecord[];
  summary: AnalyticalSummary;
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exportCsv: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const filteredRecords = useMemo(() => {
    return filterRecords(allRecords, filters);
  }, [filters]);

  const summary = useMemo(() => {
    // If no filters are active, return initial precomputed summary for instant render
    const isDefault =
      filters.department === "ALL" &&
      filters.diseaseCategory === "ALL" &&
      filters.admissionType === "ALL" &&
      filters.ageGroup === "ALL" &&
      filters.gender === "ALL" &&
      filters.month === "ALL" &&
      filters.searchQuery.trim() === "";

    if (isDefault) {
      return initialSummary;
    }
    return computeAnalytics(filteredRecords);
  }, [filteredRecords, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== "ALL") count++;
    if (filters.diseaseCategory !== "ALL") count++;
    if (filters.admissionType !== "ALL") count++;
    if (filters.ageGroup !== "ALL") count++;
    if (filters.gender !== "ALL") count++;
    if (filters.month !== "ALL") count++;
    if (filters.searchQuery.trim() !== "") count++;
    return count;
  }, [filters]);

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const exportCsv = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = Object.keys(filteredRecords[0]).join(",");
    const rows = filteredRecords.map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hospital_admissions_filtered_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        records: allRecords,
        filteredRecords,
        summary,
        filters,
        setFilter,
        resetFilters,
        activeFilterCount,
        activeTab,
        setActiveTab,
        exportCsv,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
