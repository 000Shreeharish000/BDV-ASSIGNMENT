"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { QrCode as QrIcon, Download, ExternalLink, Check, Copy } from "lucide-react";

export const QrGenerator: React.FC = () => {
  const [url, setUrl] = useState<string>("https://bdv-assignment.vercel.app");
  const [qrPngUrl, setQrPngUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!url.trim()) return;

    // Generate high-resolution PNG via canvas
    QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((dataUrl) => {
        setQrPngUrl(dataUrl);
      })
      .catch((err) => {
        console.error("QR Code PNG generation error:", err);
      });

    // Generate high-resolution SVG string
    QRCode.toString(url, {
      type: "svg",
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((svg) => {
        setQrSvgString(svg);
      })
      .catch((err) => {
        console.error("QR Code SVG generation error:", err);
      });
  }, [url]);

  const downloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement("a");
    a.href = qrPngUrl;
    a.download = `Hospital_Analytics_Submission_QR_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `Hospital_Analytics_Submission_QR_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center space-x-2.5 mb-3 border-b border-slate-800 pb-3">
        <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <QrIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Submission QR Code Generator Utility
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Produces high-resolution scan codes for SRM CLA-2 faculty evaluation
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Deployed Vercel Application URL (Paste your final production URL):
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.vercel.app"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={copyUrl}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center space-x-1 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-xs flex items-center space-x-1 transition-colors"
              title="Open link in new tab to verify"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Link</span>
            </a>
          </div>
        </div>

        {/* QR Code Preview Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded border border-slate-800/80">
          <div className="bg-white p-3 rounded shadow-md shrink-0 border border-slate-300">
            {qrPngUrl ? (
              <img
                src={qrPngUrl}
                alt="Submission QR Code"
                className="w-40 h-40 object-contain"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center text-xs text-slate-400 font-mono">
                Generating QR...
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-slate-300">
              <span className="font-semibold text-white">Verification Status:</span> High-Contrast 1024×1024 px (Level H Error Correction).
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Scan this QR code with any smartphone camera or mobile barcode reader to launch the live deployed hospital analytics portal directly.
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={downloadPng}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center space-x-1.5 transition-colors text-xs shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG (1024px)</span>
              </button>
              <button
                onClick={downloadSvg}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium flex items-center space-x-1.5 transition-colors text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG (Vector)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
