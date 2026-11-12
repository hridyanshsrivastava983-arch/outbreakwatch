import React, { useState } from 'react';
import { RegionNode, OutbreakAlert } from '../types/epidemiology';
import { Activity } from 'lucide-react';

interface EpidemicCurveChartProps {
  region: RegionNode;
  alert?: OutbreakAlert;
  dates: string[];
  dailyCases: number[];
  movingAverages: number[];
}

export const EpidemicCurveChart: React.FC<EpidemicCurveChartProps> = ({
  region,
  alert,
  dates,
  dailyCases,
  movingAverages,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [windowRange, setWindowRange] = useState<number>(35);

  const activeDates = dates.slice(-windowRange);
  const activeCases = dailyCases.slice(-windowRange);
  const activeMA = movingAverages.slice(-windowRange);

  const chartHeight = 180;
  const chartWidth = 620;
  const maxVal = Math.max(25, ...activeCases, ...activeMA) * 1.15;

  const activeHoverIdx = hoverIdx !== null && hoverIdx < activeDates.length ? hoverIdx : activeDates.length - 1;
  const hoveredDate = activeDates[activeHoverIdx];
  const hoveredCount = activeCases[activeHoverIdx];
  const hoveredMA = activeMA[activeHoverIdx];
  const deltaFromBaseline = hoveredCount - region.baselineDailyCases;

  return (
    <div className="bg-[#FFFFFF] border border-[#E7E1D8] rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#F0EBE1]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#FEF3C7] text-[#D97706]">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#1C1917] uppercase font-mono tracking-wider">
              Longitudinal Epidemic Curve · {region.name}
            </h2>
          </div>
          <div className="text-[11px] text-[#78716C] mt-0.5 font-mono">
            Daily Admissions vs. 7-Day Rolling Baseline (Historical Baseline: {region.baselineDailyCases} cases/day)
          </div>
        </div>

        {/* Legend and Window Controls */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#C2410C] inline-block" />
              <span className="text-[#292524] font-medium">Daily Intake</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#D97706] border-t border-dashed border-[#D97706] inline-block" />
              <span className="text-[#292524] font-medium">7-Day MA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] inline-block" />
              <span className="text-[#292524] font-medium">Surge Z ≥ 2.5σ</span>
            </span>
          </div>

          <div className="flex items-center bg-[#FAF7F2] rounded-md p-0.5 border border-[#E7E1D8] text-[10px]">
            {[14, 21, 35].map((w) => (
              <button
                key={w}
                onClick={() => {
                  setWindowRange(w);
                  setHoverIdx(null);
                }}
                className={`px-2.5 py-0.5 rounded font-mono transition-all ${
                  windowRange === w
                    ? 'bg-[#FFEDD5] text-[#9A3412] font-bold shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {w}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas with Interactive Crosshair */}
      <div className="relative overflow-x-auto select-none bg-[#FAF7F2] rounded-lg p-2 border border-[#E7E1D8]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 font-mono text-[9px]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const stepWidth = (chartWidth - 50) / (activeDates.length - 1);
            const rawIdx = Math.round((relX - 35) / stepWidth);
            const clamped = Math.max(0, Math.min(activeDates.length - 1, rawIdx));
            setHoverIdx(clamped);
          }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="warm-curve-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid reference guide lines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
            const y = chartHeight - 20 - (chartHeight - 35) * ratio;
            const labelVal = Math.round(maxVal * ratio);
            return (
              <g key={ratio}>
                <line
                  x1="30"
                  y1={y}
                  x2={chartWidth - 5}
                  y2={y}
                  stroke="#E8DEC8"
                  strokeDasharray="2 3"
                />
                <text x="5" y={y + 3} fill="#78716C">
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Baseline reference line */}
          <line
            x1="30"
            y1={chartHeight - 20 - (region.baselineDailyCases / maxVal) * (chartHeight - 35)}
            x2={chartWidth - 5}
            y2={chartHeight - 20 - (region.baselineDailyCases / maxVal) * (chartHeight - 35)}
            stroke="#A8A29E"
            strokeDasharray="4 2"
            strokeWidth="1.2"
          />
          <text
            x={chartWidth - 90}
            y={chartHeight - 24 - (region.baselineDailyCases / maxVal) * (chartHeight - 35)}
            fill="#78716C"
            className="text-[8px]"
          >
            Baseline: {region.baselineDailyCases}/d
          </text>

          {/* X-axis baseline */}
          <line
            x1="30"
            y1={chartHeight - 20}
            x2={chartWidth - 5}
            y2={chartHeight - 20}
            stroke="#D6CEBE"
            strokeWidth="1"
          />

          {/* Shaded Area under daily cases */}
          <path
            d={`${activeCases
              .map((val, idx) => {
                const x = 35 + (idx * (chartWidth - 50)) / (activeDates.length - 1);
                const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')} L ${chartWidth - 15} ${chartHeight - 20} L 35 ${chartHeight - 20} Z`}
            fill="url(#warm-curve-gradient)"
          />

          {/* 7-Day Moving Average Line (Amber) */}
          <path
            d={activeMA
              .map((val, idx) => {
                const x = 35 + (idx * (chartWidth - 50)) / (activeDates.length - 1);
                const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#D97706"
            strokeWidth="2.2"
            strokeDasharray="3 2"
          />

          {/* Daily Cases Curve (Terracotta) */}
          <path
            d={activeCases
              .map((val, idx) => {
                const x = 35 + (idx * (chartWidth - 50)) / (activeDates.length - 1);
                const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#C2410C"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {activeCases.map((val, idx) => {
            const x = 35 + (idx * (chartWidth - 50)) / (activeDates.length - 1);
            const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
            const isCriticalSurge =
              val > region.baselineDailyCases * 2 && idx >= activeDates.length - 10;

            return (
              <g key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isCriticalSurge ? '4' : '2'}
                  fill={isCriticalSurge ? '#E11D48' : '#C2410C'}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
                {idx % Math.ceil(activeDates.length / 7) === 0 && (
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill="#78716C"
                    className="text-[8px]"
                  >
                    {activeDates[idx].slice(5)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Crosshair Cursor on Hover */}
          {activeHoverIdx !== null && (
            <g>
              <line
                x1={35 + (activeHoverIdx * (chartWidth - 50)) / (activeDates.length - 1)}
                y1="10"
                x2={35 + (activeHoverIdx * (chartWidth - 50)) / (activeDates.length - 1)}
                y2={chartHeight - 20}
                stroke="#C2410C"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={35 + (activeHoverIdx * (chartWidth - 50)) / (activeDates.length - 1)}
                cy={
                  chartHeight -
                  20 -
                  (activeCases[activeHoverIdx] / maxVal) * (chartHeight - 35)
                }
                r="5"
                fill="#C2410C"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="mt-3 pt-2 border-t border-[#F0EBE1] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-[#FAF7F2] rounded-md border border-[#E7E1D8]">
          <div className="text-[10px] text-[#78716C]">INSPECTED DATE</div>
          <div className="text-sm font-bold text-[#1C1917] mt-0.5">{hoveredDate}</div>
        </div>

        <div className="p-2.5 bg-[#FAF7F2] rounded-md border border-[#E7E1D8]">
          <div className="text-[10px] text-[#78716C]">DAILY INTAKE</div>
          <div className="text-sm font-bold text-[#C2410C] mt-0.5 tabular-nums">
            {hoveredCount} cases{' '}
            <span className={`text-[10px] font-normal ${deltaFromBaseline >= 0 ? 'text-[#BE123C]' : 'text-[#15803D]'}`}>
              ({deltaFromBaseline >= 0 ? `+${deltaFromBaseline}` : deltaFromBaseline})
            </span>
          </div>
        </div>

        <div className="p-2.5 bg-[#FAF7F2] rounded-md border border-[#E7E1D8]">
          <div className="text-[10px] text-[#78716C]">7-DAY ROLLING AVERAGE</div>
          <div className="text-sm font-bold text-[#D97706] mt-0.5 tabular-nums">
            {hoveredMA} cases/day
          </div>
        </div>

        <div className="p-2.5 bg-[#FAF7F2] rounded-md border border-[#E7E1D8]">
          <div className="text-[10px] text-[#78716C]">Z-SCORE VARIANCE</div>
          <div className={`text-sm font-bold mt-0.5 tabular-nums ${
            alert && alert.zScore >= 2.5 ? 'text-[#BE123C]' : 'text-[#1C1917]'
          }`}>
            +{alert?.zScore ?? '1.24'} σ
            {alert && alert.zScore >= 2.5 && (
              <span className="text-[10px] font-normal text-[#BE123C] ml-1">● Outlier</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
