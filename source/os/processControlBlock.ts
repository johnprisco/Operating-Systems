///<reference path="../globals.ts" />


// Representation of a Process Control Blocks
module TSOS {
    export class ProcessControlBlock {
        constructor(public pid: number            = null,
                    public programCounter: number = 0,
                    public acc: number            = 0,
                    public x: number              = 0,
                    public y: number              = 0,
                    public z: number              = 0,
                    public instruction: string    = "") {

        }

        public init(): void {
            this.pid = _PCBArray.length - 1;
        }
    }
}