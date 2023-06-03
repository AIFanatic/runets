export class Deque<T> {
    private data: T[];
    private front;
    private back;
    public size: number;

    constructor() {
        this.data = []; // Or Array, but that really does not add anything useful
        this.front = 0;
        this.back = 1;
        this.size = 0;
    }
    
    public addFront(value: T) {
        if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
        this.size++;
        this.front = (this.front + 1) % Number.MAX_SAFE_INTEGER;
        this.data[this.front] = value;
    }

    public removeFront(): T {
        if (!this.size) return;
        let value = this.peekFront();
        this.size--;
        delete this.data[this.front];
        this.front = (this.front || Number.MAX_SAFE_INTEGER) - 1;
        return value;
    }
    
    public peekFront(): T { 
        if (this.size) return this.data[this.front];
    }

    public addBack(value: T) {
        if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
        this.size++;
        this.back = (this.back || Number.MAX_SAFE_INTEGER) - 1;
        this.data[this.back] = value;
    }

    public removeBack(): T {
        if (!this.size) return;
        let value = this.peekBack();
        this.size--;
        delete this.data[this.back];
        this.back = (this.back + 1) % Number.MAX_SAFE_INTEGER;
        return value;
    }

    public peekBack(): T {
        if (this.size) return this.data[this.back];
    }

    public poll(): T {
        return this.removeFront()
    }

    public clear() {
        this.data = []; // Or Array, but that really does not add anything useful
        this.front = 0;
        this.back = 1;
        this.size = 0;
    }

    public add(value: T) {
        this.addBack(value);
    }
}