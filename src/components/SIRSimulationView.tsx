import React, { useState, useMemo } from 'react';
import { SIRModel } from '../algorithms/SIRModel';
import { SIRParameters } from '../types/epidemiology';

export const SIRSimulationView: React.FC = () => {
  // SIR Interactive Parameters
  const [population, setPopulation] = useState<number>(500000);
  const [initialInfected, setInitialInfected] = useState<number>(150);
  const [initialRecovered, setInitialRecovered] = useState<number>(0);
  const [beta, setBeta] = useState<number>(0.38); // Transmission rate
  const [gamma, setGamma] = useState<number>(0.14); // Recovery rate (~7 days infectious)
  const [durationDays, setDurationDays] = useState<number>(75);

  const sirParams: SIRParameters = useMemo(
    () => ({
      N: population,
      I0: initialInfected,
      R0: initialRecovered,
      beta,
      gamma,
      days: durationDays,
    }),
    [population, initialInfected, initialRecovered, beta, gamma, durationDays]
  );

  const simulation = useMemo(() => SIRModel.simulate(sirParams), [sirParams]);

  // SVG Chart Geometry
  const chartWidth = 720;
  const chartHeight = 260;
  const maxPop = population;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
            <span className="font-semibold text-[#B45309]">MATHEMATICAL EPIDEMIOLOGICAL MODELING</span>
            <span>·</span>
            <span>NUMERICAL EULER DISCRETIZATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
            SIR Compartmental Transmission Forecast
          </h1>
          <p className="text-xs text-[#57534E] mt-1 font-sans">
            Forward projection of Susceptible, Infected, and Recovered populations to evaluate healthcare surge capacity.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#78716C]">R₀ Index:</span>
          <span className={`px-2.5 py-1 rounded font-bold ${
            simulation.r0 > 1.0
              ? 'bg-[#FFE4E6] text-[#991B1B] border border-[#FECDD3]'
              : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
          }`}>
            {simulation.r0} ({simulation.r0 > 1.0 ? 'EPIDEMIC SURGE' : 'CONTAINED'})
          </span>
        </div>
      </div>

      {/* KPI Derived Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded shadow-xs">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">Reproduction Rate (R₀)</div>
          <div className="text-xl font-bold text-[#C2410C] mt-0.5 tabular-nums">
            {simulation.r0}
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">β / γ contact ratio</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded shadow-xs">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">Peak Infection Day</div>
          <div className="text-xl font-bold text-[#C5221F] mt-0.5 tabular-nums">
            Day {simulation.peakDay}
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">Max healthcare load</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded shadow-xs">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">Peak Active Infections</div>
          <div className="text-xl font-bold text-[#1C1917] mt-0.5 tabular-nums">
            {simulation.peakInfected.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">
            {((simulation.peakInfected / population) * 100).toFixed(1)}% of population
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3.5 rounded shadow-xs">
          <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">Herd Immunity Target</div>
          <div className="text-xl font-bold text-[#15803D] mt-0.5 tabular-nums">
            {simulation.herdImmunityThresholdPct}%
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">1 - (1 / R₀) threshold</div>
        </div>
      </div>

      {/* Main Grid: Controls on Left, SVG Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white border border-[#E7E1D8] rounded shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D8]">
            <h2 className="text-base font-bold text-[#1C1917]">
              "What-If" Scenario Deck
            </h2>
            <span className="text-[10px] font-mono bg-[#FFEDD5] text-[#9A3412] px-2 py-0.5 rounded border border-[#FED7AA]">
              Interactive
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#44403C]">Transmission Rate (β):</span>
              <span className="font-mono font-bold text-[#C2410C]">{beta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.01"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full accent-[#C2410C] cursor-pointer"
            />
            <div className="text-[10px] text-[#78716C] mt-0.5">
              Contact rate × probability of transmission upon contact
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#44403C]">Recovery Rate (γ):</span>
              <span className="font-mono font-bold text-[#15803D]">{gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.40"
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full accent-[#15803D] cursor-pointer"
            />
            <div className="text-[10px] text-[#78716C] mt-0.5">
              1 / infectious period (avg duration: {(1 / gamma).toFixed(1)} days)
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#44403C]">District Population (N):</span>
              <span className="font-mono font-bold text-[#1C1917]">
                {population.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={population}
              onChange={(e) => setPopulation(parseInt(e.target.value))}
              className="w-full accent-[#44403C] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#44403C]">Initial Infected (I₀):</span>
              <span className="font-mono font-bold text-[#C5221F]">{initialInfected}</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={initialInfected}
              onChange={(e) => setInitialInfected(parseInt(e.target.value))}
              className="w-full accent-[#C5221F] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-[#44403C]">Forecast Horizon:</span>
              <span className="font-mono font-bold text-[#1C1917]">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              className="w-full accent-[#44403C] cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-[#E7E1D8] flex gap-2">
            <button
              onClick={() => {
                setBeta(0.22);
                setGamma(0.14);
              }}
              className="flex-1 py-1.5 px-2 bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C] rounded text-xs font-medium transition-colors"
            >
              Simulate Containment (R₀ &lt; 2)
            </button>
            <button
              onClick={() => {
                setBeta(0.55);
                setGamma(0.12);
              }}
              className="flex-1 py-1.5 px-2 bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C] rounded text-xs font-medium transition-colors"
            >
              Unmitigated Surge
            </button>
          </div>
        </div>

        {/* Right Column: High-Precision SVG Curves (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-white border border-[#E7E1D8] rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E7E1D8]">
              <div>
                <h2 className="text-base font-bold text-[#1C1917]">
                  Dynamic Compartmental Curves
                </h2>
                <div className="text-xs text-[#78716C]">
                  S(t) Susceptible · I(t) Active Infected · R(t) Recovered / Immune
                </div>
              </div>

              {/* Legend with Warm Colors */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#44403C] inline-block rounded-xs" />
                  <span className="text-[#57534E]">S (Susceptible)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#C5221F] inline-block rounded-xs" />
                  <span className="text-[#57534E]">I (Infected)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#15803D] inline-block rounded-xs" />
                  <span className="text-[#57534E]">R (Recovered)</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="relative w-full overflow-x-auto py-2 bg-[#FDFBF7] rounded border border-[#E7E1D8]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-64 font-mono text-[9px]"
              >
                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
                  const y = chartHeight - 25 - (chartHeight - 45) * ratio;
                  const labelVal = `${Math.round(ratio * 100)}%`;
                  return (
                    <g key={ratio}>
                      <line
                        x1="45"
                        y1={y}
                        x2={chartWidth - 10}
                        y2={y}
                        stroke="#E7E1D8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <text x="5" y={y + 3} fill="#78716C">
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis */}
                <line
                  x1="45"
                  y1={chartHeight - 25}
                  x2={chartWidth - 10}
                  y2={chartHeight - 25}
                  stroke="#D6D3D1"
                  strokeWidth="1"
                />

                {/* S Curve (Warm Espresso / Slate) */}
                <path
                  d={simulation.points
                    .map((pt, idx) => {
                      const x = 50 + (idx * (chartWidth - 70)) / (simulation.points.length - 1);
                      const y = chartHeight - 25 - (pt.susceptible / maxPop) * (chartHeight - 45);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#44403C"
                  strokeWidth="2.5"
                />

                {/* R Curve (Warm Sage / Forest Green) */}
                <path
                  d={simulation.points
                    .map((pt, idx) => {
                      const x = 50 + (idx * (chartWidth - 70)) / (simulation.points.length - 1);
                      const y = chartHeight - 25 - (pt.recovered / maxPop) * (chartHeight - 45);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="2.5"
                />

                {/* I Curve (Alert Terracotta / Crimson) with warm blush fill */}
                <path
                  d={`${simulation.points
                    .map((pt, idx) => {
                      const x = 50 + (idx * (chartWidth - 70)) / (simulation.points.length - 1);
                      const y = chartHeight - 25 - (pt.infected / maxPop) * (chartHeight - 45);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')} L ${chartWidth - 20} ${chartHeight - 25} L 50 ${chartHeight - 25} Z`}
                  fill="rgba(197, 34, 31, 0.08)"
                />

                <path
                  d={simulation.points
                    .map((pt, idx) => {
                      const x = 50 + (idx * (chartWidth - 70)) / (simulation.points.length - 1);
                      const y = chartHeight - 25 - (pt.infected / maxPop) * (chartHeight - 45);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#C5221F"
                  strokeWidth="2.5"
                />

                {/* Peak Day Marker line */}
                {simulation.peakDay > 0 && (
                  <g>
                    <line
                      x1={
                        50 +
                        (simulation.peakDay * (chartWidth - 70)) / (simulation.points.length - 1)
                      }
                      y1="15"
                      x2={
                        50 +
                        (simulation.peakDay * (chartWidth - 70)) / (simulation.points.length - 1)
                      }
                      y2={chartHeight - 25}
                      stroke="#C5221F"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    />
                    <text
                      x={
                        50 +
                        (simulation.peakDay * (chartWidth - 70)) / (simulation.points.length - 1) +
                        5
                      }
                      y="25"
                      fill="#C5221F"
                      className="text-[9px] font-bold"
                    >
                      Peak Day {simulation.peakDay}
                    </text>
                  </g>
                )}

                {/* X-axis day labels */}
                {simulation.points
                  .filter((_, idx) => idx % Math.ceil(durationDays / 6) === 0)
                  .map((pt) => {
                    const x =
                      50 + (pt.day * (chartWidth - 70)) / (simulation.points.length - 1);
                    return (
                      <text
                        key={pt.day}
                        x={x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fill="#78716C"
                        className="text-[9px]"
                      >
                        Day {pt.day}
                      </text>
                    );
                  })}
              </svg>
            </div>
          </div>

          {/* Differential Equations Mathematical Reference Box */}
          <div className="mt-4 p-3 bg-[#FAF7F2] border border-[#E7E1D8] rounded text-xs text-[#57534E] font-mono">
            <div className="text-[#1C1917] font-bold mb-1">Underlying Discrete System:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
              <div>ΔS = - (β · S · I) / N</div>
              <div>ΔI = (β · S · I) / N - γ · I</div>
              <div>ΔR = γ · I</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
