export class Queue<E> {

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