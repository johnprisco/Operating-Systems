module TSOS {
    export class ProcessControlBlock {
        constructor(public pid = null,
                    public pc  = null,
                    public acc = null,
                    public x   = null,
                    public y   = null,
                    public z   = null,
                    public ir  = null) {

        }

        public init(): void {
            this.pid = _PCBArray.length - 1;
            this.pc  = 0;
            this.acc = 0;
            this.x   = 0;
            this.y   = 0;
            this.z   = 0;
            this.ir  = "";
        }
    }
}