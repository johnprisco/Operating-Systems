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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        Cpu.prototype.getByte = function () {
            return _MemoryManager.memory.memoryBlock[this.PC + 1];
        };
        Cpu.prototype.getNextByte = function () {
            return _MemoryManager.memory.memoryBlock[this.PC + 2];
        };
        Cpu.prototype.fetch = function () {
        };
        Cpu.prototype.loadAccumulatorWithConstant = function () {
            this.Acc = this.getByte();
            this.PC += 1;
        };
        Cpu.prototype.loadAccumulatorFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte);
            this.Acc = _MemoryManager.memory.memoryBlock[address];
            this.PC += 2;
        };
        Cpu.prototype.storeAccumulatorInMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.memory.memoryBlock[address] = this.Acc;
            this.PC += 2;
        };
        Cpu.prototype.compareByte = function () {
        };
        Cpu.prototype.addWithCarry = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc += parseInt(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        };
        Cpu.prototype.loadXWithConstant = function () {
            this.Xreg = this.getByte();
            this.PC += 1;
        };
        Cpu.prototype.loadXFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Xreg = TSOS.Utils.hexToDecimal(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        };
        Cpu.prototype.loadYWithConstant = function () {
            this.Yreg = this.getByte();
            this.PC += 1;
        };
        Cpu.prototype.loadYFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Yreg = TSOS.Utils.hexToDecimal(_MemoryManager.memory.memoryBlock[address]);
            this.PC += 2;
        };
        Cpu.prototype.noOperation = function () {
            // Nothing to execute
        };
        Cpu.prototype.breakOperation = function () {
        };
        Cpu.prototype.branchBytes = function () {
            if (this.Zflag == 0) {
                var byte = TSOS.Utils.hexToDecimal(this.getByte());
                this.PC += TSOS.Utils.hexToDecimal(byte) + 1;
                if (this.PC > 256) {
                    this.PC = (this.PC + byte);
                }
                else {
                    this.PC += byte;
                }
            }
        };
        Cpu.prototype.incrementByte = function () {
        };
        Cpu.prototype.syscall = function () {
        };
        Cpu.prototype.executeOperation = function (code) {
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
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
