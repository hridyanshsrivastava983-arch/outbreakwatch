/**
 * Double-Ended Queue (Deque) providing O(1) push and pop at both front and back.
 * Used for maintaining fixed-size sliding windows of historical daily counts
 * for moving-average, variance, and z-score anomaly trend calculations.
 */
export class Deque<T> {
  private items: { [key: number]: T } = {};
  private frontIndex: number = 0;
  private backIndex: number = 0;

  pushBack(item: T): void {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }

  pushFront(item: T): void {
    this.frontIndex--;
    this.items[this.frontIndex] = item;
  }

  popFront(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  popBack(): T | undefined {
    if (this.isEmpty()) return undefined;
    this.backIndex--;
    const item = this.items[this.backIndex];
    delete this.items[this.backIndex];
    return item;
  }

  peekFront(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.frontIndex];
  }

  peekBack(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.backIndex - 1];
  }

  size(): number {
    return this.backIndex - this.frontIndex;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      result.push(this.items[i]);
    }
    return result;
  }

  clear(): void {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
}
