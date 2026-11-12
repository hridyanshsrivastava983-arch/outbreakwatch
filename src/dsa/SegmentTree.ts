/**
 * Segment Tree for fast range queries on chronological case counts.
 * Provides:
 * - O(log N) Range Sum Query (e.g. total cases between Day L and Day R)
 * - O(log N) Range Max Query (peak single-day outbreak surge)
 * - O(log N) Point Update (new case arrives on day i)
 * - O(N) Initialization from daily count array
 */
export interface RangeQueryResult {
  sum: number;
  max: number;
  startDay: number;
  endDay: number;
}

export class SegmentTree {
  private treeSum: number[];
  private treeMax: number[];
  private n: number;
  private dates: string[]; // Maps index i -> date string YYYY-MM-DD

  constructor(dailyCounts: number[], dates: string[]) {
    this.n = dailyCounts.length;
    this.dates = [...dates];
    this.treeSum = new Array(4 * this.n).fill(0);
    this.treeMax = new Array(4 * this.n).fill(0);

    if (this.n > 0) {
      this.build(dailyCounts, 0, 0, this.n - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.treeSum[node] = arr[start];
      this.treeMax[node] = arr[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftNode = 2 * node + 1;
    const rightNode = 2 * node + 2;

    this.build(arr, leftNode, start, mid);
    this.build(arr, rightNode, mid + 1, end);

    this.treeSum[node] = this.treeSum[leftNode] + this.treeSum[rightNode];
    this.treeMax[node] = Math.max(this.treeMax[leftNode], this.treeMax[rightNode]);
  }

  /**
   * O(log N) point update: increment cases on index `idx` by `delta`
   */
  update(idx: number, delta: number = 1): void {
    if (idx < 0 || idx >= this.n) return;
    this.updateInternal(0, 0, this.n - 1, idx, delta);
  }

  private updateInternal(
    node: number,
    start: number,
    end: number,
    idx: number,
    delta: number
  ): void {
    if (start === end) {
      this.treeSum[node] += delta;
      this.treeMax[node] += delta;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftNode = 2 * node + 1;
    const rightNode = 2 * node + 2;

    if (idx <= mid) {
      this.updateInternal(leftNode, start, mid, idx, delta);
    } else {
      this.updateInternal(rightNode, mid + 1, end, idx, delta);
    }

    this.treeSum[node] = this.treeSum[leftNode] + this.treeSum[rightNode];
    this.treeMax[node] = Math.max(this.treeMax[leftNode], this.treeMax[rightNode]);
  }

  /**
   * O(log N) range query between day indices [ql, qr]
   */
  query(ql: number, qr: number): RangeQueryResult {
    const clampedL = Math.max(0, ql);
    const clampedR = Math.min(this.n - 1, qr);

    if (clampedL > clampedR || this.n === 0) {
      return { sum: 0, max: 0, startDay: clampedL, endDay: clampedR };
    }

    const { sum, max } = this.queryInternal(0, 0, this.n - 1, clampedL, clampedR);
    return {
      sum,
      max,
      startDay: clampedL,
      endDay: clampedR,
    };
  }

  private queryInternal(
    node: number,
    start: number,
    end: number,
    ql: number,
    qr: number
  ): { sum: number; max: number } {
    // Range completely outside
    if (qr < start || ql > end) {
      return { sum: 0, max: 0 };
    }

    // Range completely inside
    if (ql <= start && end <= qr) {
      return { sum: this.treeSum[node], max: this.treeMax[node] };
    }

    const mid = Math.floor((start + end) / 2);
    const leftResult = this.queryInternal(2 * node + 1, start, mid, ql, qr);
    const rightResult = this.queryInternal(2 * node + 2, mid + 1, end, ql, qr);

    return {
      sum: leftResult.sum + rightResult.sum,
      max: Math.max(leftResult.max, rightResult.max),
    };
  }

  getDates(): string[] {
    return this.dates;
  }

  getDateIndex(dateStr: string): number {
    return this.dates.indexOf(dateStr);
  }
}
