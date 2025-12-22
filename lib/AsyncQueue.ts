export class AsyncQueue<T> {
  private queue: T[] = [];
  private resolveNext: ((value: T) => void) | null = null;
  private nextPromise: Promise<T> | null = null;

  push(item: T): void {
    if (this.resolveNext) {
      this.resolveNext(item);
      this.resolveNext = null;
      this.nextPromise = null;
    } else {
      this.queue.push(item);
    }
  }

  async next(): Promise<T> {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    if (!this.nextPromise) {
      this.nextPromise = new Promise<T>((resolve) => {
        this.resolveNext = resolve;
      });
    }

    return this.nextPromise;
  }
}
