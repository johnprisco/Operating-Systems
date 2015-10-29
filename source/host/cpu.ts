///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number           = 0,
                    public Acc: number          = 0,
                    public Xreg: number         = 0,
                    public Yreg: number         = 0,
                    public Zflag: number        = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

        }

        public getByte() {
            return _MemoryManager.memory.memoryBlock[this.PC + 1];
        }

        public getNextByte() {
            return _MemoryManager.memory.memoryBlock[this.PC + 2];
        }

        public fetch(): void {

        }

        public loadAccumulatorWithConstant(): void {
            this.Acc = this.getByte();
            this.PC += 1;
        }

        public loadAccumulatorFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte);
            this.Acc = _MemoryManager.memory.memoryBlock[address];
            this.PC += 2;
        }

        public storeAccumulatorInMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.memory.memoryBlock[address] = this.Acc;
            this.PC += 2;
        }

        public compareByte(): void {

        }

        public addWithCarry(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc += parseInt(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        }

        public loadXWithConstant(): void {
            this.Xreg = this.getByte();
            this.PC += 1;
        }

        public loadXFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Xreg = Utils.hexToDecimal(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        }

        public loadYWithConstant(): void {
            this.Yreg = this.getByte();
            this.PC += 1;
        }

        public loadYFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Yreg = Utils.hexToDecimal(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        }

        public noOperation(): void {
            // Nothing to execute
        }

        public breakOperation(): void {

        }

        public branchBytes(): void {
            if (this.Zflag == 0) {
                var byte = Utils.hexToDecimal(this.getByte());
                this.PC += Utils.hexToDecimal(byte) + 1;

                if (this.PC > 256) {
                    this.PC = (this.PC + byte);
                } else {
                    this.PC += byte;
                }
            }
        }

        public incrementByte(): void {
        }

        public syscall(): void {

        }

        public executeOperation(code): void {
            switch (code) {
                case "A9":
                    break;
                case "AD":
                    break;
                case "8D":
                    break;
                case "6D":
                    break;
                case "A2":
                    break;
                case "AE":
                    break;
                case "A0":
                    break;
                case "AC":
                    break;
                case "EA":
                    break;
                case "00":
                    break;
                case "EC":
                    break;
                case "D0":
                    break;
                case "EE":
                    break;
                case "FF":
                    break;
                default:
                    _StdOut.putText("The following code is undefined: " + code);
            }
        }
    }
}
