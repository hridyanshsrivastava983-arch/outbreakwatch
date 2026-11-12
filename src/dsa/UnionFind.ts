/**
 * Disjoint Set Union (Union-Find) with:
 * - Path Compression in find() -> O(α(N)) nearly O(1)
 * - Union by Rank
 * Used for grouping geographically connected outbreak regions into
 * unified, trackable outbreak clusters (e.g., "Cluster #1", "Cluster #2").
 */
export class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();
  private clusterCount: number = 0;

  constructor(elements: string[] = []) {
    for (const el of elements) {
      this.makeSet(el);
    }
  }

  makeSet(element: string): void {
    if (!this.parent.has(element)) {
      this.parent.set(element, element);
      this.rank.set(element, 0);
      this.clusterCount++;
    }
  }

  /**
   * Find with Path Compression
   */
  find(element: string): string {
    if (!this.parent.has(element)) {
      this.makeSet(element);
      return element;
    }

    const p = this.parent.get(element)!;
    if (p !== element) {
      const root = this.find(p);
      this.parent.set(element, root);
      return root;
    }
    return p;
  }

  /**
   * Union by Rank
   */
  union(a: string, b: string): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) {
      return false; // Already in same cluster
    }

    const rankA = this.rank.get(rootA) || 0;
    const rankB = this.rank.get(rootB) || 0;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }

    this.clusterCount--;
    return true;
  }

  connected(a: string, b: string): boolean {
    return this.find(a) === this.find(b);
  }

  /**
   * Returns a map of root element -> array of elements in that cluster
   */
  getClusters(): Map<string, string[]> {
    const clusters = new Map<string, string[]>();

    for (const key of this.parent.keys()) {
      const root = this.find(key);
      const list = clusters.get(root) || [];
      list.push(key);
      clusters.set(root, list);
    }

    return clusters;
  }

  getClusterCount(): number {
    return this.clusterCount;
  }

  reset(elements: string[] = []): void {
    this.parent.clear();
    this.rank.clear();
    this.clusterCount = 0;
    for (const el of elements) {
      this.makeSet(el);
    }
  }
}
