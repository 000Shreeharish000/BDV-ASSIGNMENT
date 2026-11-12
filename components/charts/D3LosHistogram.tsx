"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface D3LosHistogramProps {
  values: number[];
  avgLos: number;
  medianLos: number;
  title?: string;
  subtitle?: string;
  height?: number;
}

export const D3LosHistogram: React.FC<D3LosHistogramProps> = ({
  values,
  avgLos,
  medianLos,
  title,
  subtitle,
  height = 280,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    los: string;
    count: number;
    pct: string;
  }>({ visible: false, x: 0, y: 0, los: "", count: 0, pct: "" });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || values.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 35, left: 45 };
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

    const maxLos = Math.max(30, d3.max(values) || 30);
    const xScale = d3.scaleLinear().domain([1, maxLos]).range([0, innerWidth]);

    // Bins
    const histogram = d3
      .bin()
      .domain([1, maxLos])
      .thresholds(d3.range(1, maxLos + 1));

    const bins = histogram(values);
    const maxBinCount = d3.max(bins, (d) => d.length) || 1;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxBinCount * 1.1])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#1e293b")
      .attr("stroke-dasharray", "2,2");

    g.select(".grid .domain").remove();

    // Bars
    g.selectAll(".bin-bar")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bin-bar")
      .attr("x", (d) => xScale(d.x0 || 1) + 1)
      .attr("width", (d) => Math.max(1, xScale(d.x1 || 2) - xScale(d.x0 || 1) - 1.5))
      .attr("y", (d) => yScale(d.length))
      .attr("height", (d) => innerHeight - yScale(d.length))
      .attr("fill", "#2563eb")
      .attr("rx", 1.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("fill", "#60a5fa");
        const [x, y] = d3.pointer(event, containerRef.current);
        const pct = ((d.length / values.length) * 100).toFixed(1) + "%";
        setTooltip({
          visible: true,
          x,
          y,
          los: `${d.x0} days`,
          count: d.length,
          pct,
        });
      })
      .on("mousemove", function (event) {
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltip((prev) => ({ ...prev, x, y }));
      })
      .on("mouseleave", function () {
        d3.select(this).attr("fill", "#2563eb");
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    // Mean Line
    if (avgLos >= 1 && avgLos <= maxLos) {
      g.append("line")
        .attr("x1", xScale(avgLos))
        .attr("x2", xScale(avgLos))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4");

      g.append("text")
        .attr("x", xScale(avgLos) + 4)
        .attr("y", 12)
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .attr("fill", "#ef4444")
        .attr("font-weight", "bold")
        .text(`Mean: ${avgLos}d`);
    }

    // Median Line
    if (medianLos >= 1 && medianLos <= maxLos) {
      g.append("line")
        .attr("x1", xScale(medianLos))
        .attr("x2", xScale(medianLos))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#10b981")
        .attr("stroke-width", 1.8)
        .attr("stroke-dasharray", "3,3");

      g.append("text")
        .attr("x", xScale(medianLos) + 4)
        .attr("y", 28)
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .attr("fill", "#10b981")
        .attr("font-weight", "bold")
        .text(`Median: ${medianLos}d`);
    }

    // X Axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat((d) => `${d}d`));
    xAxis.select(".domain").attr("stroke", "#334155");
    xAxis.selectAll("line").attr("stroke", "#334155");
    xAxis
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("fill", "#94a3b8");

    // Y Axis
    const yAxis = g.append("g").call(d3.axisLeft(yScale).ticks(5));
    yAxis.select(".domain").attr("stroke", "#334155");
    yAxis.selectAll("line").attr("stroke", "#334155");
    yAxis
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("fill", "#94a3b8");
  }, [values, avgLos, medianLos, height]);

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
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 10}px`,
            }}
          >
            <div className="text-[11px] font-bold text-blue-400">
              Stay Duration: {tooltip.los}
            </div>
            <div className="text-[10px] text-slate-300">
              {tooltip.count.toLocaleString()} admissions ({tooltip.pct})
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-red-500 inline-block" />
            <span>Mean ({avgLos}d)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
            <span>Median ({medianLos}d)</span>
          </span>
        </div>
        <span>Total: {values.length.toLocaleString()} records</span>
      </div>
    </div>
  );
};

