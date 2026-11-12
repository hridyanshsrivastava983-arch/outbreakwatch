import React, { useState } from 'react';
import { DSABenchmarker } from '../algorithms/DSABenchmarker';
import { ResourceAllocator } from '../algorithms/ResourceAllocator';
import { BenchmarkMetrics, RegionNode, OutbreakAlert } from '../types/epidemiology';

interface DSABenchmarksViewProps {
  regions: RegionNode[];
  alerts: OutbreakAlert[];
}

export const DSABenchmarksView: React.FC<DSABenchmarksViewProps> = ({
  regions,
  alerts,
}) => {
  const [datasetSize, setDatasetSize] = useState<number>(10000);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkMetrics[]>(() =>
    DSABenchmarker.runBenchmark(5000)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Resource Allocator States (Planned Enhancement #6)
  const [totalKits, setTotalKits] = useState<number>(50000);
  const [totalVaccines, setTotalVaccines] = useState<number>(20000);
  const [totalResponseTeams, setTotalResponseTeams] = useState<number>(12);

  const resourceAllocations = ResourceAllocator.allocateResources(regions, alerts, {
    totalTestKitsAvailable: totalKits,
    totalVaccineDosesAvailable: totalVaccines,
    totalRapidResponseUnitsAvailable: totalResponseTeams,
  });

  const runLiveTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = DSABenchmarker.runBenchmark(datasetSize);
      setBenchmarkResults(res);
      setIsRunning(false);
    }, 100);
  };

  const dsaCatalog = [
    {
      name: 'Array',
      usage: 'Base contiguous storage for raw case records',
      access: 'O(1)',
      search: 'O(N)',
      space: 'O(N)',
    },
    {
      name: 'FIFO Queue',
      usage: 'Incoming hospital diagnostic stream processed in arrival order',
      access: 'O(1) pop',
      search: 'O(N)',
      space: 'O(K)',
    },
    {
      name: 'Double-Ended Queue (Deque)',
      usage: 'Fixed 7-day sliding window for moving-average and z-score surge tracking',
      access: 'O(1) push/pop ends',
      search: 'O(W)',
      space: 'O(W)',
    },
    {
      name: 'Hash Map (Multi-Key Index)',
      usage: 'Instant lookups by Unique ID, Region ID, Disease Name, and Date',
      access: 'O(1) avg',
      search: 'O(1) avg',
      space: 'O(N)',
    },
    {
      name: 'Trie (Prefix Tree)',
      usage: 'Fast symptom/disease prefix queries and symptom co-occurrence cluster mining',
      access: 'O(L) string length',
      search: 'O(L + K)',
      space: 'O(Σ · L · N)',
    },
    {
      name: 'Segment Tree / Fenwick Tree',
      usage: 'Range sum queries and peak cases in chronological date windows',
      access: 'O(log N) query',
      search: 'O(log N) update',
      space: 'O(4N)',
    },
    {
      name: 'Binary Max-Heap',
      usage: 'Ranking and surfacing highest-severity outbreak alerts and triage ranking',
      access: 'O(1) peek',
      search: 'O(log N) insert/pop',
      space: 'O(N)',
    },
    {
      name: 'Graph (Adjacency List)',
      usage: 'Regional containment network with BFS, DFS, and Dijkstra shortest path',
      access: 'O(V + E) traversal',
      search: 'O((V + E) log V)',
      space: 'O(V + E)',
    },
    {
      name: 'Union-Find (Disjoint Set)',
      usage: 'Grouping connected infected regions into named trackable clusters',
      access: 'O(α(N)) find',
      search: 'O(α(N)) union',
      space: 'O(N)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E7E1D8]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] mb-1">
          <span className="font-semibold text-[#B45309]">Core Engine Telemetry &amp; Verification</span>
          <span>·</span>
          <span>Microsecond Execution Profiler &amp; Scaling Analysis</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          System Architecture, Complexity Analysis &amp; Benchmarks
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-3xl">
          Empirical verification profiling query throughput across indexing structures
          (Multi-Key Index, Range Trees, Priority Triage) with microsecond latency metrics and resource allocation optimization.
        </p>
      </div>

      {/* Section 1: Live In-Browser Performance Benchmark */}
      <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E1D8]">
          <div>
            <h2 className="text-base font-bold text-[#1C1917]">
              Live Performance Benchmarks: Linear-Scan vs. Indexed DS
            </h2>
            <div className="text-xs text-[#78716C]">
              Evaluates real execution time in browser memory using <code className="font-mono text-[#1C1917] bg-[#F5F0E8] px-1 py-0.5 rounded">performance.now()</code>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={datasetSize}
              onChange={(e) => setDatasetSize(Number(e.target.value))}
              className="text-xs font-mono bg-white border border-[#D6D3D1] rounded px-2.5 py-1.5 text-[#1C1917] font-medium"
            >
              <option value={1000}>N = 1,000 Records</option>
              <option value={5000}>N = 5,000 Records</option>
              <option value={10000}>N = 10,000 Records</option>
              <option value={25000}>N = 25,000 Records</option>
            </select>

            <button
              onClick={runLiveTest}
              disabled={isRunning}
              className="px-4 py-1.5 bg-[#C2410C] text-white rounded text-xs font-semibold hover:bg-[#9A3412] disabled:opacity-50 transition-colors shadow-xs"
            >
              {isRunning ? 'Benchmarking...' : 'Run Live Benchmark'}
            </button>
          </div>
        </div>

        {/* Benchmark Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benchmarkResults.map((bench, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FDFBF7] border border-[#E7E1D8] rounded space-y-3 shadow-2xs"
            >
              <div className="text-xs font-bold text-[#1C1917] leading-tight">
                {bench.operation}
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[#57534E]">
                  <span>Linear Baseline:</span>
                  <span className="font-semibold text-[#C5221F]">
                    {bench.linearScanUs} μs ({bench.theoreticalBigO.linear})
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#57534E]">
                  <span>Indexed Optimized:</span>
                  <span className="font-semibold text-[#15803D]">
                    {bench.indexedUs} μs ({bench.theoreticalBigO.indexed})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7E1D8] flex items-center justify-between">
                <span className="text-[11px] text-[#78716C] font-medium">Measured Speedup:</span>
                <span className="text-sm font-bold font-mono text-[#9A3412] bg-[#FFEDD5] border border-[#FED7AA] px-2 py-0.5 rounded">
                  {bench.speedup}× Faster
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Complete Data Structures Catalog Matrix */}
      <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E1D8]">
          <div>
            <h2 className="text-base font-bold text-[#1C1917]">
              Engine Data Structures Architecture
            </h2>
            <div className="text-xs text-[#78716C]">
              Theoretical Time &amp; Space Complexity Specifications
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#F5F0E8] border border-[#E7E1D8] text-[#57534E] px-2.5 py-0.5 rounded font-semibold">
            9 Core Structures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#E7E1D8] bg-[#FAF7F2] text-[#78716C] font-mono text-[11px]">
                <th className="py-2.5 px-3">Data Structure</th>
                <th className="py-2.5 px-3">Role in System</th>
                <th className="py-2.5 px-3">Primary Op Time</th>
                <th className="py-2.5 px-3">Search/Query Time</th>
                <th className="py-2.5 px-3">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1D8]">
              {dsaCatalog.map((item) => (
                <tr key={item.name} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#1C1917] font-mono text-xs">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#44403C]">{item.usage}</td>
                  <td className="py-2.5 px-3 font-mono text-[#C2410C] font-semibold">
                    {item.access}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#15803D] font-semibold">
                    {item.search}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#78716C]">{item.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Planned Enhancement #6 - Greedy/Priority-Queue Resource Allocator */}
      <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E1D8]">
          <div>
            <h2 className="text-base font-bold text-[#1C1917]">
              Dynamic Resource Allocation Suggester
            </h2>
            <div className="text-xs text-[#78716C]">
              Optimizes distribution of diagnostic kits, vaccine stock, and ICU emergency teams by composite alert urgency
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded border border-[#FDE68A] font-semibold">
            Greedy / Priority Queue
          </span>
        </div>

        {/* Stock Pool Parameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[#57534E] font-mono block mb-1">
              Available Test Kits:
            </label>
            <input
              type="number"
              step="5000"
              value={totalKits}
              onChange={(e) => setTotalKits(Number(e.target.value))}
              className="w-full bg-white border border-[#D6D3D1] rounded p-2 font-mono text-[#1C1917] font-medium"
            />
          </div>

          <div>
            <label className="text-[#57534E] font-mono block mb-1">
              Available Vaccine Doses:
            </label>
            <input
              type="number"
              step="2000"
              value={totalVaccines}
              onChange={(e) => setTotalVaccines(Number(e.target.value))}
              className="w-full bg-white border border-[#D6D3D1] rounded p-2 font-mono text-[#1C1917] font-medium"
            />
          </div>

          <div>
            <label className="text-[#57534E] font-mono block mb-1">
              Emergency Response Units:
            </label>
            <input
              type="number"
              step="1"
              value={totalResponseTeams}
              onChange={(e) => setTotalResponseTeams(Number(e.target.value))}
              className="w-full bg-white border border-[#D6D3D1] rounded p-2 font-mono text-[#1C1917] font-medium"
            />
          </div>
        </div>

        {/* Allocation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7E1D8] bg-[#FAF7F2] text-[#78716C] font-mono text-[11px]">
                <th className="py-2.5 px-3">Priority Rank</th>
                <th className="py-2.5 px-3">District Region</th>
                <th className="py-2.5 px-3">Weighted Risk Score</th>
                <th className="py-2.5 px-3 text-[#C2410C]">Recommended Test Kits</th>
                <th className="py-2.5 px-3 text-[#15803D]">Recommended Vaccines</th>
                <th className="py-2.5 px-3 text-[#C5221F]">Rapid Response Teams</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1D8] font-mono text-xs">
              {resourceAllocations.map((alloc) => (
                <tr key={alloc.regionId} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#78716C]">
                    #{alloc.priorityRank}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-[#1C1917]">
                    {alloc.regionName}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#1C1917]">
                    {alloc.riskScore}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#C2410C]">
                    {alloc.recommendedTestKits.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#15803D]">
                    {alloc.recommendedVaccines.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#C5221F]">
                    {alloc.recommendedResponseUnits > 0
                      ? `${alloc.recommendedResponseUnits} units dispatched`
                      : '0 (Standby)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
