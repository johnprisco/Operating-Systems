///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        public memory: TSOS.Memory;
        public isFull: boolean          = false;
        public currentPartition: number = 0;
        public base: number             = 0;
        public limit: number            = 256;

        constructor() {
            this.memory = _Memory;
        }

        // Returns the size of the memory
        public getLength(): number {
            return this.memory.memoryBlock.length;
        }

        // Getter method for a location in memory
        public getMemoryFrom(location: number) {
            if (location >= _CurrentPCB.memoryLimit || location < _CurrentPCB.memoryBase) {
                _KernelInterruptQueue.enqueue(new Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, ""));
            } else {
                return this.memory.memoryBlock[location];
            }
        }

        // Setter for a location in memory
        public setMemoryAt(location, item) {
            if (location >= _CurrentPCB.memoryLimit || location < _CurrentPCB.memoryBase) {
                _KernelInterruptQueue.enqueue(new Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, ""));
            } else {
                this.memory.memoryBlock[location] = item;
            }
        }

        // Method to load a program in to memory
        public loadMemoryAt(location, item) {
            _MemoryManager.memory.memoryBlock[location] = item;
        }

        // Displays the memory in the host
        public updateHostDisplay(): void {
            var div = document.getElementById("memory-table");
            div.innerHTML = "";
            var length = this.getLength();

            // Loop through all of the memory and print accordingly
            for (var i = 0; i < length; i++) {
                if (i % 8 === 0) {
                    var header = i.toString(16);

                    // Make the hex look correct if too short
                    while (header.length <= 2) {
                        header = "0" + header;
                    }

                    if (i != 0) {
                        div.innerHTML += "<br><b>0x" + header + "</b>";
                    } else {
                        div.innerHTML += "<b>0x" + header + "</b>";
                    }
                }

                // Print whats in memory at the current location
                div.innerHTML += " " + this.memory.memoryBlock[i];
            }
        }

        /**
         * Clears all memory partitions and update the memory display;
         */
        public clearMemory() {
            // _CPU.isExecuting = false;
            this.isFull = false;
            this.base   = 0;
            this.limit  = 256;

            for (var i = 0; i < 786; i++) {
                this.memory.memoryBlock[i] = "00";
            }

            this.updateHostDisplay();

            // Delete programs stored in PCB Array;
            _ResidentList = [];
        }

        /**
         * Used when loading programs to make sure they're
         * placed in the proper partition, with bases and
         * limits defined.
         */
        public setNextPartition() {
            switch(this.currentPartition) {
                case 0:
                    this.base  = 256;
                    this.limit = 512;
                    this.isFull = false;
                    this.currentPartition++;
                    break;
                case 1:
                    this.base  = 512;
                    this.limit = 768;
                    this.currentPartition++;
                    this.isFull = false;
                    break;
                case 2:
                    this.base  = 0;
                    this.limit = 256;
                    this.isFull = true;
                    this.currentPartition = 0;
                    break;
                default:
                    console.log("Something broke, currentPartition is incorrect. currentPartition: "
                    + this.currentPartition)
            }
        }
        
        public rollOut(program: ProcessControlBlock) {
            // Moving a program in memory to disk
            _krnFileSystemDriver.createFile("PID" + program.pid);
            var text = "";
            for (var i = program.memoryBase; i < program.memoryLimit; i++) {
                text += this.getMemoryFrom(i);
            }

            _krnFileSystemDriver.writeProgramFile("PID" + program.pid, text);
            program.location = PROCESS_ON_DISK;
            program.memoryBase = -1;
            program.memoryLimit = -1;
            // TODO: update host displays for memory and file system
        }
        
        public rollIn(program: ProcessControlBlock) {
            // Moving a program to memory from disk
            var data = _krnFileSystemDriver.readProgramData("PID" + program.pid);
            console.log("Roll In Program data: " + data);

            for (var i = 0; i < data.length; i++) {
                //console.log("data[" + i + "]: " + data[i]);
                _MemoryManager.setMemoryAt(i, data[i]);
            }

            program.location = PROCESS_IN_MEMORY;
            program.memoryBase = 0;
            program.memoryLimit = 256;
            _krnFileSystemDriver.deleteFile("PID" + program.pid);
            // TODO: update host displays for memory and file system

        }

        public findPCBInFirstPartition(): ProcessControlBlock {
            for (var i = 0; i < _ResidentList.length; i++) {
                if (_ResidentList[i].memoryBase === 0) {
                    return _ResidentList[i];
                }
            }
            return null;
        }
    }
}