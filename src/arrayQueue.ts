export interface Queue<E> {
    offer: (element: E) => void;
    poll: () => E;
    peek: () => E;
    size: () => number;
    isEmpty: () => boolean;
    toArray: () => E[]
}

/**
 * Queue implementation of a queue...
 * TODO: create a faster implementation where poll is not O(n) operation!
 */
export class ArrayQueue<E> implements Queue<E>{

    private readonly array: E[];

    constructor() {
        this.array = [];
    }

    offer(element: E) {
        this.array.push(element);
    }

    poll(): E {
        return this.array.shift();
    }

    peek(): E {
        return this.array[0];
    }

    size(): number {
        return this.array.length;
    }

    isEmpty(): boolean {
        return this.size() <= 0;
    }

    toArray() {
        return [...this.array];
    }

}