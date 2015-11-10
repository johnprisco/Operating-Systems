///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/*   ------------
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
        /**
         * Updates the CPU display in the host with the current CPU information
         * @param op: operation being executed
         */
        Cpu.prototype.updateHostDisplay = function (op) {
            document.getElementById('pc-cpu').innerHTML = this.PC.toString();
            document.getElementById('acc-cpu').innerHTML = this.Acc.toString();
            document.getElementById('x-cpu').innerHTML = this.Xreg.toString();
            document.getElementById('y-cpu').innerHTML = this.Yreg.toString();
            document.getElementById('z-cpu').innerHTML = this.Zflag.toString();
            document.getElementById('ir-cpu').innerHTML = op;
        };
        /**
         * Set the attributes of the specified pcb with the current CPU attributes
         * @param pcb: the PCB we are updating
         */
        Cpu.prototype.updatePCB = function (pcb) {
            pcb.programCounter = this.PC;
            pcb.acc = this.Acc;
            pcb.x = this.Xreg;
            pcb.y = this.Yreg;
            pcb.z = this.Zflag;
        };
        Cpu.prototype.setToPCB = function (pcb) {
            this.PC = pcb.programCounter;
            this.Acc = pcb.acc;
            this.Xreg = pcb.x;
            this.Yreg = pcb.y;
            this.Zflag = pcb.z;
        };
        /**
         * Cycle the CPU to perform operations.
         */
        Cpu.prototype.cycle = function () {
            TSOS.Utils.trackTime();
            var op = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC);
            this.executeOperation(op);
            _MemoryManager.updateHostDisplay();
            this.updateHostDisplay(op);
            if (_CpuScheduler.algorithm = ROUND_ROBIN) {
                _CpuScheduler.quantumCounter++;
            }
            _Kernel.krnTrace('CPU cycle');
            console.log("Current PID: " + _CurrentPCB.pid);
        };
        /**
         * Returns the next byte in memory
         */
        Cpu.prototype.getByte = function () {
            return _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC + 1);
        };
        /**
         *
         * @returns second to next byte in memory
         */
        Cpu.prototype.getNextByte = function () {
            return _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC + 2);
        };
        /**
         * Loads accumulator with the next byte in memory, converted to decimal
         */
        Cpu.prototype.loadAccumulatorWithConstant = function () {
            this.Acc = TSOS.Utils.hexToDecimal(this.getByte());
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Loads the accumulator with what is stored at the address of the next two bytes in memory
         */
        Cpu.prototype.loadAccumulatorFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address);
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Stores the accumulator at the address specified by the next two bytes
         */
        Cpu.prototype.storeAccumulatorInMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.setMemoryAt(_CurrentPCB.memoryBase + address, this.Acc.toString(16));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Updates the Zflag if the X register if equal to the next two bytes in memory
         */
        Cpu.prototype.compareByte = function () {
            var memory = TSOS.Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + TSOS.Utils.hexToDecimal(this.getByte())));
            this.Zflag = (memory === this.Xreg) ? 1 : 0;
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Increase the accumulator by the value stored in the address specified by the next two bytes
         */
        Cpu.prototype.addWithCarry = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc += TSOS.Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Set X register to the value of the next byte
         */
        Cpu.prototype.loadXWithConstant = function () {
            this.Xreg = TSOS.Utils.hexToDecimal(this.getByte());
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Set X register to the value stored at the address specified by the next two bytes
         */
        Cpu.prototype.loadXFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Xreg = TSOS.Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Set Y register to the value of the next byte
         */
        Cpu.prototype.loadYWithConstant = function () {
            this.Yreg = TSOS.Utils.hexToDecimal(this.getByte());
            console.log("loadYWithConstant Yreg: " + this.Yreg);
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Set Y register to the value stored at the address specified by the next two bytes
         */
        Cpu.prototype.loadYFromMemory = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Yreg = TSOS.Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            console.log("loadYFromMemory Yreg: " + this.Yreg);
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Move along, nothing to see here, you don't have to go home, but you have to get out of here
         */
        Cpu.prototype.noOperation = function () {
            // Nothing to execute
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Update the current PCB and set isExecuting to false
         */
        Cpu.prototype.breakOperation = function () {
            _CurrentPCB.state = PROCESS_TERMINATED;
            console.log("PID " + _CurrentPCB.pid + " terminated with turnaround time " + _CurrentPCB.turnaroundTime + " and wait time " + _CurrentPCB.waitTime);
            this.updatePCB(_CurrentPCB);
            _CurrentPCB.updateHostDisplay("00");
            this.isExecuting = false;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
        };
        /**
         * Moving the program counter as specified by the next byte, if the Z flag is zero
         */
        Cpu.prototype.branchBytes = function () {
            console.log("Program Counter before branchBytes(): " + this.PC);
            if (this.Zflag == 0) {
                var byte = this.getByte();
                console.log("Getting byte: " + byte);
                console.log("Byte as Decimal: " + TSOS.Utils.hexToDecimal(byte));
                if ((this.PC + TSOS.Utils.hexToDecimal(byte)) >= 256) {
                    console.log("Branch greater.");
                    this.PC += TSOS.Utils.hexToDecimal(byte) - 256;
                }
                else {
                    console.log("Branch else.");
                    this.PC += TSOS.Utils.hexToDecimal(byte);
                }
            }
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
            console.log("Program Counter after branchBytes(): " + this.PC);
        };
        /**
         * Incrementing the value stored at the address specified by the next two bytes
         */
        Cpu.prototype.incrementByte = function () {
            var address = TSOS.Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.setMemoryAt(_CurrentPCB.memoryBase + address, (TSOS.Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address)) + 1));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        };
        /**
         * Print to the console what's stored in the Y register or what's stored
         * in memory at the location specified by the Y register
         */
        Cpu.prototype.syscall = function () {
            if (this.Xreg == 1) {
                console.log("Xreg = 1");
                console.log("Should putText: " + TSOS.Utils.hexToDecimal(this.Yreg).toString());
                _StdOut.putText(TSOS.Utils.hexToDecimal(this.Yreg).toString());
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                this.PC += 1;
                _CurrentPCB.updateHostDisplay("00");
                this.updatePCB(_CurrentPCB);
                return;
            }
            if (this.Xreg == 2) {
                console.log("Xreg = 2");
                var str = "";
                var y = this.Yreg;
                console.log("Initial y: " + y);
                var val = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + y);
                console.log("Initial val: " + val);
                while (val != "00") {
                    console.log("Val: " + val);
                    str += String.fromCharCode(TSOS.Utils.hexToDecimal(val));
                    y += 1;
                    val = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + y);
                    console.log("str: " + str);
                }
                console.log("Should put text: " + str);
                //console.log("Should putText: " + str);
                _StdOut.putText(str);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                this.PC += 1;
                _CurrentPCB.updateHostDisplay("00");
                this.updatePCB(_CurrentPCB);
                return;
            }
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSCALL_IRQ, ""));
        };
        /**
         * Translating the code to the correct method to execute
         * @param code: the operation to be executed
         */
        Cpu.prototype.executeOperation = function (code) {
            console.log("Current Program Counter: " + this.PC);
            console.log("Executing operation: " + code);
            switch (code) {
                case "A9":
                    this.loadAccumulatorWithConstant();
                    break;
                case "AD":
                    this.loadAccumulatorFromMemory();
                    break;
                case "8D":
                    this.storeAccumulatorInMemory();
                    break;
                case "6D":
                    this.addWithCarry();
                    break;
                case "A2":
                    this.loadXWithConstant();
                    break;
                case "AE":
                    this.loadXFromMemory();
                    break;
                case "A0":
                    this.loadYWithConstant();
                    break;
                case "AC":
                    this.loadYFromMemory();
                    break;
                case "EA":
                    this.noOperation();
                    break;
                case "00":
                    this.breakOperation();
                    break;
                case "EC":
                    this.compareByte();
                    break;
                case "D0":
                    this.branchBytes();
                    break;
                case "EE":
                    this.incrementByte();
                    break;
                case "FF":
                    this.syscall();
                    break;
                default:
                    console.log("Undefined code: " + code);
                    _StdOut.putText("The following code is undefined: " + code);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.PC += 1;
                    this.updatePCB(_CurrentPCB);
                    break;
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
