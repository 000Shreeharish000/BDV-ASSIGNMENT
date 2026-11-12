"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export interface DonutDataItem {
  label: string;
  value: number;
  color?: string;
}

interface D3DonutChartProps {
  data: DonutDataItem[];
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

const DEFAULT_COLORS = [
  "#2563eb",
  "#0d9488",
  "#4f46e5",
  "#d97706",
  "#e11d48",
  "#0284c7",
  "#7c3aed",
  "#059669",
  "#64748b",
];

export const D3DonutChart: React.FC<D3DonutChartProps> = ({
  data,
  title,
  subtitle,
  centerLabel = "TOTAL",
  centerValue,
  height = 260,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
    pct: string;
  }>({ visible: false, x: 0, y: 0, label: "", value: 0, pct: "" });

  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth || 320;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.62;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(data.map((d, i) => d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]));

    const pie = d3
      .pie<DonutDataItem>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<DonutDataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .padAngle(0.02)
      .cornerRadius(3);

    const arcHover = d3
      .arc<d3.PieArcDatum<DonutDataItem>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 6)
      .padAngle(0.02)
      .cornerRadius(4);

    const paths = g
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.label))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .style("transition", "all 0.2s ease");

    paths
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(150).attr("d", arcHover as any);
        const [x, y] = d3.pointer(event, containerRef.current);
        const pct = total > 0 ? ((d.data.value / total) * 100).toFixed(1) + "%" : "0%";
        setTooltip({
          visible: true,
          x,
          y,
          label: d.data.label,
          value: d.data.value,
          pct,
        });
      })
      .on("mousemove", function (event) {
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltip((prev) => ({ ...prev, x, y }));
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(150).attr("d", arc as any);
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    // Center Text
    const centerGroup = g.append("g").attr("text-anchor", "middle");
    centerGroup
      .append("text")
      .attr("dy", "-0.2em")
      .attr("font-size", "18px")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .attr("fill", "#f8fafc")
      .text(centerValue || total.toLocaleString());

    centerGroup
      .append("text")
      .attr("dy", "1.2em")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "600")
      .attr("fill", "#94a3b8")
      .attr("letter-spacing", "0.08em")
      .text(centerLabel.toUpperCase());
  }, [data, height, centerLabel, centerValue, total]);

  return (
    <div
      ref={containerRef}
      className="bg-slate-900 border border-slate-800 rounded p-3 relative flex flex-col justify-between"
    >
      {(title || subtitle) && (
        <div className="mb-2">
          {title && (
            <h3 className="text-xs font-semibold text-slate-200 tracking-wide">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-mono">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative flex justify-center items-center">
        <svg ref={svgRef} className="overflow-visible" />

        {/* Custom interactive tooltip */}
        {tooltip.visible && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-950 border border-slate-700/80 px-2.5 py-1.5 rounded shadow-xl text-xs text-slate-100 font-mono"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 10}px`,
            }}
          >
            <div className="text-[11px] font-bold text-blue-400">{tooltip.label}</div>
            <div className="text-[10px] text-slate-300">
              {tooltip.value.toLocaleString()} admissions ({tooltip.pct})
            </div>
          </div>
        )}
      </div>

      {/* Mini responsive legend */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
        {data.slice(0, 6).map((item, i) => {
          const color = item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.label} className="flex items-center space-x-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-400 truncate">{item.label}</span>
              <span className="text-slate-300 font-mono font-medium ml-auto">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
