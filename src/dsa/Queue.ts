/**
 * Generic FIFO Queue implemented with array pointers for O(1) amortized enqueue and dequeue.
 * Used for processing incoming disease case reports in exact arrival order.
 */
export class Queue<T> {
  private items: T[] = [];
  private head: number = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    this.head++;

    // Periodic memory cleanup when head grows large
    if (this.head > 500 && this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.head];
  }

  size(): number {
    return this.items.length - this.head;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  toArray(): T[] {
    return this.items.slice(this.head);
  }

  clear(): void {
    this.items = [];
    this.head = 0;
  }
}
