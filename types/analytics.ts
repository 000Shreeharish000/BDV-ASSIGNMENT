export interface HospitalRecord {
  patient_id: string;
  admission_date: string;
  discharge_date: string;
  month: string;
  month_num: number;
  quarter: string;
  day_of_week: string;
  age: number;
  age_group: string;
  gender: string;
  disease_category: string;
  diagnosis: string;
  department: string;
  admission_type: string;
  length_of_stay: number;
  severity: string;
  discharge_status: string;
  total_cost_inr: number;
  insurance_type: string;
}

export interface KpiMetrics {
  total_admissions: number;
  unique_patients: number;
  avg_los: number;
  median_los: number;
  emergency_pct: number;
  top_disease: string;
  top_disease_count: number;
  top_disease_pct: number;
  top_department: string;
  top_department_count: number;
  top_dept_pct: number;
  total_revenue_inr: number;
  avg_cost_inr: number;
}

export interface LosByDept {
  department: string;
  mean: number;
  median: number;
  std: number;
  count: number;
}

export interface LosByDisease {
  disease_category: string;
  mean: number;
  median: number;
  count: number;
}

export interface AnalyticalSummary {
  kpis: KpiMetrics;
  admission_types: Record<string, number>;
  disease_distribution: Record<string, number>;
  department_workload: Record<string, number>;
  los_by_department: LosByDept[];
  los_by_disease: LosByDisease[];
  age_groups: Record<string, number>;
  gender_distribution: Record<string, number>;
  monthly_trends: Record<string, number>;
  monthly_by_type: Record<string, Record<string, number>>;
  day_of_week_trends: Record<string, number>;
  severity_distribution: Record<string, number>;
  discharge_status: Record<string, number>;
  cross_disease_age: Record<string, Record<string, number>>;
  cross_disease_gender: Record<string, Record<string, number>>;
  insights: string[];
}

export interface FilterState {
  department: string;
  diseaseCategory: string;
  admissionType: string;
  ageGroup: string;
  gender: string;
  month: string;
  searchQuery: string;
}

