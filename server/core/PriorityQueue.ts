import { AurionEvent } from '../core/EventBus';

export interface Task {
  id: string;
  event: AurionEvent;
  priority: number;
  timestamp: number;
}

export class PriorityQueue {
  private queue: Task[] = [];

  enqueue(task: Task) {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
  }

  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}
