///<reference path="../globals.ts" />


// Representation of a Process Control Blocks
module TSOS {
    export class ProcessControlBlock {

        // Initializes all fields
        constructor(public pid: number            = 0,
                    public programCounter: number = 0,
                    public acc: number            = 0,
                    public x: number              = 0,
                    public y: number              = 0,
                    public z: number              = 0,
                    public memoryBase: number     = 0,
                    public memoryLimit: number    = 256,
                    public state: string          = PROCESS_NEW,
                    public turnaroundTime: number = 0,
                    public waitTime: number       = 0
        ) {


        }

        public init(): void {
            this.pid         = _ResidentList.length - 1;
            this.memoryBase  = _MemoryManager.base;
            this.memoryLimit = _MemoryManager.limit;
        }
    }
}