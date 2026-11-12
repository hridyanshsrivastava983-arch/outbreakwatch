import React, { useState } from 'react';
import { OutbreakAlert, AlertStatus } from '../types/epidemiology';

interface AlertsViewProps {
  alerts: OutbreakAlert[];
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onUpdateAlertStatus,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Sorted by Alert Priority Score (Max-Heap order)
  const filteredAlerts = alerts
    .filter((a) => {
      if (filterSeverity > 0 && a.severity < filterSeverity) return false;
      if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => b.alertPriorityScore - a.alertPriorityScore);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <span>Operational Emergency Triage</span>
          <span>·</span>
          <span>Priority Queue Decision Console</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Prioritised Health Authority Outbreak Alerts
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Alerts extracted from the <strong>Max-Heap root</strong> ordered strictly by composite urgency
          (Case Surge + Growth Rate + Population Density + Z-Score). Public health officials can dispatch teams and coordinate containment.
        </p>
      </div>

      {/* Filter and Triage Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <label className="font-mono text-slate-500 mr-2">Minimum Severity:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
            >
              <option value={0}>All Severities (1-5)</option>
              <option value={2}>Severity ≥ 2</option>
              <option value={3}>Severity ≥ 3 (Urgent)</option>
              <option value={4}>Severity ≥ 4 (Critical)</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-slate-500 mr-2">Triage Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="CONTAINED">CONTAINED</option>
            </select>
          </div>
        </div>

        <div className="font-mono text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredAlerts.length}</span> prioritized alerts
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          let severityColor = 'border-slate-200 bg-white';
          let badgeColor = 'bg-slate-100 text-slate-700';

          if (alert.severity >= 4) {
            severityColor = 'border-rose-300 bg-rose-50/20 shadow-xs';
            badgeColor = 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
          } else if (alert.severity === 3) {
            severityColor = 'border-amber-300 bg-amber-50/20';
            badgeColor = 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold';
          }

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-lg border ${severityColor} transition-all`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Heap Root #{index + 1}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-mono ${badgeColor}`}>
                    Severity Level {alert.severity} / 5
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    {alert.regionName}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    ({alert.disease})
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs font-mono text-slate-500">Status:</span>
                  <select
                    value={alert.status}
                    onChange={(e) =>
                      onUpdateAlertStatus(alert.id, e.target.value as AlertStatus)
                    }
                    className={`text-xs font-mono font-semibold px-2 py-1 rounded border ${
                      alert.status === 'ACTIVE'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : alert.status === 'INVESTIGATING'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="CONTAINED">CONTAINED</option>
                  </select>
                </div>
              </div>

              {/* Quantitative Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-3 text-xs font-mono">
                <div>
                  <div className="text-[10px] uppercase text-slate-400">
                    Priority Score
                  </div>
                  <div className="text-sm font-bold text-blue-700 mt-0.5">
                    {alert.alertPriorityScore} / 100
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-slate-400">
                    Z-Score Anomaly
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {alert.zScore} σ
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-slate-400">
                    Growth Rate
                  </div>
                  <div className="text-sm font-bold text-rose-600 mt-0.5">
                    +{alert.growthRatePct}% (3d)
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-slate-400">
                    Current vs Baseline
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {alert.currentCount} / {alert.baselineCount} day
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-slate-400">
                    Threshold Breach
                  </div>
                  <div className="text-sm font-bold text-amber-700 mt-0.5">
                    {alert.daysUntilThresholdBreach === 0
                      ? 'BREACHED'
                      : `in ${alert.daysUntilThresholdBreach} days`}
                  </div>
                </div>
              </div>

              {/* Action recommendation */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-900">Action Protocol:</span>{' '}
                  {alert.actionRecommendation}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onUpdateAlertStatus(alert.id, 'INVESTIGATING')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
                  >
                    Dispatch Team
                  </button>
                  <button
                    onClick={() => onUpdateAlertStatus(alert.id, 'CONTAINED')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-medium border border-emerald-200"
                  >
                    Mark Contained
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-xs">
            No active alerts matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};
