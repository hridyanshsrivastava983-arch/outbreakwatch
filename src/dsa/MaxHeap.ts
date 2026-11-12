/**
 * Generic Binary Max-Heap (Priority Queue).
 * Maintains maximum element at index 0.
 * Operations:
 * - Insert: O(log N)
 * - ExtractMax: O(log N)
 * - Peek: O(1)
 * - BuildHeap: O(N)
 */
export class MaxHeap<T> {
  private heap: T[] = [];
  private getScore: (item: T) => number;

  constructor(scoreExtractor: (item: T) => number, initialItems?: T[]) {
    this.getScore = scoreExtractor;
    if (initialItems && initialItems.length > 0) {
      this.heap = [...initialItems];
      this.buildHeap();
    }
  }

  insert(item: T): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  extractMax(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return max;
  }

  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  toArray(): T[] {
    return [...this.heap];
  }

  /**
   * Returns items in sorted descending order (Heapsort: O(N log N))
   */
  getSortedDesc(): T[] {
    const copy = new MaxHeap<T>(this.getScore, this.heap);
    const sorted: T[] = [];
    while (!copy.isEmpty()) {
      sorted.push(copy.extractMax()!);
    }
    return sorted;
  }

  private buildHeap(): void {
    const lastParentIndex = Math.floor(this.heap.length / 2) - 1;
    for (let i = lastParentIndex; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.getScore(this.heap[current]) > this.getScore(this.heap[parent])) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      const leftChild = 2 * current + 1;
      const rightChild = 2 * current + 2;
      let largest = current;

      if (
        leftChild < length &&
        this.getScore(this.heap[leftChild]) > this.getScore(this.heap[largest])
      ) {
        largest = leftChild;
      }

      if (
        rightChild < length &&
        this.getScore(this.heap[rightChild]) > this.getScore(this.heap[largest])
      ) {
        largest = rightChild;
      }

      if (largest !== current) {
        this.swap(current, largest);
        current = largest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  clear(): void {
    this.heap = [];
  }
}
