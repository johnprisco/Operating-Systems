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
            this.PC          = 0;
            this.Acc         = 0;
            this.Xreg        = 0;
            this.Yreg        = 0;
            this.Zflag       = 0;
            this.isExecuting = false;
        }

        /**
         * Updates the CPU display in the host with the current CPU information
         * @param op: operation being executed
         */
        public updateHostDisplay(op: string): void {
            document.getElementById('pc-cpu').innerHTML  = this.PC.toString();
            document.getElementById('acc-cpu').innerHTML = this.Acc.toString();
            document.getElementById('x-cpu').innerHTML   = this.Xreg.toString();
            document.getElementById('y-cpu').innerHTML   = this.Yreg.toString();
            document.getElementById('z-cpu').innerHTML   = this.Zflag.toString();
            document.getElementById('ir-cpu').innerHTML  = op;
        }

        /**
         * Set the attributes of the specified pcb with the current CPU attributes
         * @param pcb: the PCB we are updating
         */
        public updatePCB(pcb): void {
            pcb.programCounter = this.PC;
            pcb.acc            = this.Acc;
            pcb.x              = this.Xreg;
            pcb.y              = this.Yreg;
            pcb.z              = this.Zflag;
        }

        /**
         * Set the attributes of the CPU to those of the PCB in the argument
         * @param pcb: the PCB the CPU will model
         */
        public setToPCB(pcb: ProcessControlBlock) {
            this.PC    = pcb.programCounter;
            this.Acc   = pcb.acc;
            this.Xreg  = pcb.x;
            this.Yreg  = pcb.y;
            this.Zflag = pcb.z;
        }

        /**
         * Cycle the CPU to perform operations.
         */
        public cycle(): void {
            Utils.trackTime();

            var op = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC);
            this.executeOperation(op);

            _MemoryManager.updateHostDisplay();
            this.updateHostDisplay(op);
            Utils.updateReadyQueueDisplay();

            if (_CpuScheduler.algorithm = ROUND_ROBIN) {
                _CpuScheduler.quantumCounter++;
            }

            _Kernel.krnTrace('CPU cycle');
            console.log("Current PID: " + _CurrentPCB.pid);
        }

        /**
         * Returns the next byte in memory
         */
        public getByte() {
            return _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC + 1);
        }

        /**
         *
         * @returns second to next byte in memory
         */
        public getNextByte() {
            return _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + this.PC + 2);
        }

        /**
         * Loads accumulator with the next byte in memory, converted to decimal
         */
        public loadAccumulatorWithConstant(): void {
            this.Acc = Utils.hexToDecimal(this.getByte());
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Loads the accumulator with what is stored at the address of the next two bytes in memory
         */
        public loadAccumulatorFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address);
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Stores the accumulator at the address specified by the next two bytes
         */
        public storeAccumulatorInMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.setMemoryAt(_CurrentPCB.memoryBase + address, this.Acc.toString(16));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Updates the Zflag if the X register if equal to the next two bytes in memory
         */
        public compareByte(): void {
            var memory = Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + Utils.hexToDecimal(this.getByte())));
            this.Zflag = (memory === this.Xreg) ? 1 : 0;
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Increase the accumulator by the value stored in the address specified by the next two bytes
         */
        public addWithCarry(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Acc += Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Set X register to the value of the next byte
         */
        public loadXWithConstant(): void {
            this.Xreg = Utils.hexToDecimal(this.getByte());
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Set X register to the value stored at the address specified by the next two bytes
         */
        public loadXFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Xreg = Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Set Y register to the value of the next byte
         */
        public loadYWithConstant(): void {
            this.Yreg = Utils.hexToDecimal(this.getByte());
            this.PC += 2;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Set Y register to the value stored at the address specified by the next two bytes
         */
        public loadYFromMemory(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            this.Yreg = Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Move along, nothing to see here, you don't have to go home, but you have to get out of here
         */
        public noOperation(): void {
            // Nothing to execute
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Update the current PCB and set isExecuting to false
         */
        public breakOperation(): void {
            _CurrentPCB.state = PROCESS_TERMINATED;

            this.updatePCB(_CurrentPCB);
            this.isExecuting = false;
            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, ""));
        }

        /**
         * Moving the program counter as specified by the next byte, if the Z flag is zero
         */
        public branchBytes(): void {
            console.log("Program Counter before branchBytes(): " + this.PC);

            if (this.Zflag == 0) {
                var byte = this.getByte();
                //console.log("Getting byte: " + byte);
                //console.log("Byte as Decimal: " + Utils.hexToDecimal(byte));
                if ((this.PC + Utils.hexToDecimal(byte)) >= 256) {
                    console.log("Branch greater.");
                    this.PC += Utils.hexToDecimal(byte) - 256;
                } else {
                    console.log("Branch else.");
                    this.PC += Utils.hexToDecimal(byte);
                }
            }

            this.PC += 2;
            this.updatePCB(_CurrentPCB);
            console.log("Program Counter after branchBytes(): " + this.PC);
        }

        /**
         * Incrementing the value stored at the address specified by the next two bytes
         */
        public incrementByte(): void {
            var address = Utils.hexToDecimal(this.getNextByte() + this.getByte());
            _MemoryManager.setMemoryAt(_CurrentPCB.memoryBase + address,
                                      (Utils.hexToDecimal(_MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + address)) + 1));
            this.PC += 3;
            this.updatePCB(_CurrentPCB);
        }

        /**
         * Print to the console what's stored in the Y register or what's stored
         * in memory at the location specified by the Y register
         */
        public syscall(): void {
            if (this.Xreg == 1) {
                // console.log("Xreg = 1");
                // console.log("Should putText: " + Utils.hexToDecimal(this.Yreg).toString());
                _StdOut.putText(Utils.hexToDecimal(this.Yreg).toString());
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                this.PC += 1;
                this.updatePCB(_CurrentPCB);
                return;
            }

            if (this.Xreg == 2) {
                console.log("Xreg = 2");
                var str = "";
                var y = this.Yreg;
                // console.log("Initial y: " + y);
                var val = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + y);
                // console.log("Initial val: " + val);
                while (val != "00") {
                    console.log("Val: " + val);
                    str += String.fromCharCode(Utils.hexToDecimal(val));
                    y += 1;
                    val = _MemoryManager.getMemoryFrom(_CurrentPCB.memoryBase + y);
                    //console.log("str: " + str);
                }
                // console.log("Should put text: " + str);
                // console.log("Should putText: " + str);
                _StdOut.putText(str);
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                this.PC += 1;
               // _CurrentPCB.updateHostDisplay("00");
                this.updatePCB(_CurrentPCB);
                return;
            }
        }

        /**
         * Translating the code to the correct method to execute
         * @param code: the operation to be executed
         */
        public executeOperation(code): void {
            // console.log("Current Program Counter: " + this.PC);
            // console.log("Executing operation: " + code);
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
                    // console.log("Undefined code: " + code);
                    _StdOut.putText("The following code is undefined: " + code);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.PC += 1;
                    this.updatePCB(_CurrentPCB);
                    break;
            }
        }
    }
}
