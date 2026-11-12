import React, { useState } from 'react';
import { RegionNode, RegionEdge, OutbreakAlert } from '../types/epidemiology';
import { Crosshair, ArrowRight, Hospital, Users, Layers, ShieldAlert, Sparkles } from 'lucide-react';

interface GeospatialSurveillanceMapProps {
  regions: RegionNode[];
  connections: RegionEdge[];
  alerts: OutbreakAlert[];
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  onDrillDown: (regionId: string) => void;
  dates: string[];
}

export const GeospatialSurveillanceMap: React.FC<GeospatialSurveillanceMapProps> = ({
  regions,
  connections,
  alerts,
  selectedRegionId,
  setSelectedRegionId,
  onDrillDown,
}) => {
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showRadarPulses, setShowRadarPulses] = useState<boolean>(true);
  const [showHeatAuras, setShowHeatAuras] = useState<boolean>(true);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const selectedAlert = alerts.find((a) => a.regionId === selectedRegion.id);

  // SVG Geometry
  const mapWidth = 660;
  const mapHeight = 460;

  return (
    <div className="bg-[#FFFFFF] border border-[#E7E1D8] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs relative overflow-hidden">
      {/* Map Control Bar & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-[#F0EBE1] text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#FFEDD5] text-[#C2410C]">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#1C1917] font-sans text-sm tracking-tight block">
              Geospatial Epidemic Vector Atlas
            </span>
            <span className="text-[10px] text-[#78716C]">
              12 Surveillance Sectors · Commuter Transit Flow Overlay · WGS84
            </span>
          </div>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`px-2.5 py-1 rounded-md border transition-all ${
              showCorridors
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] font-bold shadow-xs'
                : 'bg-[#FAF7F2] text-[#78716C] border-[#E7E1D8]'
            }`}
          >
            Transit Corridors
          </button>
          <button
            onClick={() => setShowRadarPulses(!showRadarPulses)}
            className={`px-2.5 py-1 rounded-md border transition-all ${
              showRadarPulses
                ? 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3] font-bold shadow-xs'
                : 'bg-[#FAF7F2] text-[#78716C] border-[#E7E1D8]'
            }`}
          >
            Surge Pulses
          </button>
          <button
            onClick={() => setShowHeatAuras(!showHeatAuras)}
            className={`px-2.5 py-1 rounded-md border transition-all ${
              showHeatAuras
                ? 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA] font-bold shadow-xs'
                : 'bg-[#FAF7F2] text-[#78716C] border-[#E7E1D8]'
            }`}
          >
            Risk Heatmap
          </button>
        </div>
      </div>

      {/* Main Warm Atlas Map Canvas */}
      <div className="relative bg-[#FAF7F2] rounded-lg border border-[#E7E1D8] overflow-hidden shadow-inner">
        {/* Coordinate Overlay Watermark */}
        <div className="absolute top-2.5 left-3 text-[10px] font-mono text-[#A8A29E] pointer-events-none z-10 flex items-center gap-2">
          <span>LAT 28.6139° N</span>
          <span>·</span>
          <span>LNG 77.2090° E</span>
          <span>·</span>
          <span>ELEVATION: 216m</span>
        </div>
        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#A8A29E] pointer-events-none z-10">
          EPIDEMIOLOGICAL SURVEILLANCE ATLAS · SECTOR GRID
        </div>

        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-80 sm:h-96 select-none"
        >
          <defs>
            {/* Warm Cartographic Grid */}
            <pattern id="warm-atlas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#EBE4D8" strokeWidth="0.8" />
              <circle cx="15" cy="15" r="0.75" fill="#D6CEBE" />
            </pattern>

            {/* Radial glow for critical outbreak nodes */}
            <radialGradient id="rose-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="amber-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="normal-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#15803D" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#warm-atlas-grid)" />

          {/* Outer Border Frame */}
          <rect
            x="12"
            y="12"
            width={mapWidth - 24}
            height={mapHeight - 24}
            fill="none"
            stroke="#D6CEBE"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Commuter Transit Corridors (Edges) */}
          {showCorridors &&
            connections.map((edge) => {
              const nodeA = regions.find((r) => r.id === edge.from);
              const nodeB = regions.find((r) => r.id === edge.to);
              if (!nodeA || !nodeB) return null;

              const isLinkedToSelected =
                nodeA.id === selectedRegionId || nodeB.id === selectedRegionId;

              const strokeColor = isLinkedToSelected
                ? '#C2410C'
                : edge.dailyTravelVolume > 80000
                ? '#D97706'
                : '#D6CEBE';

              const strokeWidth = isLinkedToSelected ? 2.5 : edge.dailyTravelVolume > 80000 ? 1.75 : 1.2;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={nodeA.coordinates.x}
                    y1={nodeA.coordinates.y}
                    x2={nodeB.coordinates.x}
                    y2={nodeB.coordinates.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isLinkedToSelected ? undefined : '3 3'}
                  />
                  {/* Commuter Flow Midpoint Badge */}
                  {edge.dailyTravelVolume > 65000 && (
                    <text
                      x={(nodeA.coordinates.x + nodeB.coordinates.x) / 2}
                      y={(nodeA.coordinates.y + nodeB.coordinates.y) / 2 - 3}
                      fill="#78716C"
                      className="text-[8px] font-mono"
                      textAnchor="middle"
                    >
                      {(edge.dailyTravelVolume / 1000).toFixed(0)}k/d
                    </text>
                  )}
                </g>
              );
            })}

          {/* Sector Nodes & Heat Auras */}
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            const alert = alerts.find((a) => a.regionId === reg.id);
            const severity = alert?.severity || 1;
            const isCritical = severity >= 3;
            const isWatch = severity === 2;

            let fillBase = '#57534E';
            let strokeColor = '#A8A29E';
            let auraGradient = 'url(#normal-aura)';

            if (isCritical) {
              fillBase = '#E11D48';
              strokeColor = '#BE123C';
              auraGradient = 'url(#rose-aura)';
            } else if (isWatch) {
              fillBase = '#D97706';
              strokeColor = '#B45309';
              auraGradient = 'url(#amber-aura)';
            }

            return (
              <g
                key={reg.id}
                className="cursor-pointer group"
                onClick={() => setSelectedRegionId(reg.id)}
              >
                {/* Heat Aura */}
                {showHeatAuras && (
                  <circle
                    cx={reg.coordinates.x}
                    cy={reg.coordinates.y}
                    r={isCritical ? '42' : isWatch ? '32' : '22'}
                    fill={auraGradient}
                  />
                )}

                {/* Radar Pulse Waves for Outbreak Epicenters */}
                {showRadarPulses && isCritical && (
                  <>
                    <circle
                      cx={reg.coordinates.x}
                      cy={reg.coordinates.y}
                      r="26"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="1.5"
                      className="animate-ping origin-center opacity-60"
                    />
                    <circle
                      cx={reg.coordinates.x}
                      cy={reg.coordinates.y}
                      r="34"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  </>
                )}

                {/* Selected Indicator Reticle */}
                {isSelected && (
                  <circle
                    cx={reg.coordinates.x}
                    cy={reg.coordinates.y}
                    r="22"
                    fill="none"
                    stroke="#C2410C"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Core Node Circle */}
                <circle
                  cx={reg.coordinates.x}
                  cy={reg.coordinates.y}
                  r="14"
                  fill={fillBase}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-sm transition-transform group-hover:scale-110"
                />

                {/* Sector Code Monospace Label */}
                <text
                  x={reg.coordinates.x}
                  y={reg.coordinates.y + 4}
                  fill="#FFFFFF"
                  textAnchor="middle"
                  className="text-[9px] font-mono font-bold pointer-events-none"
                >
                  {reg.code.replace('SEC-', 'S')}
                </text>

                {/* Sector Name Below Node */}
                <text
                  x={reg.coordinates.x}
                  y={reg.coordinates.y + 26}
                  fill={isSelected ? '#9A3412' : '#292524'}
                  textAnchor="middle"
                  className="text-[10px] font-bold font-sans pointer-events-none"
                >
                  {reg.name.split(' — ')[1] || reg.name}
                </text>

                {/* Critical Surge Indicator Badge */}
                {isCritical && (
                  <text
                    x={reg.coordinates.x}
                    y={reg.coordinates.y - 20}
                    fill="#BE123C"
                    textAnchor="middle"
                    className="text-[9px] font-mono font-bold pointer-events-none"
                  >
                    ● SURGE (+{alert?.zScore}σ)
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Interactive Sector Inspector HUD */}
      <div className="mt-3.5 p-3.5 bg-[#FAF7F2] border border-[#E7E1D8] rounded-lg text-xs font-mono grid grid-cols-1 md:grid-cols-12 gap-3 items-center shadow-xs">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFEDD5] text-[#9A3412]">
              {selectedRegion.code}
            </span>
            <span className="text-sm font-bold text-[#1C1917] font-sans truncate">
              {selectedRegion.name}
            </span>
          </div>
          <div className="text-[11px] text-[#78716C] mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span>{(selectedRegion.population / 1000).toFixed(0)}k Citizens</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Hospital className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span>{selectedRegion.hospitalBeds} Beds</span>
            </span>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center border-y md:border-y-0 md:border-x border-[#E7E1D8] py-2 md:py-0 px-2">
          <div>
            <div className="text-[9px] text-[#78716C]">Z-SCORE VARIANCE</div>
            <div className={`text-sm font-bold tabular-nums ${
              selectedAlert && selectedAlert.zScore >= 2.5
                ? 'text-[#BE123C]'
                : selectedAlert && selectedAlert.zScore >= 1.5
                ? 'text-[#B45309]'
                : 'text-[#15803D]'
            }`}>
              {selectedAlert ? selectedAlert.zScore : '0.4'} σ
            </div>
          </div>
          <div>
            <div className="text-[9px] text-[#78716C]">DAILY RUN RATE</div>
            <div className="text-sm font-bold text-[#1C1917] tabular-nums">
              {selectedAlert?.currentCount ?? selectedRegion.baselineDailyCases}/day
            </div>
          </div>
          <div>
            <div className="text-[9px] text-[#78716C]">BREACH FORECAST</div>
            <div className="text-sm font-bold text-[#B45309] tabular-nums">
              {selectedAlert?.daysUntilThresholdBreach === 0
                ? 'BREACHED'
                : `${selectedAlert?.daysUntilThresholdBreach ?? 14}d`}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={() => onDrillDown(selectedRegion.id)}
            className="w-full md:w-auto px-4 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
          >
            <span>Inspect Sector Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
