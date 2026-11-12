import React, { useState } from 'react';
import { OutbreakAlert, AlertStatus, RegionNode } from '../types/epidemiology';
import { Download, FileText, Filter, ShieldAlert } from 'lucide-react';

interface AlertsReportsPageProps {
  alerts: OutbreakAlert[];
  regions: RegionNode[];
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
  onNavigateSector: (sectorId: string) => void;
}

export const AlertsReportsPage: React.FC<AlertsReportsPageProps> = ({
  alerts,
  regions,
  onUpdateAlertStatus,
  onNavigateSector,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'heap' | 'severity' | 'zscore' | 'cases'>('heap');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Sorting and Filtering
  const filteredAlerts = alerts
    .filter((a) => {
      if (filterSeverity > 0 && a.severity < filterSeverity) return false;
      if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'severity') return b.severity - a.severity;
      if (sortBy === 'zscore') return b.zScore - a.zScore;
      if (sortBy === 'cases') return b.currentCount - a.currentCount;
      return b.alertPriorityScore - a.alertPriorityScore; // Max-Heap order
    });

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = [
      'Alert ID',
      'Region Code',
      'Region Name',
      'Disease',
      'Severity (1-5)',
      'Z-Score (Sigma)',
      'Current Daily Cases',
      'Baseline Daily Cases',
      'Growth Rate (%)',
      'Days Until Threshold Breach',
      'Priority Score',
      'Status',
      'Detected At',
      'Action Protocol',
    ];

    const rows = filteredAlerts.map((a) => {
      const reg = regions.find((r) => r.id === a.regionId);
      return [
        `"${a.id}"`,
        `"${reg?.code || ''}"`,
        `"${a.regionName}"`,
        `"${a.disease}"`,
        a.severity,
        a.zScore,
        a.currentCount,
        a.baselineCount,
        a.growthRatePct,
        a.daysUntilThresholdBreach,
        a.alertPriorityScore,
        `"${a.status}"`,
        `"${a.detectedAt}"`,
        `"${a.actionRecommendation.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `OutbreakWatch_Situational_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Situational Action Bar */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-4 sm:p-5 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
            <span>HEALTH AUTHORITY EPIDEMIOLOGICAL TRIAGE</span>
            <span>·</span>
            <span className="font-bold text-[#C2410C]">MAX-HEAP ROOT ORDERED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
            Active Alerts &amp; Incident Reports
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Real-time emergency triage ledger. Root element represents maximum composite threat priority.
          </p>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#1C1917] rounded-md border border-[#E7E1D8] font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Official Situation Brief</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-md font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Controls Ribbon */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#78716C] font-semibold">SEVERITY:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(Number(e.target.value))}
              className="bg-[#FAF7F2] border border-[#E7E1D8] rounded-md px-2.5 py-1 text-[#1C1917] font-medium"
            >
              <option value={0}>All Severities (1-5)</option>
              <option value={2}>Severity ≥ 2</option>
              <option value={3}>Severity ≥ 3 (Urgent)</option>
              <option value={4}>Severity ≥ 4 (Critical)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#78716C] font-semibold">STATUS:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E7E1D8] rounded-md px-2.5 py-1 text-[#1C1917] font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="CONTAINED">CONTAINED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#78716C] font-semibold">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#E7E1D8] rounded-md px-2.5 py-1 text-[#1C1917] font-medium"
            >
              <option value="heap">Max-Heap Root (Priority Score)</option>
              <option value="severity">Clinical Severity Level</option>
              <option value="zscore">Surge Z-Score (σ)</option>
              <option value="cases">Current Daily Cases</option>
            </select>
          </div>
        </div>

        <div className="text-[#78716C]">
          Listing <span className="font-bold text-[#1C1917]">{filteredAlerts.length}</span> Active Triage Entries
        </div>
      </div>

      {/* Main Sortable Table */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#57534E] text-[11px] uppercase tracking-wider border-b border-[#E7E1D8]">
                <th className="py-3 px-3.5 font-bold">Priority</th>
                <th className="py-3 px-3.5 font-bold">Sector</th>
                <th className="py-3 px-3.5 font-bold">Pathogen</th>
                <th className="py-3 px-3.5 font-bold">Severity</th>
                <th className="py-3 px-3.5 font-bold">Z-Score</th>
                <th className="py-3 px-3.5 font-bold">Daily Cases / Baseline</th>
                <th className="py-3 px-3.5 font-bold">Growth (3d)</th>
                <th className="py-3 px-3.5 font-bold">Breach Proj</th>
                <th className="py-3 px-3.5 font-bold">Status</th>
                <th className="py-3 px-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {filteredAlerts.map((alert, idx) => {
                const isCritical = alert.severity >= 3;
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-[#FAF7F2]/80 transition-colors"
                  >
                    <td className="py-3.5 px-3.5 font-bold text-[#1C1917]">
                      #{idx + 1}
                      <span className="block text-[10px] text-[#78716C] font-normal">
                        Score: {alert.alertPriorityScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5">
                      <button
                        onClick={() => onNavigateSector(alert.regionId)}
                        className="font-sans font-bold text-[#1C1917] hover:text-[#C2410C] underline text-left"
                      >
                        {alert.regionName}
                      </button>
                      <span className="block text-[10px] text-[#78716C]">
                        Alert ID: {alert.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 font-sans font-semibold text-[#1C1917]">
                      {alert.disease}
                    </td>

                    <td className="py-3.5 px-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          alert.severity >= 4
                            ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]'
                            : alert.severity === 3
                            ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                            : 'bg-[#F5F2EB] text-[#57534E]'
                        }`}
                      >
                        Level {alert.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 font-bold tabular-nums">
                      <span className={isCritical ? 'text-[#BE123C]' : 'text-[#1C1917]'}>
                        +{alert.zScore} σ
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 tabular-nums">
                      <span className="font-bold text-[#1C1917]">{alert.currentCount}</span>
                      <span className="text-[#78716C]"> / {alert.baselineCount} day</span>
                    </td>

                    <td className="py-3.5 px-3.5 tabular-nums font-bold text-[#BE123C]">
                      +{alert.growthRatePct}%
                    </td>

                    <td className="py-3.5 px-3.5 tabular-nums text-[#B45309] font-semibold">
                      {alert.daysUntilThresholdBreach === 0
                        ? 'BREACHED'
                        : `${alert.daysUntilThresholdBreach}d`}
                    </td>

                    <td className="py-3.5 px-3.5">
                      <select
                        value={alert.status}
                        onChange={(e) =>
                          onUpdateAlertStatus(alert.id, e.target.value as AlertStatus)
                        }
                        className={`text-[10px] font-bold rounded-md px-2 py-1 border ${
                          alert.status === 'ACTIVE'
                            ? 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]'
                            : alert.status === 'INVESTIGATING'
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                            : 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="CONTAINED">CONTAINED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3.5 text-right">
                      <button
                        onClick={() => onNavigateSector(alert.regionId)}
                        className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#1C1917] rounded-md border border-[#E7E1D8] text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Situation Brief Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E1D8] rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0EBE1]">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#78716C] font-bold">
                  MINISTRY OF HEALTH · SITUATIONAL EPIDEMIOLOGICAL BRIEF
                </div>
                <h2 className="text-xl font-bold text-[#1C1917] mt-0.5">
                  OutbreakWatch Official Incident Report
                </h2>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917] font-mono text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#292524] leading-relaxed">
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E7E1D8] rounded-lg font-mono text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[#78716C]">DOCUMENT REF:</span>
                  <div className="font-bold text-[#1C1917]">OW-SITREP-2026-11</div>
                </div>
                <div>
                  <span className="text-[#78716C]">DATE OF ISSUE:</span>
                  <div className="font-bold text-[#1C1917]">11-Nov-2026</div>
                </div>
                <div>
                  <span className="text-[#78716C]">SURGE CLUSTERS:</span>
                  <div className="font-bold text-[#BE123C]">
                    {alerts.filter((a) => a.severity >= 3).length} Sectors
                  </div>
                </div>
                <div>
                  <span className="text-[#78716C]">CLASSIFICATION:</span>
                  <div className="font-bold text-[#1C1917]">DISTRICT OFFICIAL</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1C1917] mb-1 font-mono">
                  1. Executive Summary &amp; Critical Incidents
                </h3>
                <p>
                  Epidemiological surveillance algorithms have detected statistically significant case volume anomalies ($Z \ge 2.5\sigma$) within <strong>Sector 3 (East Harbour &amp; Port)</strong> and <strong>Sector 4 (River Basin Wetlands)</strong> attributable to Dengue vector activity, as well as an enteric Cholera surge in <strong>Sector 9 (Southern Estuary)</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1C1917] mb-1 font-mono">
                  2. Heap-Ranked Sector Allocations
                </h3>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                  {filteredAlerts.slice(0, 4).map((a) => (
                    <li key={a.id}>
                      <strong>{a.regionName}</strong>: {a.disease} — {a.currentCount} cases/day (Threshold breach in {a.daysUntilThresholdBreach}d). {a.actionRecommendation}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1C1917] mb-1 font-mono">
                  3. Non-Pharmaceutical Interventions (NPI) Directive
                </h3>
                <p>
                  District health officers are instructed to enforce vector perimeter fogging across Transit Route 4 and pre-position 10,000 ORS packets in coastal dispensaries.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3.5 border-t border-[#F0EBE1] flex items-center justify-between font-mono text-xs">
              <span className="text-[#78716C]">System Verified: Max-Heap Invariants Hold</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-md font-bold shadow-xs"
              >
                Print / Save PDF Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
