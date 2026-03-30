// components/ExportPanel.jsx
// Purpose: Pro feature — PDF export and CSV download of simulation results.
//   PDF: captures the results panel via html2canvas + jsPDF.
//   CSV: serializes trajectories + metadata as a downloadable .csv file.
// Key exports: default ExportPanel
// Props:
//   results       — simulation results object
//   inputs        — simulation inputs used for last run
//   resultsRef    — React ref pointing to the DOM node to capture for PDF

import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters.js';

// ---------------------------------------------------------------------------
// buildCSV — converts trajectories + metadata to CSV string
// ---------------------------------------------------------------------------
function buildCSV(results, inputs) {
  const { trajectories, successRate, medianFinalValue, worstP10FinalValue, simCount } = results;

  const lines = [];

  // Metadata header block
  lines.push('# FIRE Retirement Simulator — Export');
  lines.push(`# Generated,${new Date().toLocaleDateString()}`);
  lines.push(`# Portfolio Value,$${(inputs?.portfolioValue ?? 0).toLocaleString()}`);
  lines.push(`# Annual Spending,$${(inputs?.annualSpending ?? 0).toLocaleString()}`);
  lines.push(`# Stock Allocation,${Math.round((inputs?.stockAllocation ?? 0.8) * 100)}%`);
  lines.push(`# Retirement Years,${inputs?.retirementYears ?? 30}`);
  lines.push(`# Simulations Run,${simCount.toLocaleString()}`);
  lines.push(`# Success Rate,${(successRate * 100).toFixed(1)}%`);
  lines.push(`# Median Final Value,$${medianFinalValue > 0 ? medianFinalValue.toFixed(0) : '0'}`);
  lines.push(`# 10th Percentile Final,$${worstP10FinalValue > 0 ? worstP10FinalValue.toFixed(0) : '0'}`);
  lines.push('');

  // Trajectory data
  lines.push('Year,P10,P25,P50 (Median),P75,P90');
  for (const row of trajectories) {
    lines.push([
      row.year,
      row.p10.toFixed(0),
      row.p25.toFixed(0),
      row.p50.toFixed(0),
      row.p75.toFixed(0),
      row.p90.toFixed(0),
    ].join(','));
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// downloadCSV — triggers a browser download
// ---------------------------------------------------------------------------
function downloadCSV(results, inputs) {
  const csv = buildCSV(results, inputs);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fire-simulation-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// exportPDF — html2canvas capture → jsPDF
// ---------------------------------------------------------------------------
async function exportPDF(resultsRef, inputs, successRate) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const element = resultsRef?.current;
  if (!element) throw new Error('Results panel not found');

  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0a',
    scale: 2, // retina quality
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Title block
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRE Retirement Simulation', margin, 20);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generated ${new Date().toLocaleDateString()} · promptinglogic.com`, margin, 27);

  // Key stats row
  const stats = [
    ['Success Rate', `${(successRate * 100).toFixed(1)}%`],
    ['Portfolio', formatCurrency(inputs?.portfolioValue)],
    ['Annual Spend', formatCurrency(inputs?.annualSpending)],
    ['Allocation', `${Math.round((inputs?.stockAllocation ?? 0.8) * 100)}% stocks`],
  ];

  let x = margin;
  const statY = 36;
  const statW = contentWidth / stats.length;

  for (const [label, value] of stats) {
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(label.toUpperCase(), x, statY);
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, x, statY + 5.5);
    pdf.setFont('helvetica', 'normal');
    x += statW;
  }

  // Divider
  pdf.setDrawColor(40, 40, 40);
  pdf.line(margin, 47, pageWidth - margin, 47);

  // Results screenshot
  const imgY = 51;
  const imgMaxH = pageHeight - imgY - margin;
  const imgAspect = canvas.width / canvas.height;
  let imgW = contentWidth;
  let imgH = imgW / imgAspect;

  if (imgH > imgMaxH) {
    imgH = imgMaxH;
    imgW = imgH * imgAspect;
  }

  pdf.addImage(imgData, 'PNG', margin, imgY, imgW, imgH);

  // Footer
  pdf.setFontSize(7);
  pdf.setTextColor(70, 70, 70);
  pdf.text(
    'Monte Carlo projections are for educational purposes only and do not constitute financial advice.',
    pageWidth / 2, pageHeight - 8,
    { align: 'center' }
  );

  pdf.save(`fire-simulation-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ---------------------------------------------------------------------------
// ExportPanel — main component
// ---------------------------------------------------------------------------
export default function ExportPanel({ results, inputs, resultsRef }) {
  const [pdfStatus, setPdfStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [csvStatus, setCsvStatus] = useState('idle');

  const handleCSV = () => {
    if (!results) return;
    try {
      downloadCSV(results, inputs);
      setCsvStatus('done');
      setTimeout(() => setCsvStatus('idle'), 2000);
    } catch {
      setCsvStatus('error');
      setTimeout(() => setCsvStatus('idle'), 3000);
    }
  };

  const handlePDF = async () => {
    if (!results) return;
    setPdfStatus('loading');
    try {
      await exportPDF(resultsRef, inputs, results.successRate);
      setPdfStatus('done');
      setTimeout(() => setPdfStatus('idle'), 2000);
    } catch {
      setPdfStatus('error');
      setTimeout(() => setPdfStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Export Results</h3>
        <span className="text-2xs text-amber-400 border border-amber-400/30 bg-amber-400/5 px-1.5 py-0.5 rounded">Pro</span>
      </div>

      <p className="text-xs text-gray-500">
        Download your simulation for sharing or record-keeping.
      </p>

      <div className="flex gap-2">
        {/* CSV button */}
        <button
          type="button"
          onClick={handleCSV}
          disabled={!results || csvStatus === 'loading'}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
            csvStatus === 'done'
              ? 'border-green-400/40 bg-green-400/10 text-green-400'
              : csvStatus === 'error'
                ? 'border-red-400/40 bg-red-400/10 text-red-400'
                : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-300 hover:border-gray-500 hover:text-white'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {/* Spreadsheet icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
          </svg>
          <span>
            {csvStatus === 'done' ? 'Downloaded ✓' : csvStatus === 'error' ? 'Error' : 'CSV'}
          </span>
        </button>

        {/* PDF button */}
        <button
          type="button"
          onClick={handlePDF}
          disabled={!results || pdfStatus === 'loading'}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
            pdfStatus === 'loading'
              ? 'border-amber-400/40 bg-amber-400/10 text-amber-400/60 cursor-wait'
              : pdfStatus === 'done'
                ? 'border-green-400/40 bg-green-400/10 text-green-400'
                : pdfStatus === 'error'
                  ? 'border-red-400/40 bg-red-400/10 text-red-400'
                  : 'border-amber-400/30 bg-amber-400/5 text-amber-400 hover:bg-amber-400/10'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {pdfStatus === 'loading' ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Generating…</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>
                {pdfStatus === 'done' ? 'Saved ✓' : pdfStatus === 'error' ? 'Error' : 'PDF'}
              </span>
            </>
          )}
        </button>
      </div>

      <p className="text-2xs text-gray-700">
        CSV includes all percentile trajectories · PDF captures the full results panel
      </p>
    </div>
  );
}
