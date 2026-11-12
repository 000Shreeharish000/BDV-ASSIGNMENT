import { HospitalRecord, AnalyticalSummary, FilterState, KpiMetrics } from "@/types/analytics";
import summaryDataRaw from "@/data/analytical_summary.json";
import rawRecords from "@/data/hospital_admissions.json";

export const initialSummary: AnalyticalSummary = summaryDataRaw as unknown as AnalyticalSummary;
export const allRecords: HospitalRecord[] = rawRecords as unknown as HospitalRecord[];

export const initialFilterState: FilterState = {
  department: "ALL",
  diseaseCategory: "ALL",
  admissionType: "ALL",
  ageGroup: "ALL",
  gender: "ALL",
  month: "ALL",
  searchQuery: "",
};

export function filterRecords(records: HospitalRecord[], filters: FilterState): HospitalRecord[] {
  return records.filter((r) => {
    if (filters.department !== "ALL" && r.department !== filters.department) return false;
    if (filters.diseaseCategory !== "ALL" && r.disease_category !== filters.diseaseCategory) return false;
    if (filters.admissionType !== "ALL" && r.admission_type !== filters.admissionType) return false;
    if (filters.ageGroup !== "ALL" && r.age_group !== filters.ageGroup) return false;
    if (filters.gender !== "ALL" && r.gender !== filters.gender) return false;
    if (filters.month !== "ALL" && r.month !== filters.month) return false;
    if (filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase();
      const match =
        r.patient_id.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.disease_category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function computeAnalytics(records: HospitalRecord[]): AnalyticalSummary {
  if (records.length === 0) {
    return {
      kpis: {
        total_admissions: 0,
        unique_patients: 0,
        avg_los: 0,
        median_los: 0,
        emergency_pct: 0,
        top_disease: "N/A",
        top_disease_count: 0,
        top_disease_pct: 0,
        top_department: "N/A",
        top_department_count: 0,
        top_dept_pct: 0,
        total_revenue_inr: 0,
        avg_cost_inr: 0,
      },
      admission_types: {},
      disease_distribution: {},
      department_workload: {},
      los_by_department: [],
      los_by_disease: [],
      age_groups: {},
      gender_distribution: {},
      monthly_trends: {},
      monthly_by_type: {},
      day_of_week_trends: {},
      severity_distribution: {},
      discharge_status: {},
      cross_disease_age: {},
      cross_disease_gender: {},
      insights: ["No records match the selected filter criteria. Please broaden your filters."],
    };
  }

  const total = records.length;
  const uniquePts = new Set(records.map((r) => r.patient_id)).size;
  
  const losValues = records.map((r) => r.length_of_stay).sort((a, b) => a - b);
  const avgLos = Number((losValues.reduce((acc, v) => acc + v, 0) / total).toFixed(2));
  const medianLos = losValues[Math.floor(losValues.length / 2)];

  const totalRev = records.reduce((acc, r) => acc + r.total_cost_inr, 0);
  const avgCost = Math.round(totalRev / total);

  // Groupings
  const admTypes: Record<string, number> = {};
  const diseaseDist: Record<string, number> = {};
  const deptWorkload: Record<string, number> = {};
  const ageGroups: Record<string, number> = {};
  const genderDist: Record<string, number> = {};
  const severityDist: Record<string, number> = {};
  const dischargeDist: Record<string, number> = {};

  const deptLosMap: Record<string, number[]> = {};
  const diseaseLosMap: Record<string, number[]> = {};

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrends: Record<string, number> = {};
  monthOrder.forEach((m) => (monthlyTrends[m] = 0));

  const monthlyByType: Record<string, Record<string, number>> = {
    Emergency: {},
    Urgent: {},
    "Elective / Scheduled": {},
  };
  monthOrder.forEach((m) => {
    monthlyByType.Emergency[m] = 0;
    monthlyByType.Urgent[m] = 0;
    monthlyByType["Elective / Scheduled"][m] = 0;
  });

  const dowOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dowTrends: Record<string, number> = {};
  dowOrder.forEach((d) => (dowTrends[d] = 0));

  records.forEach((r) => {
    admTypes[r.admission_type] = (admTypes[r.admission_type] || 0) + 1;
    diseaseDist[r.disease_category] = (diseaseDist[r.disease_category] || 0) + 1;
    deptWorkload[r.department] = (deptWorkload[r.department] || 0) + 1;
    ageGroups[r.age_group] = (ageGroups[r.age_group] || 0) + 1;
    genderDist[r.gender] = (genderDist[r.gender] || 0) + 1;
    severityDist[r.severity] = (severityDist[r.severity] || 0) + 1;
    dischargeDist[r.discharge_status] = (dischargeDist[r.discharge_status] || 0) + 1;

    if (!deptLosMap[r.department]) deptLosMap[r.department] = [];
    deptLosMap[r.department].push(r.length_of_stay);

    if (!diseaseLosMap[r.disease_category]) diseaseLosMap[r.disease_category] = [];
    diseaseLosMap[r.disease_category].push(r.length_of_stay);

    if (monthlyTrends[r.month] !== undefined) monthlyTrends[r.month]++;
    if (monthlyByType[r.admission_type] && monthlyByType[r.admission_type][r.month] !== undefined) {
      monthlyByType[r.admission_type][r.month]++;
    }
    if (dowTrends[r.day_of_week] !== undefined) dowTrends[r.day_of_week]++;
  });

  const emergencyCount = admTypes["Emergency"] || 0;
  const emergencyPct = Number(((emergencyCount / total) * 100).toFixed(1));

  // Top disease
  const sortedDiseases = Object.entries(diseaseDist).sort((a, b) => b[1] - a[1]);
  const topDisease = sortedDiseases[0] ? sortedDiseases[0][0] : "N/A";
  const topDiseaseCount = sortedDiseases[0] ? sortedDiseases[0][1] : 0;
  const topDiseasePct = Number(((topDiseaseCount / total) * 100).toFixed(1));

  // Top department
  const sortedDepts = Object.entries(deptWorkload).sort((a, b) => b[1] - a[1]);
  const topDept = sortedDepts[0] ? sortedDepts[0][0] : "N/A";
  const topDeptCount = sortedDepts[0] ? sortedDepts[0][1] : 0;
  const topDeptPct = Number(((topDeptCount / total) * 100).toFixed(1));

  // LOS by dept
  const losByDept = Object.entries(deptLosMap).map(([dept, vals]) => {
    const mean = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
    const sorted = [...vals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const std = Number(
      Math.sqrt(vals.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
    );
    return { department: dept, mean, median, std, count: vals.length };
  });

  // LOS by disease
  const losByDisease = Object.entries(diseaseLosMap).map(([disease, vals]) => {
    const mean = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
    const sorted = [...vals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { disease_category: disease, mean, median, count: vals.length };
  });

  const insights: string[] = [
    `Currently analyzing ${total.toLocaleString()} clinical records representing ${uniquePts.toLocaleString()} unique patients.`,
    `Average hospital stay across current filter selection is ${avgLos} days (median: ${medianLos} days).`,
    `${topDisease} constitutes the largest diagnostic volume (${topDiseaseCount} cases, ${topDiseasePct}% of subset).`,
    `Emergency acuity accounts for ${emergencyPct}% of active patient admissions (${emergencyCount.toLocaleString()} cases).`,
    `${topDept} represents the highest departmental operational workload (${topDeptCount} admissions, ${topDeptPct}%).`,
    `Aggregate billing expenditure across current selection totals ₹${totalRev.toLocaleString()} (average ₹${avgCost.toLocaleString()} per episode).`
  ];

  return {
    kpis: {
      total_admissions: total,
      unique_patients: uniquePts,
      avg_los: avgLos,
      median_los: medianLos,
      emergency_pct: emergencyPct,
      top_disease: topDisease,
      top_disease_count: topDiseaseCount,
      top_disease_pct: topDiseasePct,
      top_department: topDept,
      top_department_count: topDeptCount,
      top_dept_pct: topDeptPct,
      total_revenue_inr: totalRev,
      avg_cost_inr: avgCost,
    },
    admission_types: admTypes,
    disease_distribution: diseaseDist,
    department_workload: deptWorkload,
    los_by_department: losByDept,
    los_by_disease: losByDisease,
    age_groups: ageGroups,
    gender_distribution: genderDist,
    monthly_trends: monthlyTrends,
    monthly_by_type: monthlyByType,
    day_of_week_trends: dowTrends,
    severity_distribution: severityDist,
    discharge_status: dischargeDist,
    cross_disease_age: initialSummary.cross_disease_age,
    cross_disease_gender: initialSummary.cross_disease_gender,
    insights,
  };
}

