import React from 'react';
import { RegionNode, CaseReport, OutbreakAlert, AlertStatus } from '../types/epidemiology';
import { Hospital, Users, Activity, Layers, ArrowLeft } from 'lucide-react';

interface RegionDetailPageProps {
  regions: RegionNode[];
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  cases: CaseReport[];
  alerts: OutbreakAlert[];
  dates: string[];
  onNavigateClusters: () => void;
  onNavigateForecast: () => void;
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
}

export const RegionDetailPage: React.FC<RegionDetailPageProps> = ({
  regions,
  selectedRegionId,
  setSelectedRegionId,
  cases,
  alerts,
  dates,
  onNavigateClusters,
  onNavigateForecast,
  onUpdateAlertStatus,
}) => {
  const region = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const regionAlert = alerts.find((a) => a.regionId === region.id);

  // Sector cases
  const regionCases = cases.filter((c) => c.regionId === region.id);

  // Disease breakdown counts
  const diseaseBreakdown: { [key: string]: number } = {};
  regionCases.forEach((c) => {
    diseaseBreakdown[c.disease] = (diseaseBreakdown[c.disease] || 0) + 1;
  });

  // Daily cases for this region over the 35 days
  const dailyCases = dates.map((d) => {
    return regionCases.filter((c) => c.date === d).length;
  });

  // 7-day moving averages
  const movingAverages = dailyCases.map((val, idx) => {
    const start = Math.max(0, idx - 6);
    const windowSlice = dailyCases.slice(start, idx + 1);
    const sum = windowSlice.reduce((a, b) => a + b, 0);
    return Number((sum / windowSlice.length).toFixed(1));
  });

  // Chart dimensions
  const chartHeight = 160;
  const chartWidth = 640;
  const maxVal = Math.max(20, ...dailyCases, ...movingAverages) * 1.15;

  return (
    <div className="space-y-4">
      {/* Top Sector Header and Selector */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-4 sm:p-5 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
            <span>DISTRICT EPIDEMIOLOGICAL PROFILE</span>
            <span>·</span>
            <span className="font-bold text-[#C2410C]">SECTOR: {region.code}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
            {region.name}
          </h1>
          <div className="text-xs text-[#78716C] mt-1 font-mono">
            GPS Coordinates: {region.coordinates.lat.toFixed(4)}°N, {region.coordinates.lng.toFixed(4)}°E · Area: {region.areaKm2} km²
          </div>
        </div>

        {/* Sector Switcher */}
        <div className="flex items-center gap-3">
          <label htmlFor="sec-switch" className="text-xs font-mono text-[#78716C] whitespace-nowrap font-medium">
            Select District:
          </label>
          <select
            id="sec-switch"
            value={region.id}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="text-xs font-mono font-medium bg-[#FAF7F2] border border-[#E7E1D8] rounded-md px-3 py-1.5 text-[#1C1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demographic and Capacity KPIs Strip with Warm Pastel Hues */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3 rounded-lg shadow-xs">
          <div className="text-[10px] text-[#78716C] font-bold">REGISTERED CITIZENS</div>
          <div className="text-lg font-bold text-[#1C1917] mt-0.5 tabular-nums">
            {region.population.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">Census Verified</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3 rounded-lg shadow-xs">
          <div className="text-[10px] text-[#78716C] font-bold">POPULATION DENSITY</div>
          <div className="text-lg font-bold text-[#1C1917] mt-0.5 tabular-nums">
            {region.density.toLocaleString()}{' '}
            <span className="text-[10px] text-[#78716C]">/km²</span>
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">{region.areaKm2} km² Surface</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-3 rounded-lg shadow-xs">
          <div className="text-[10px] text-[#78716C] font-bold">SURVEILLANCE Z-SCORE</div>
          <div className={`text-lg font-bold mt-0.5 tabular-nums ${
            regionAlert && regionAlert.zScore >= 2.5 ? 'text-[#BE123C]' : 'text-[#1C1917]'
          }`}>
            {regionAlert ? regionAlert.zScore : '0.6'} σ
            {regionAlert && regionAlert.zScore >= 2.5 && (
              <span className="text-[10px] font-bold text-[#BE123C] ml-1">● SURGE</span>
            )}
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">
            Baseline: {region.baselineDailyCases}/d
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FDE68A] p-3 rounded-lg shadow-xs">
          <div className="text-[10px] text-[#B45309] font-bold">HOSPITAL CAPACITY</div>
          <div className="text-lg font-bold text-[#B45309] mt-0.5 tabular-nums">
            {region.hospitalBeds} Beds
          </div>
          <div className="text-[10px] text-[#B45309]/80 mt-0.5">{region.healthUnits} Primary Units</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FED7AA] p-3 rounded-lg shadow-xs">
          <div className="text-[10px] text-[#C2410C] font-bold">35-DAY TOTAL CASES</div>
          <div className="text-lg font-bold text-[#C2410C] mt-0.5 tabular-nums">
            {regionCases.length} Intakes
          </div>
          <div className="text-[10px] text-[#78716C] mt-0.5">Indexed in Hash-Map</div>
        </div>
      </div>

      {/* Main Grid: Sector Epidemic Curve + Pathogen Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): 35-Day Trendline for this Sector */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E7E1D8] p-4 sm:p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
            <div>
              <h2 className="text-xs font-bold text-[#1C1917] uppercase font-mono tracking-wider">
                35-Day Longitudinal Case Profile
              </h2>
              <div className="text-[11px] text-[#78716C]">
                Daily incidence reports compared to 7-day rolling baseline
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#C2410C] inline-block" />
                <span className="text-[#292524] font-medium">Daily Reports</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#D97706] border-t border-dashed border-[#D97706] inline-block" />
                <span className="text-[#292524] font-medium">7-Day Moving Avg</span>
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full overflow-x-auto bg-[#FAF7F2] rounded-lg p-2 border border-[#E7E1D8]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 font-mono text-[9px]"
            >
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
                      strokeDasharray="2 2"
                    />
                    <text x="5" y={y + 3} fill="#78716C">
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              <line
                x1="30"
                y1={chartHeight - 20}
                x2={chartWidth - 5}
                y2={chartHeight - 20}
                stroke="#D6CEBE"
                strokeWidth="1"
              />

              {/* 7-Day Moving Average Line */}
              <path
                d={movingAverages
                  .map((val, idx) => {
                    const x = 38 + (idx * (chartWidth - 50)) / (dates.length - 1);
                    const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#D97706"
                strokeWidth="2.2"
                strokeDasharray="3 2"
              />

              {/* Daily cases curve */}
              <path
                d={dailyCases
                  .map((val, idx) => {
                    const x = 38 + (idx * (chartWidth - 50)) / (dates.length - 1);
                    const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#C2410C"
                strokeWidth="2.5"
              />

              {/* Points */}
              {dailyCases.map((val, idx) => {
                const x = 38 + (idx * (chartWidth - 50)) / (dates.length - 1);
                const y = chartHeight - 20 - (val / maxVal) * (chartHeight - 35);
                const isAlert = val > region.baselineDailyCases * 2;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isAlert ? '3.5' : '2'}
                    fill={isAlert ? '#BE123C' : '#C2410C'}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono pt-2 border-t border-[#F0EBE1] gap-2">
            <span className="text-[#78716C]">Continuous sliding-window evaluation with 35-day historical baseline</span>
            <div className="flex gap-2">
              <button
                onClick={onNavigateClusters}
                className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#1C1917] rounded-md border border-[#E7E1D8] font-medium transition-colors"
              >
                Inspect Contagion Corridors
              </button>
              <button
                onClick={onNavigateForecast}
                className="px-3 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-md font-semibold transition-colors"
              >
                Run SIR Forecast
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pathogen Breakdown in this Sector */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E7E1D8] p-4 sm:p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-3 border-b border-[#F0EBE1]">
              <h2 className="text-xs font-bold text-[#1C1917] uppercase font-mono tracking-wider">
                Pathogen Breakdown
              </h2>
              <div className="text-[11px] text-[#78716C]">
                Distribution of verified cases in {region.code}
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(diseaseBreakdown).map(([dis, count]) => {
                const pct = ((count / Math.max(1, regionCases.length)) * 100).toFixed(1);
                return (
                  <div key={dis} className="text-xs font-mono">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-[#1C1917]">{dis}</span>
                      <span className="text-[#78716C]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E7E1D8]">
                      <div
                        className="bg-[#C2410C] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District Action Recommendation */}
          {regionAlert && (
            <div className="mt-4 p-3.5 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg text-xs">
              <div className="font-mono text-[10px] uppercase font-bold text-[#9A3412] mb-1">
                Active Protocol: Level {regionAlert.severity} Alert
              </div>
              <div className="text-[#292524] font-sans leading-relaxed">{regionAlert.actionRecommendation}</div>
              <div className="mt-2.5 pt-2 border-t border-[#FED7AA] flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#78716C]">Status: {regionAlert.status}</span>
                <button
                  onClick={() =>
                    onUpdateAlertStatus(
                      regionAlert.id,
                      regionAlert.status === 'CONTAINED' ? 'ACTIVE' : 'CONTAINED'
                    )
                  }
                  className="px-2.5 py-1 rounded-md bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold transition-colors"
                >
                  {regionAlert.status === 'CONTAINED' ? 'Reopen Alert' : 'Mark Contained'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Admissions Ledger for Sector */}
      <div className="bg-[#FFFFFF] border border-[#E7E1D8] p-4 sm:p-5 rounded-xl shadow-xs">
        <div className="pb-2 mb-3 border-b border-[#F0EBE1] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#1C1917] uppercase font-mono tracking-wider">
              Recent Case Reports ({region.code})
            </h2>
            <div className="text-[11px] text-[#78716C]">
              Direct ledger extracted from Hash-Map index by region key
            </div>
          </div>
          <span className="text-xs font-mono text-[#78716C]">
            Showing latest {Math.min(8, regionCases.length)} cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#E7E1D8] text-[#78716C] text-[11px] bg-[#FAF7F2]">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Pathogen</th>
                <th className="py-2.5 px-3">Age Group</th>
                <th className="py-2.5 px-3">Reported Symptoms</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Sentinel Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {regionCases.slice(-8).reverse().map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 px-3 font-bold text-[#1C1917]">{c.id}</td>
                  <td className="py-2.5 px-3 text-[#78716C]">{c.date}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#1C1917]">{c.disease}</td>
                  <td className="py-2.5 px-3 text-[#78716C]">{c.ageGroup}</td>
                  <td className="py-2.5 px-3 text-[#78716C] max-w-[200px] truncate">
                    {c.symptoms.join(', ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.severity >= 4
                          ? 'bg-[#FFE4E6] text-[#BE123C]'
                          : c.severity === 3
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#F5F2EB] text-[#57534E]'
                      }`}
                    >
                      Sev {c.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#78716C] truncate max-w-[160px]">{c.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
