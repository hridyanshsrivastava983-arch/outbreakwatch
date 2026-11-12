import React from 'react';
import { OutbreakAlert, AlertStatus } from '../types/epidemiology';
import { ShieldAlert, ChevronRight } from 'lucide-react';

interface AlertHeapTriageProps {
  alerts: OutbreakAlert[];
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
  onNavigateSector: (sectorId: string) => void;
}

export const AlertHeapTriage: React.FC<AlertHeapTriageProps> = ({
  alerts,
  selectedRegionId,
  setSelectedRegionId,
  onUpdateAlertStatus,
  onNavigateSector,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E7E1D8] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Triage Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0EBE1]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#FFE4E6] text-[#BE123C]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-[#1C1917] uppercase font-mono tracking-wider">
                Max-Heap Priority Alert Queue
              </h2>
            </div>
            <div className="text-[11px] text-[#78716C] mt-0.5 font-mono">
              Composite threat ranking: Cases + Growth + Density + Z-Score
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#9A3412] border border-[#FED7AA] font-bold">
            O(1) Heap Root
          </span>
        </div>

        {/* Alerts Feed */}
        <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
          {alerts.map((alert, idx) => {
            const isSelected = alert.regionId === selectedRegionId;
            const isCritical = alert.severity >= 3;
            const isInvestigating = alert.status === 'INVESTIGATING';
            const isContained = alert.status === 'CONTAINED';

            let borderTheme = 'border-[#E7E1D8] bg-[#FAF7F2]';
            if (isSelected) borderTheme = 'border-[#C2410C] bg-[#FFF7ED] ring-1 ring-[#C2410C]';
            else if (isCritical) borderTheme = 'border-[#FECDD3] bg-[#FFF5F5] hover:border-[#FDA4AF]';

            return (
              <div
                key={alert.id}
                onClick={() => setSelectedRegionId(alert.regionId)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${borderTheme}`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#A8A29E]">
                      #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        alert.severity >= 4
                          ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]'
                          : alert.severity === 3
                          ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                          : 'bg-[#F5F2EB] text-[#57534E]'
                      }`}
                    >
                      LEVEL {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-[#1C1917] font-sans truncate">
                      {alert.regionName}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#C2410C]">
                    Score {alert.alertPriorityScore}
                  </span>
                </div>

                {/* Clinical Incident Copy */}
                <div className="mt-2 text-xs text-[#292524] leading-relaxed font-sans">
                  <span className="font-semibold text-[#1C1917]">{alert.disease}:</span>{' '}
                  <span className="text-[#BE123C] font-bold">
                    {(alert.currentCount / Math.max(1, alert.baselineCount)).toFixed(1)}x above
                  </span>{' '}
                  7-day baseline (Z = +{alert.zScore}σ).
                </div>

                {/* Protocol recommendation */}
                <div className="mt-1 text-[11px] text-[#78716C] font-mono leading-normal">
                  <strong className="text-[#44403C]">Protocol:</strong> {alert.actionRecommendation}
                </div>

                {/* Status Bar & Action Controls */}
                <div className="mt-2.5 pt-2 border-t border-[#E7E1D8] flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#78716C]">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isContained
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                          : isInvestigating
                          ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                          : 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateAlertStatus(
                          alert.id,
                          isInvestigating ? 'ACTIVE' : 'INVESTIGATING'
                        );
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#57534E] hover:text-[#1C1917] border border-[#E7E1D8] transition-colors"
                    >
                      {isInvestigating ? 'Mark Active' : 'Investigate'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateAlertStatus(
                          alert.id,
                          isContained ? 'ACTIVE' : 'CONTAINED'
                        );
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#86EFAC] transition-colors font-semibold"
                    >
                      {isContained ? 'Reopen' : 'Contain'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateSector(alert.regionId);
                      }}
                      className="p-1 text-[#78716C] hover:text-[#C2410C]"
                      title="Inspect Sector Dossier"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] text-[10px] font-mono text-[#78716C] flex items-center justify-between">
        <span>Heap Root Synchronization: Instant</span>
        <span>Threat Levels 1-5</span>
      </div>
    </div>
  );
};
