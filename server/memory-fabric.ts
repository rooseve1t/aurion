// memory-fabric.ts

class MemoryFabric {
    private memory: Map<string, any>;

    constructor() {
        this.memory = new Map();
    }

    public set(key: string, value: any): void {
        this.memory.set(key, value);
    }

    public get(key: string): any {
        return this.memory.get(key);
    }

    public delete(key: string): boolean {
        return this.memory.delete(key);
    }

    public clear(): void {
        this.memory.clear();
    }

    public getMemorySnapshot(): object {
        return Object.fromEntries(this.memory);
    }
}

export default MemoryFabric;
