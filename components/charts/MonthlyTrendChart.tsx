"use client";

import React from "react";
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

interface MonthlyTrendChartProps {
  monthlyByType: Record<string, Record<string, number>>;
  title?: string;
  subtitle?: string;
  height?: number;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  monthlyByType,
  title = "Monthly Admissions by Triage Classification (FY2024)",
  subtitle = "Emergency vs Urgent vs Elective intake volume across calendar months",
  height = 300,
}) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = months.map((m) => {
    const emergency = monthlyByType["Emergency"]?.[m] || 0;
    const urgent = monthlyByType["Urgent"]?.[m] || 0;
    const elective = monthlyByType["Elective / Scheduled"]?.[m] || 0;
    return {
      month: m,
      Emergency: emergency,
      Urgent: urgent,
      "Elective / Scheduled": elective,
      total: emergency + urgent + elective,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const tot = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
            <span>{label} 2024</span>
            <span className="text-blue-400">{tot.toLocaleString()} total</span>
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
      <div className="mb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide">{title}</h3>
        <p className="text-[11px] text-slate-400 font-mono">{subtitle}</p>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
            />
            <Bar dataKey="Emergency" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Urgent" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Elective / Scheduled" stackId="a" fill="#64748b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
