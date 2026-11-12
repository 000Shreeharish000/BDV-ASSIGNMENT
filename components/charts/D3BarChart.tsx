"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export interface BarDataItem {
  label: string;
  value: number;
  secondaryValue?: number | string;
  color?: string;
}

interface D3BarChartProps {
  data: BarDataItem[];
  title?: string;
  subtitle?: string;
  height?: number;
  valueLabel?: string;
  showPercentages?: boolean;
}

export const D3BarChart: React.FC<D3BarChartProps> = ({
  data,
  title,
  subtitle,
  height = 320,
  valueLabel = "Admissions",
  showPercentages = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
    detail?: string;
  }>({ visible: false, x: 0, y: 0, label: "", value: 0 });

  const total = data.reduce((acc, d) => acc + d.value, 0);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const margin = { top: 10, right: 75, bottom: 25, left: 160 };
    const width = containerRef.current.clientWidth || 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerHeight])
      .padding(0.25);

    const maxVal = d3.max(data, (d) => d.value) || 1;
    const xScale = d3.scaleLinear().domain([0, maxVal * 1.08]).range([0, innerWidth]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#1e293b")
      .attr("stroke-dasharray", "2,2");

    g.select(".grid .domain").remove();

    // Bars
    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.label) || 0)
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", (d) => xScale(d.value))
      .attr("fill", (d) => d.color || "#3b82f6")
      .attr("rx", 3)
      .style("cursor", "pointer")
      .style("transition", "fill 0.2s ease");

    bars
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("fill", "#60a5fa");
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltip({
          visible: true,
          x,
          y,
          label: d.label,
          value: d.value,
          detail: d.secondaryValue ? String(d.secondaryValue) : undefined,
        });
      })
      .on("mousemove", function (event) {
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltip((prev) => ({ ...prev, x, y }));
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).attr("fill", d.color || "#3b82f6");
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    // Value Labels at end of bar
    g.selectAll(".val-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "val-label")
      .attr("x", (d) => xScale(d.value) + 6)
      .attr("y", (d) => (yScale(d.label) || 0) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("font-family", "monospace")
      .attr("font-size", "10px")
      .attr("fill", "#94a3b8")
      .text((d) => {
        const pct = total > 0 ? ` (${((d.value / total) * 100).toFixed(1)}%)` : "";
        return `${d.value.toLocaleString()}${showPercentages ? pct : ""}`;
      });

    // Y Axis (Labels)
    const yAxis = g.append("g").call(d3.axisLeft(yScale).tickSize(0));
    yAxis.select(".domain").remove();
    yAxis
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("fill", "#cbd5e1")
      .attr("dx", "-6px");

    // X Axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(4));
    xAxis.select(".domain").attr("stroke", "#334155");
    xAxis.selectAll("line").attr("stroke", "#334155");
    xAxis
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("fill", "#64748b");
  }, [data, height, showPercentages, total]);

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

      <div className="relative overflow-x-auto">
        <svg ref={svgRef} className="overflow-visible w-full" />

        {tooltip.visible && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded shadow-xl text-xs text-slate-100 font-mono"
            style={{
              left: `${tooltip.x + 12}px`,
              top: `${tooltip.y - 12}px`,
            }}
          >
            <div className="text-[11px] font-bold text-blue-400">{tooltip.label}</div>
            <div className="text-[10px] text-slate-300">
              {tooltip.value.toLocaleString()} {valueLabel}
              {total > 0 && ` (${((tooltip.value / total) * 100).toFixed(1)}%)`}
            </div>
            {tooltip.detail && (
              <div className="text-[10px] text-emerald-400 border-t border-slate-800 mt-1 pt-0.5">
                {tooltip.detail}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

