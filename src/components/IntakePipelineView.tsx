import React, { useState } from 'react';
import { RegionNode, CaseReport, AgeGroup, SeverityLevel } from '../types/epidemiology';
import { COMMON_DISEASES, COMMON_SYMPTOMS } from '../data/initialData';

interface IntakePipelineViewProps {
  regions: RegionNode[];
  cases: CaseReport[];
  queueCases: CaseReport[];
  onManualSubmit: (report: Omit<CaseReport, 'id' | 'recordedAt' | 'patientHash'>) => void;
  onBatchSimulate: (count: number) => void;
  isStreaming: boolean;
  toggleStreaming: () => void;
}

export const IntakePipelineView: React.FC<IntakePipelineViewProps> = ({
  regions,
  cases,
  queueCases,
  onManualSubmit,
  onBatchSimulate,
  isStreaming,
  toggleStreaming,
}) => {
  // Form states
  const [disease, setDisease] = useState<string>(COMMON_DISEASES[0]);
  const [regionId, setRegionId] = useState<string>(regions[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-49');
  const [severity, setSeverity] = useState<SeverityLevel>(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High fever',
    'Severe joint pain',
  ]);
  const [facility, setFacility] = useState<string>('District General Hospital');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regionObj = regions.find((r) => r.id === regionId) || regions[0];

    onManualSubmit({
      disease,
      regionId,
      regionName: regionObj.name,
      date,
      ageGroup,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Unspecified fever'],
      severity,
      facility,
    });

    setNotification(`Case dispatched to Ingestion Queue [FIFO] -> Processed into Hash-Map Index`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Pipeline Header */}
      <div className="pb-4 border-b border-[#E7E1D8]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] mb-1">
          <span className="font-semibold text-[#B45309]">Automated Ingestion Pipeline</span>
          <span>·</span>
          <span>High-Throughput Clinical Stream Processing</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          Case Report Intake &amp; Processing Pipeline
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-3xl">
          Continuous stream: <strong>Clinical Report Input</strong> → <strong>FIFO Ingestion Queue</strong> →{' '}
          <strong>Real-Time Hash Index</strong> → <strong>Anomaly Detection Engine</strong> →{' '}
          <strong>Transmission Network</strong> → <strong>Priority Triage Alerts</strong>.
        </p>
      </div>

      {/* End-to-End Visual Flow Ribbon in Warm Espresso & Amber Tones */}
      <div className="p-4 bg-[#292524] text-[#FAF7F2] rounded border border-[#44403C] shadow-sm overflow-x-auto">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8A29E] mb-3 flex items-center justify-between">
          <span>Live Biosurveillance Ingestion Architecture</span>
          <span className="text-[#FDE68A] font-semibold text-[10px]">REAL-TIME RE-INDEXING ACTIVATED</span>
        </div>
        <div className="flex items-center gap-3 min-w-[760px] text-xs font-mono">
          <div className="flex-1 p-2.5 bg-[#1C1917] border border-[#44403C] rounded text-center">
            <div className="text-[#A8A29E] text-[10px]">Step 1: Input</div>
            <div className="font-semibold text-[#FAF7F2] mt-0.5">Report Ingestion</div>
            <div className="text-[10px] text-[#A8A29E] mt-0.5">Hospital / Lab</div>
          </div>
          <span className="text-[#F59E0B] font-bold">→</span>

          <div className="flex-1 p-2.5 bg-[#451A03] border border-[#78350F] rounded text-center">
            <div className="text-[#FDE68A] text-[10px]">Step 2: Buffer Queue</div>
            <div className="font-semibold text-[#FEF3C7] mt-0.5">FIFO Buffer</div>
            <div className="text-[10px] text-[#FDE68A] mt-0.5">
              {queueCases.length} pending
            </div>
          </div>
          <span className="text-[#F59E0B] font-bold">→</span>

          <div className="flex-1 p-2.5 bg-[#1C1917] border border-[#44403C] rounded text-center">
            <div className="text-[#A8A29E] text-[10px]">Step 3: Indexing</div>
            <div className="font-semibold text-[#FAF7F2] mt-0.5">Hash-Map O(1)</div>
            <div className="text-[10px] text-[#A8A29E] mt-0.5">Multi-Key Index</div>
          </div>
          <span className="text-[#F59E0B] font-bold">→</span>

          <div className="flex-1 p-2.5 bg-[#1C1917] border border-[#44403C] rounded text-center">
            <div className="text-[#A8A29E] text-[10px]">Step 4: AI/Stats</div>
            <div className="font-semibold text-[#FAF7F2] mt-0.5">Deque Z-Score</div>
            <div className="text-[10px] text-[#A8A29E] mt-0.5">7-Day Anomaly</div>
          </div>
          <span className="text-[#F59E0B] font-bold">→</span>

          <div className="flex-1 p-2.5 bg-[#1C1917] border border-[#44403C] rounded text-center">
            <div className="text-[#A8A29E] text-[10px]">Step 5: Spread</div>
            <div className="font-semibold text-[#FAF7F2] mt-0.5">Region Graph</div>
            <div className="text-[10px] text-[#A8A29E] mt-0.5">BFS / Dijkstra</div>
          </div>
          <span className="text-[#F59E0B] font-bold">→</span>

          <div className="flex-1 p-2.5 bg-[#4C0519] border border-[#881337] rounded text-center">
            <div className="text-[#FECDD3] text-[10px]">Step 6: Triage</div>
            <div className="font-semibold text-[#FFE4E6] mt-0.5">Max-Heap</div>
            <div className="text-[10px] text-[#FECDD3] mt-0.5">Urgent Alert PQ</div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-[#FFEDD5] border border-[#FED7AA] text-[#9A3412] rounded text-xs font-mono flex items-center justify-between shadow-xs">
          <span>✓ {notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-[#9A3412] hover:text-[#7C2D12] font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form and Stream Controls Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Clinical Intake (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E1D8]">
            <div>
              <h2 className="text-base font-bold text-[#1C1917]">
                Hospital &amp; Diagnostic Lab Report Intake
              </h2>
              <div className="text-xs text-[#78716C]">
                Direct entry for confirmed or suspected clinical admissions
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#78716C] bg-[#F5F0E8] border border-[#E7E1D8] px-2 py-0.5 rounded">
              Secure Endpoint
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#44403C] mb-1">
                  Suspected / Confirmed Disease:
                </label>
                <select
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
                >
                  {COMMON_DISEASES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#44403C] mb-1">
                  Surveillance Region:
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-[#44403C] mb-1">
                  Report Date:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-mono focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#44403C] mb-1">
                  Age Group:
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
                >
                  <option value="0-17">0-17 (Pediatric)</option>
                  <option value="18-49">18-49 (Adult)</option>
                  <option value="50-64">50-64 (Middle-aged)</option>
                  <option value="65+">65+ (Geriatric)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#44403C] mb-1">
                  Severity Level (1-5):
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value) as SeverityLevel)}
                  className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-mono focus:ring-1 focus:ring-[#C2410C]"
                >
                  <option value={1}>1 - Mild / Outpatient</option>
                  <option value={2}>2 - Moderate / Under Observation</option>
                  <option value={3}>3 - Serious / Inpatient Hospitalized</option>
                  <option value={4}>4 - Severe / Intensive Monitoring</option>
                  <option value={5}>5 - Critical / ICU / High Mortality Risk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#44403C] mb-1">
                Submitting Facility / Diagnostic Unit:
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g. Metro South Virology Lab & Medical Center"
                className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] focus:ring-1 focus:ring-[#C2410C]"
              />
            </div>

            {/* Checkbox symptoms */}
            <div>
              <label className="block font-medium text-[#44403C] mb-1.5">
                Observed Clinical Symptoms (Recorded for Trie and Naive Bayes):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-2.5 bg-[#FAF7F2] border border-[#E7E1D8] rounded">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`text-left px-2.5 py-1.5 rounded text-[11px] transition-colors border ${
                        isChecked
                          ? 'bg-[#C2410C] text-white border-[#C2410C] font-semibold shadow-xs'
                          : 'bg-white text-[#44403C] border-[#E7E1D8] hover:bg-[#F5F0E8]'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#78716C]">
                Pushes to arrival queue and triggers automated z-score evaluation.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white font-semibold rounded transition-colors shadow-sm"
              >
                Enqueue &amp; Process Case
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Ingestion Simulator & Real-time Queue Monitor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulation Generator */}
          <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
            <h2 className="text-base font-bold text-[#1C1917] pb-2 border-b border-[#E7E1D8]">
              Live Stream &amp; Stress Simulator
            </h2>
            <p className="text-xs text-[#57534E] my-3">
              Test FIFO queue throughput and instant multi-key hash indexing by injecting simulated diagnostic batches.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => onBatchSimulate(5)}
                className="px-3 py-1.5 bg-[#F5F0E8] hover:bg-[#EAE2D5] border border-[#D6D3D1] rounded text-xs font-medium text-[#44403C] transition-colors"
              >
                + Inject 5 Reports
              </button>
              <button
                onClick={() => onBatchSimulate(25)}
                className="px-3 py-1.5 bg-[#F5F0E8] hover:bg-[#EAE2D5] border border-[#D6D3D1] rounded text-xs font-medium text-[#44403C] transition-colors"
              >
                + Inject 25 Reports
              </button>
              <button
                onClick={toggleStreaming}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  isStreaming
                    ? 'bg-[#FFE4E6] text-[#991B1B] border border-[#FECDD3]'
                    : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                }`}
              >
                {isStreaming ? 'Stop Auto-Feed' : 'Continuous Stream (2s)'}
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E7E1D8] rounded text-xs font-mono space-y-1">
              <div className="flex justify-between text-[#57534E]">
                <span>FIFO Queue Size:</span>
                <span className="font-bold text-[#1C1917]">{queueCases.length}</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span>Hash Map Index Size:</span>
                <span className="font-bold text-[#C2410C]">{cases.length}</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span>Arrival Stream State:</span>
                <span className={isStreaming ? 'text-[#D97706] font-semibold' : 'text-[#78716C]'}>
                  {isStreaming ? '● STREAMING (2s pulse)' : 'IDLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Ingested Cases Feed */}
          <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
            <h2 className="text-base font-bold text-[#1C1917] pb-2 border-b border-[#E7E1D8]">
              Recently Indexed Reports (FIFO Out)
            </h2>
            <div className="divide-y divide-[#E7E1D8] max-h-64 overflow-y-auto mt-2">
              {cases
                .slice(-6)
                .reverse()
                .map((c) => (
                  <div key={c.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-[#1C1917]">{c.id}</span>
                      <span className="font-mono text-[10px] text-[#78716C]">{c.date}</span>
                    </div>
                    <div className="text-[#44403C] font-semibold mt-0.5">
                      {c.disease} · <span className="text-[#78716C] font-normal">{c.regionName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#78716C] mt-0.5">
                      <span>Age: {c.ageGroup}</span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-[#C5221F]">
                        Severity {c.severity}/5
                      </span>
                      <span>·</span>
                      <span className="truncate max-w-[140px]">{c.facility}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
