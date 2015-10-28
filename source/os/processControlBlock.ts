module TSOS {
    export class ProcessControlBlock {
        constructor(public pid: number            = null,
                    public programCounter: number = null,
                    public acc: number            = null,
                    public x: number              = null,
                    public y: number              = null,
                    public z: number              = null,
                    public instruction: string    = null) {

        }

        public init(): void {
            this.pid             = _PCBArray.length - 1;
            this.programCounter  = 0;
            this.acc             = 0;
            this.x               = 0;
            this.y               = 0;
            this.z               = 0;
            this.instruction     = "";
        }
    }
}