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

        // Update the host with the current values of the PCB
        public updateHostDisplay(op): void {
            document.getElementById('pid-pcb').innerHTML   = this.pid.toString();
            document.getElementById('state-pcb').innerHTML = this.state.toString();
            document.getElementById('pc-pcb').innerHTML    = this.programCounter.toString();
            document.getElementById('acc-pcb').innerHTML   = this.acc.toString();
            document.getElementById('x-pcb').innerHTML     = this.x.toString();
            document.getElementById('y-pcb').innerHTML     = this.y.toString();
            document.getElementById('z-pcb').innerHTML     = this.z.toString();
            document.getElementById('ir-pcb').innerHTML    = op;
            document.getElementById('turn-pcb').innerHTML  = this.turnaroundTime.toString();
            document.getElementById('wait-pcb').innerHTML  = this.waitTime.toString();
        }

    }
}