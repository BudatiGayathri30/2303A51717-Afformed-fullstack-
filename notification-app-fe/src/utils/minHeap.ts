import { logger } from '../shared/logger/logger';

export class MinHeap<T> {
  private readonly items: T[] = [];

  constructor(private readonly compare: (left: T, right: T) => number) {
    logger.debug('utils', 'MinHeap initialized');
  }

  insert(value: T): void {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
    logger.debug('utils', 'MinHeap insert completed');
  }

  extractMin(): T | undefined {
    if (this.items.length === 0) {
      logger.debug('utils', 'MinHeap extractMin on empty heap');
      return undefined;
    }

    if (this.items.length === 1) {
      logger.debug('utils', 'MinHeap extractMin completed');
      return this.items.pop();
    }

    const minimum = this.items[0];
    const tail = this.items.pop();

    if (tail !== undefined) {
      this.items[0] = tail;
      this.bubbleDown(0);
    }

    logger.debug('utils', 'MinHeap extractMin completed');
    return minimum;
  }

  peek(): T | undefined {
    logger.debug('utils', 'MinHeap peek requested');
    return this.items[0];
  }

  size(): number {
    logger.debug('utils', 'MinHeap size requested');
    return this.items.length;
  }

  private bubbleUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.compare(this.items[currentIndex], this.items[parentIndex]) >= 0) {
        break;
      }

      [this.items[currentIndex], this.items[parentIndex]] = [this.items[parentIndex], this.items[currentIndex]];
      currentIndex = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    let currentIndex = index;

    while (true) {
      const leftIndex = currentIndex * 2 + 1;
      const rightIndex = currentIndex * 2 + 2;
      let smallestIndex = currentIndex;

      if (leftIndex < this.items.length && this.compare(this.items[leftIndex], this.items[smallestIndex]) < 0) {
        smallestIndex = leftIndex;
      }

      if (rightIndex < this.items.length && this.compare(this.items[rightIndex], this.items[smallestIndex]) < 0) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      [this.items[currentIndex], this.items[smallestIndex]] = [this.items[smallestIndex], this.items[currentIndex]];
      currentIndex = smallestIndex;
    }
  }
}
