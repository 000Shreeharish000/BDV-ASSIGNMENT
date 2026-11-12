"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LosByDept } from "@/types/analytics";

interface DepartmentWorkloadChartProps {
  data: LosByDept[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const DepartmentWorkloadChart: React.FC<DepartmentWorkloadChartProps> = ({
  data,
  title = "Department Workload Volume vs. Average Length of Stay",
  subtitle = "Admissions volume (left axis) vs Inpatient stay duration in days (right axis)",
  height = 320,
}) => {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const volume = payload.find((p: any) => p.dataKey === "count")?.value;
      const los = payload.find((p: any) => p.dataKey === "mean")?.value;
      const median = payload[0]?.payload?.median;
      const std = payload[0]?.payload?.std;
      return (
        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 mb-1.5 text-blue-400">
            {label}
          </div>
          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-between space-x-3">
              <span className="text-slate-400">Admissions Volume:</span>
              <span className="font-bold text-slate-100">{volume?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between space-x-3">
              <span className="text-slate-400">Mean Stay:</span>
              <span className="font-bold text-red-400">{los} days</span>
            </div>
            <div className="flex justify-between space-x-3">
              <span className="text-slate-400">Median Stay:</span>
              <span className="font-bold text-emerald-400">{median} days</span>
            </div>
            <div className="flex justify-between space-x-3">
              <span className="text-slate-400">Standard Deviation:</span>
              <span className="font-bold text-slate-300">±{std}d</span>
            </div>
          </div>
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
          <ComposedChart
            data={sortedData}
            margin={{ top: 10, right: 10, left: -10, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="department"
              stroke="#64748b"
              fontSize={10}
              interval={0}
              angle={-25}
              textAnchor="end"
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              label={{
                value: "Admissions Volume",
                angle: -90,
                position: "insideLeft",
                fill: "#64748b",
                fontSize: 10,
                offset: 15,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ef4444"
              fontSize={11}
              tickLine={false}
              unit="d"
              label={{
                value: "Mean LOS (Days)",
                angle: 90,
                position: "insideRight",
                fill: "#ef4444",
                fontSize: 10,
                offset: 10,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
              formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
            />
            <Bar
              yAxisId="left"
              dataKey="count"
              name="Admissions Volume"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              barSize={24}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="mean"
              name="Mean LOS (Days)"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#ef4444", stroke: "#0f172a", strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

