import React, { useState } from 'react';
import { RegionNode, RegionEdge, OutbreakAlert } from '../types/epidemiology';
import { RegionGraph, DijkstraResult, GraphTraversalStep } from '../dsa/RegionGraph';

interface GraphSpreadViewProps {
  regions: RegionNode[];
  connections: RegionEdge[];
  alerts: OutbreakAlert[];
  graph: RegionGraph;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
}

export const GraphSpreadView: React.FC<GraphSpreadViewProps> = ({
  regions,
  connections,
  alerts,
  graph,
  selectedRegionId,
  setSelectedRegionId,
}) => {
  const [algoMode, setAlgoMode] = useState<'NONE' | 'BFS' | 'DFS' | 'DIJKSTRA' | 'UNION_FIND'>('DIJKSTRA');
  const [sourceNodeId, setSourceNodeId] = useState<string>('REG-03'); // East Harbour (Dengue epicenter)
  const [targetNodeId, setTargetNodeId] = useState<string>('REG-07'); // Highland Suburbs
  const [traversalResult, setTraversalResult] = useState<GraphTraversalStep[]>([]);
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(null);

  // Active infected regions for Union-Find clustering (regions with active alert)
  const activeInfectedRegionIds = new Set<string>(
    alerts.filter((a) => a.severity >= 3).map((a) => a.regionId)
  );

  // Compute named Union-Find clusters
  const ufClusters = graph.computeOutbreakClusters(activeInfectedRegionIds);

  // Auto-evaluate when parameters or algorithm changes
  React.useEffect(() => {
    if (algoMode === 'DIJKSTRA') {
      const res = graph.dijkstra(sourceNodeId, targetNodeId);
      setDijkstraResult(res);
      setTraversalResult([]);
    } else if (algoMode === 'BFS') {
      const res = graph.bfs(sourceNodeId);
      setTraversalResult(res);
      setDijkstraResult(null);
    } else if (algoMode === 'DFS') {
      const res = graph.dfs(sourceNodeId);
      setTraversalResult(res);
      setDijkstraResult(null);
    } else if (algoMode === 'UNION_FIND') {
      setTraversalResult([]);
      setDijkstraResult(null);
    }
  }, [algoMode, sourceNodeId, targetNodeId, graph]);

  const runBfs = () => {
    setAlgoMode('BFS');
  };

  const runDfs = () => {
    setAlgoMode('DFS');
  };

  const runDijkstra = () => {
    setAlgoMode('DIJKSTRA');
  };

  const runUnionFind = () => {
    setAlgoMode('UNION_FIND');
  };

  // Color mapping based on risk score or cluster
  const getNodeColor = (nodeId: string) => {
    if (algoMode === 'DIJKSTRA' && dijkstraResult?.path.includes(nodeId)) {
      return '#C2410C'; // Warm Terracotta for shortest path
    }
    const alert = alerts.find((a) => a.regionId === nodeId);
    if (!alert) return '#78716C'; // neutral warm stone
    if (alert.severity >= 3) return '#C5221F'; // Alert warm crimson
    if (alert.severity === 2) return '#D97706'; // Watch warm amber
    return '#44403C';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#E7E1D8]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] mb-1">
          <span className="font-semibold text-[#B45309]">Vector Transmission Network</span>
          <span>·</span>
          <span>Commuter Mobility &amp; Cluster Modeling</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          Regional Graph Spread Tracing &amp; Cluster Modeling
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-3xl">
          Simulate transmission pathways using <strong>BFS</strong> (nearest reachable node),{' '}
          <strong>DFS</strong> (corridor depth exploration), <strong>Dijkstra</strong> (fastest likely spread path by travel-volume),
          and <strong>Union-Find</strong> (automatic outbreak cluster identification).
        </p>
      </div>

      {/* Algorithm Toolbar */}
      <div className="p-4 bg-white border border-[#E7E1D8] rounded shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#78716C] mr-1">Algorithm:</span>
          <button
            onClick={runDijkstra}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              algoMode === 'DIJKSTRA'
                ? 'bg-[#C2410C] text-white shadow-xs'
                : 'bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C]'
            }`}
          >
            Dijkstra (Weighted Travel Path)
          </button>
          <button
            onClick={runBfs}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              algoMode === 'BFS'
                ? 'bg-[#292524] text-white shadow-xs'
                : 'bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C]'
            }`}
          >
            BFS (Unweighted Hop Count)
          </button>
          <button
            onClick={runDfs}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              algoMode === 'DFS'
                ? 'bg-[#292524] text-white shadow-xs'
                : 'bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C]'
            }`}
          >
            DFS (Deep Traversal)
          </button>
          <button
            onClick={runUnionFind}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              algoMode === 'UNION_FIND'
                ? 'bg-[#B45309] text-white shadow-xs'
                : 'bg-[#F5F0E8] hover:bg-[#EAE2D5] text-[#44403C]'
            }`}
          >
            Union-Find (Cluster Disjoint Sets)
          </button>
        </div>

        {/* Origin / Destination Pickers */}
        <div className="flex items-center gap-3 text-xs">
          <div>
            <label className="text-[#78716C] font-mono mr-1.5">Source:</label>
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="bg-white border border-[#D6D3D1] rounded px-2.5 py-1 text-[#1C1917] font-medium"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          {algoMode === 'DIJKSTRA' && (
            <div>
              <label className="text-[#78716C] font-mono mr-1.5">Target:</label>
              <select
                value={targetNodeId}
                onChange={(e) => setTargetNodeId(e.target.value)}
                className="bg-white border border-[#D6D3D1] rounded px-2.5 py-1 text-[#1C1917] font-medium"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Visual SVG Map & Algorithmic Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Network Stage (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E7E1D8]">
            <div>
              <h2 className="text-base font-bold text-[#1C1917]">
                District Transmission Graph &amp; Travel Corridors
              </h2>
              <div className="text-xs text-[#78716C]">
                Nodes = Districts · Edges = Highway / Commuter Transit Volumes
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-[#991B1B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5221F] inline-block" /> Severe Surge
              </span>
              <span className="flex items-center gap-1 text-[#C2410C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] inline-block" /> Active Path
              </span>
            </div>
          </div>

          {/* SVG Map Canvas in Warm Cartographic Atlas Paper Tone */}
          <div className="relative bg-[#FAF7F2] rounded p-2 overflow-hidden border border-[#E7E1D8]">
            <svg viewBox="0 0 680 480" className="w-full h-80 sm:h-96">
              {/* Subtle Warm Grid Lines */}
              <defs>
                <pattern id="grid-warm" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E7E1D8" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-warm)" />

              {/* Edge lines */}
              {connections.map((edge) => {
                const nodeA = regions.find((r) => r.id === edge.from)!;
                const nodeB = regions.find((r) => r.id === edge.to)!;
                if (!nodeA || !nodeB) return null;

                const isPathEdge =
                  algoMode === 'DIJKSTRA' &&
                  dijkstraResult?.path &&
                  dijkstraResult.path.includes(edge.from) &&
                  dijkstraResult.path.includes(edge.to) &&
                  Math.abs(
                    dijkstraResult.path.indexOf(edge.from) - dijkstraResult.path.indexOf(edge.to)
                  ) === 1;

                const strokeColor = isPathEdge
                  ? '#C2410C'
                  : edge.dailyTravelVolume > 80000
                  ? '#A8A29E'
                  : '#D6D3D1';

                const strokeWidth = isPathEdge ? 4 : edge.dailyTravelVolume > 80000 ? 2.5 : 1.5;

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={nodeA.coordinates.x}
                      y1={nodeA.coordinates.y}
                      x2={nodeB.coordinates.x}
                      y2={nodeB.coordinates.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isPathEdge ? undefined : '3 2'}
                    />
                    {/* Midpoint Travel Volume Badge */}
                    <text
                      x={(nodeA.coordinates.x + nodeB.coordinates.x) / 2}
                      y={(nodeA.coordinates.y + nodeB.coordinates.y) / 2 - 4}
                      fill="#78716C"
                      className="text-[8px] font-mono font-medium"
                      textAnchor="middle"
                    >
                      {edge.distanceKm}km ({(edge.dailyTravelVolume / 1000).toFixed(0)}k/d)
                    </text>
                  </g>
                );
              })}

              {/* Node Circles */}
              {regions.map((reg) => {
                const isSelected = reg.id === selectedRegionId;
                const isSource = reg.id === sourceNodeId;
                const isTarget = reg.id === targetNodeId && algoMode === 'DIJKSTRA';
                const nodeColor = getNodeColor(reg.id);
                const regAlert = alerts.find((a) => a.regionId === reg.id);

                return (
                  <g
                    key={reg.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedRegionId(reg.id)}
                  >
                    {/* Outer halo */}
                    {(isSelected || isSource || isTarget) && (
                      <circle
                        cx={reg.coordinates.x}
                        cy={reg.coordinates.y}
                        r="24"
                        fill="none"
                        stroke={isSource ? '#15803D' : isTarget ? '#D97706' : '#C2410C'}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    )}

                    <circle
                      cx={reg.coordinates.x}
                      cy={reg.coordinates.y}
                      r="16"
                      fill={nodeColor}
                      stroke="#FAF7F2"
                      strokeWidth="2.5"
                    />

                    <text
                      x={reg.coordinates.x}
                      y={reg.coordinates.y + 4}
                      fill="#FFFFFF"
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold"
                    >
                      {reg.code}
                    </text>

                    {/* Node label */}
                    <text
                      x={reg.coordinates.x}
                      y={reg.coordinates.y + 28}
                      fill="#1C1917"
                      textAnchor="middle"
                      className="text-[10px] font-semibold"
                    >
                      {reg.name}
                    </text>

                    {regAlert && regAlert.severity >= 3 && (
                      <text
                        x={reg.coordinates.x}
                        y={reg.coordinates.y - 20}
                        fill="#C5221F"
                        textAnchor="middle"
                        className="text-[8px] font-mono font-bold"
                      >
                        ● SEV {regAlert.severity}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#78716C]">
            <span>Click any node to focus region properties</span>
            <span className="font-mono">
              Graph V={regions.length}, E={connections.length} (Adjacency List)
            </span>
          </div>
        </div>

        {/* Right Output: Algorithm Results and Explanations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dijkstra Result Box */}
          {algoMode === 'DIJKSTRA' && (
            <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E7E1D8]">
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Dijkstra: Weighted Spread Path
                </h3>
                <span className="text-[10px] font-mono bg-[#FFEDD5] text-[#9A3412] px-2 py-0.5 rounded border border-[#FED7AA]">
                  O((V + E) log V)
                </span>
              </div>

              <p className="text-xs text-[#57534E] mb-3">
                Calculates fastest transmission corridor factoring edge distance inversely weighted by
                daily commuter volume (weight = (dist × 150) / (commuters / 1000 + 1)).
              </p>

              {dijkstraResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FFEDD5]/50 border border-[#FED7AA] rounded text-xs font-mono">
                    <div className="text-[#9A3412] font-semibold mb-1">
                      Computed Fastest Spread Corridor:
                    </div>
                    <div className="text-[#C2410C] font-bold text-sm">
                      {dijkstraResult.steps.map((s) => s.regionName).join(' → ')}
                    </div>
                    <div className="text-[10px] text-[#B45309] mt-1">
                      Transmission Resistance Metric: {dijkstraResult.totalTransmissionCost} (Lower = Faster Spread)
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-medium text-[#44403C]">Step-by-Step Path Accumulation:</div>
                    {dijkstraResult.steps.map((st, i) => (
                      <div
                        key={st.regionId}
                        className="flex items-center justify-between p-2 bg-[#FBF9F5] border border-[#E7E1D8] rounded font-mono text-[11px]"
                      >
                        <span className="text-[#1C1917] font-medium">
                          Step {i + 1}: {st.regionName}
                        </span>
                        <span className="text-[#78716C]">Cost: {st.cumulativeCost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#78716C] py-4 text-center">
                  Select valid endpoints and click "Dijkstra"
                </div>
              )}
            </div>
          )}

          {/* BFS / DFS Result Box */}
          {(algoMode === 'BFS' || algoMode === 'DFS') && (
            <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E7E1D8]">
                <h3 className="text-sm font-bold text-[#1C1917]">
                  {algoMode === 'BFS' ? 'BFS Level-Order Expansion' : 'DFS Depth Exploration'}
                </h3>
                <span className="text-[10px] font-mono bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A]">
                  O(V + E)
                </span>
              </div>

              <p className="text-xs text-[#57534E] mb-3">
                {algoMode === 'BFS'
                  ? 'Traverses adjacent regions layer by layer to identify the nearest reachable containment perimeter.'
                  : 'Backtracks deep into transmission corridors to test isolation boundaries.'}
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {traversalResult.map((step) => (
                  <div
                    key={step.nodeId}
                    className="flex items-center justify-between p-2 bg-[#FBF9F5] border border-[#E7E1D8] rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#78716C] text-[11px]">
                        #{step.visitedOrder}
                      </span>
                      <span className="font-semibold text-[#1C1917]">{step.nodeName}</span>
                    </div>
                    <span className="font-mono text-[#78716C] text-[11px]">
                      Distance: {step.distanceFromSource} hop{step.distanceFromSource !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Union-Find Outbreak Cluster Box (Planned Enhancement #5) */}
          {algoMode === 'UNION_FIND' && (
            <div className="p-5 bg-white border border-[#E7E1D8] rounded shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E7E1D8]">
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Union-Find Outbreak Cluster Identification
                </h3>
                <span className="text-[10px] font-mono bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A]">
                  O(α(N)) Disjoint Set
                </span>
              </div>

              <p className="text-xs text-[#57534E] mb-3">
                Merges interconnected infected districts into cohesive, named epidemiological clusters for unified quarantine governance.
              </p>

              <div className="space-y-3">
                {Array.from(ufClusters.entries()).map(([rootId, memberIds], idx) => {
                  const rootNode = regions.find((r) => r.id === rootId);
                  const memberNodes = memberIds.map((id) => regions.find((r) => r.id === id)!);
                  const totalPop = memberNodes.reduce((acc, curr) => acc + curr.population, 0);

                  return (
                    <div
                      key={rootId}
                      className="p-3.5 bg-[#FAF7F2] border border-[#E7E1D8] rounded text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#1C1917] text-sm">
                          Cluster {idx + 1} — {memberIds.length} Connected Sectors
                        </span>
                        <span className="font-mono text-[10px] bg-[#C2410C] text-white px-2 py-0.5 rounded font-semibold">
                          Epicenter: {rootNode?.name}
                        </span>
                      </div>

                      <div className="text-[#44403C] mb-2 font-mono text-[11px]">
                        <strong className="text-[#1C1917]">Contagion Chain:</strong> {memberNodes.map((m) => m.name).join(' ↔ ')}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#78716C] font-mono">
                        <span>Combined Population: {(totalPop / 1000).toFixed(0)}k</span>
                        <span className="text-[#C5221F] font-bold">Quarantine Perimeter Active</span>
                      </div>
                    </div>
                  );
                })}

                {ufClusters.size === 0 && (
                  <div className="text-xs text-[#78716C] text-center py-4">
                    No active multi-district infected clusters detected at current thresholds.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
