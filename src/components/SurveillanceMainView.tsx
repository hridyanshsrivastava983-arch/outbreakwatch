import React from 'react';
import { RegionNode, OutbreakAlert, CaseReport, AlertStatus, RegionEdge } from '../types/epidemiology';
import { SegmentTree } from '../dsa/SegmentTree';
import { GeospatialSurveillanceMap } from './GeospatialSurveillanceMap';
import { EpidemicCurveChart } from './EpidemicCurveChart';
import { AlertHeapTriage } from './AlertHeapTriage';
import { Activity, ShieldAlert, TrendingUp, Layers } from 'lucide-react';

interface SurveillanceMainViewProps {
  regions: RegionNode[];
  connections: RegionEdge[];
  alerts: OutbreakAlert[];
  cases: CaseReport[];
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  dates: string[];
  segmentTree: SegmentTree;
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
  diseaseFilter: string;
  onDrillDownRegion: (regionId: string) => void;
}

export const SurveillanceMainView: React.FC<SurveillanceMainViewProps> = ({
  regions,
  connections,
  alerts,
  cases,
  selectedRegionId,
  setSelectedRegionId,
  dates,
  onUpdateAlertStatus,
  diseaseFilter,
  onDrillDownRegion,
}) => {
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const selectedAlert = alerts.find((a) => a.regionId === selectedRegion.id);

  // Filter cases if pathogen filter is selected
  const filteredCases = diseaseFilter === 'ALL'
    ? cases
    : cases.filter((c) => c.disease === diseaseFilter);

  // Daily cases for the selected region
  const dailyCases = dates.map((dateStr) => {
    return filteredCases.filter((c) => c.regionId === selectedRegion.id && c.date === dateStr).length;
  });

  // Calculate 7-day moving average overlay
  const movingAverages = dailyCases.map((val, idx) => {
    const start = Math.max(0, idx - 6);
    const windowSlice = dailyCases.slice(start, idx + 1);
    const sum = windowSlice.reduce((a, b) => a + b, 0);
    return Number((sum / windowSlice.length).toFixed(1));
  });

  // Global counts
  const alertCount = alerts.filter((a) => a.severity >= 3).length;
  const watchCount = alerts.filter((a) => a.severity === 2).length;

  return (
    <div className="space-y-4">
      {/* Situational Top Counter Strip with Warm Pastel Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-[10px] tracking-wider uppercase font-bold">MONITORED SECTORS</span>
            <div className="p-1 rounded bg-[#F5F2EB] text-[#57534E]">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1C1917] mt-1 tabular-nums">
            {regions.length}{' '}
            <span className="text-xs font-normal text-[#78716C]">Districts</span>
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">
            Surveillance telemetry grid operational
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FECDD3] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#BE123C]">
            <span className="text-[10px] tracking-wider uppercase font-bold">SURGE ALERTS (Z ≥ 2.5σ)</span>
            <div className="p-1 rounded bg-[#FFE4E6] text-[#BE123C]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#BE123C] mt-1 tabular-nums">
            {alertCount}{' '}
            <span className="text-xs font-normal text-[#BE123C]/80">Critical Hotspots</span>
          </div>
          <div className="text-[10px] text-[#BE123C]/80 mt-0.5">
            Max-Heap root priority escalation
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FDE68A] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#B45309]">
            <span className="text-[10px] tracking-wider uppercase font-bold">ELEVATED WATCH LIST</span>
            <div className="p-1 rounded bg-[#FEF3C7] text-[#B45309]">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#B45309] mt-1 tabular-nums">
            {watchCount}{' '}
            <span className="text-xs font-normal text-[#B45309]/80">Watch Sectors</span>
          </div>
          <div className="text-[10px] text-[#B45309]/80 mt-0.5">
            1.5σ ≤ Z &lt; 2.5σ baseline deviation
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FED7AA] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#C2410C]">
            <span className="text-[10px] tracking-wider uppercase font-bold">INGESTED RECORDS</span>
            <div className="p-1 rounded bg-[#FFEDD5] text-[#C2410C]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#C2410C] mt-1 tabular-nums">
            {filteredCases.length.toLocaleString()}{' '}
            <span className="text-xs font-normal text-[#C2410C]/80">Intakes</span>
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">
            O(1) multi-key inverted index active
          </div>
        </div>
      </div>

      {/* Main Operational Split: 8 Cols Left (Map & Trend), 4 Cols Right (Max-Heap Alert Feed) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Geospatial Map & Epidemic Curve */}
        <div className="xl:col-span-8 space-y-4">
          {/* Geospatial Map */}
          <GeospatialSurveillanceMap
            regions={regions}
            connections={connections}
            alerts={alerts}
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
            onDrillDown={onDrillDownRegion}
            dates={dates}
          />

          {/* Epidemic Curve with 7-Day Moving Average & Hover Probes */}
          <EpidemicCurveChart
            region={selectedRegion}
            alert={selectedAlert}
            dates={dates}
            dailyCases={dailyCases}
            movingAverages={movingAverages}
          />
        </div>

        {/* Right Column (4 cols): Max-Heap Ranked Alert Triage */}
        <div className="xl:col-span-4">
          <AlertHeapTriage
            alerts={alerts}
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
            onUpdateAlertStatus={onUpdateAlertStatus}
            onNavigateSector={onDrillDownRegion}
          />
        </div>
      </div>
    </div>
  );
};
