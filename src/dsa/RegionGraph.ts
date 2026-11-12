import { RegionNode, RegionEdge } from '../types/epidemiology';
import { UnionFind } from './UnionFind';

export interface GraphTraversalStep {
  nodeId: string;
  nodeName: string;
  distanceFromSource: number;
  visitedOrder: number;
}

export interface DijkstraResult {
  path: string[];
  totalTransmissionCost: number;
  steps: Array<{
    regionId: string;
    regionName: string;
    cumulativeCost: number;
  }>;
}

/**
 * Adjacency List Graph for Regional Transmission Modeling.
 * Supports:
 * - BFS: Shortest hop spread path to uninfected or high-risk nodes
 * - DFS: Full regional cluster traversal and containment boundary detection
 * - Dijkstra: Fastest transmission path factoring in daily commuter/travel volume
 * - Union-Find clustering of interconnected outbreak regions
 */
export class RegionGraph {
  private nodes: Map<string, RegionNode> = new Map();
  private adjacencyList: Map<string, Array<{ to: string; edge: RegionEdge }>> = new Map();

  addRegion(region: RegionNode): void {
    this.nodes.set(region.id, region);
    if (!this.adjacencyList.has(region.id)) {
      this.adjacencyList.set(region.id, []);
    }
  }

  addConnection(edge: RegionEdge): void {
    if (!this.adjacencyList.has(edge.from)) {
      this.adjacencyList.set(edge.from, []);
    }
    if (!this.adjacencyList.has(edge.to)) {
      this.adjacencyList.set(edge.to, []);
    }

    // Bidirectional travel corridor
    this.adjacencyList.get(edge.from)!.push({ to: edge.to, edge });
    this.adjacencyList.get(edge.to)!.push({
      to: edge.from,
      edge: {
        from: edge.to,
        to: edge.from,
        distanceKm: edge.distanceKm,
        dailyTravelVolume: edge.dailyTravelVolume,
        transmissionWeight: edge.transmissionWeight,
      },
    });
  }

  getNode(id: string): RegionNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): RegionNode[] {
    return Array.from(this.nodes.values());
  }

  getNeighbors(id: string): Array<{ to: string; edge: RegionEdge }> {
    return this.adjacencyList.get(id) || [];
  }

  /**
   * Breadth-First Search (BFS):
   * Traverses region graph layer by layer to find the nearest reachable
   * high-risk or affected region.
   */
  bfs(startId: string): GraphTraversalStep[] {
    if (!this.nodes.has(startId)) return [];

    const visited = new Set<string>();
    const queue: Array<{ id: string; distance: number }> = [{ id: startId, distance: 0 }];
    visited.add(startId);

    const traversal: GraphTraversalStep[] = [];
    let order = 1;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = this.nodes.get(current.id)!;

      traversal.push({
        nodeId: current.id,
        nodeName: node.name,
        distanceFromSource: current.distance,
        visitedOrder: order++,
      });

      const neighbors = this.adjacencyList.get(current.id) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.to)) {
          visited.add(neighbor.to);
          queue.push({
            id: neighbor.to,
            distance: current.distance + 1,
          });
        }
      }
    }

    return traversal;
  }

  /**
   * Depth-First Search (DFS):
   * Systematic traversal exploring the maximum reachable depth
   * of a transmission corridor before backtracking.
   */
  dfs(startId: string): GraphTraversalStep[] {
    if (!this.nodes.has(startId)) return [];

    const visited = new Set<string>();
    const traversal: GraphTraversalStep[] = [];
    let order = 1;

    const dfsRecursive = (currentId: string, depth: number) => {
      visited.add(currentId);
      const node = this.nodes.get(currentId)!;

      traversal.push({
        nodeId: currentId,
        nodeName: node.name,
        distanceFromSource: depth,
        visitedOrder: order++,
      });

      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.to)) {
          dfsRecursive(neighbor.to, depth + 1);
        }
      }
    };

    dfsRecursive(startId, 0);
    return traversal;
  }

  /**
   * Dijkstra's Algorithm:
   * Finds the path of minimum resistance / fastest transmission spread
   * between source and destination regions.
   * Weight = (distanceKm * 100) / (dailyTravelVolume + 100)
   * High travel volume makes effective transmission cost lower (faster contagion).
   */
  dijkstra(startId: string, targetId: string): DijkstraResult | null {
    if (!this.nodes.has(startId) || !this.nodes.has(targetId)) return null;

    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
      unvisited.add(nodeId);
    }

    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentId: string | null = null;
      let minDistance = Infinity;

      for (const id of unvisited) {
        const dist = distances.get(id)!;
        if (dist < minDistance) {
          minDistance = dist;
          currentId = id;
        }
      }

      if (currentId === null || minDistance === Infinity) break;
      if (currentId === targetId) break;

      unvisited.delete(currentId);

      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const { to, edge } of neighbors) {
        if (!unvisited.has(to)) continue;

        // Effective transmission risk score weight (lower = faster transmission)
        const weight = Math.round(
          (edge.distanceKm * 150) / (edge.dailyTravelVolume / 1000 + 1)
        );
        const alt = distances.get(currentId)! + weight;

        if (alt < distances.get(to)!) {
          distances.set(to, alt);
          previous.set(to, currentId);
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | null = targetId;

    if (distances.get(targetId) === Infinity) {
      return null; // Unreachable
    }

    while (curr !== null) {
      path.unshift(curr);
      curr = previous.get(curr) || null;
    }

    const steps = path.map((id) => ({
      regionId: id,
      regionName: this.nodes.get(id)?.name || id,
      cumulativeCost: distances.get(id) || 0,
    }));

    return {
      path,
      totalTransmissionCost: distances.get(targetId) || 0,
      steps,
    };
  }

  /**
   * Connects infected or high-risk regions into Disjoint Sets (Union-Find)
   * to discover named outbreak clusters.
   */
  computeOutbreakClusters(activeInfectedRegions: Set<string>): Map<string, string[]> {
    const uf = new UnionFind(Array.from(this.nodes.keys()));

    // For every edge, if both endpoints are infected, union them
    for (const [from, neighbors] of this.adjacencyList.entries()) {
      if (!activeInfectedRegions.has(from)) continue;

      for (const { to } of neighbors) {
        if (activeInfectedRegions.has(to)) {
          uf.union(from, to);
        }
      }
    }

    const allClusters = uf.getClusters();
    const infectedClusters = new Map<string, string[]>();

    for (const [root, members] of allClusters.entries()) {
      const activeMembers = members.filter((m) => activeInfectedRegions.has(m));
      if (activeMembers.length > 0) {
        infectedClusters.set(root, activeMembers);
      }
    }

    return infectedClusters;
  }
}
