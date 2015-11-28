var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.isFull = false;
            this.currentPartition = 0;
            this.base = 0;
            this.limit = 256;
            this.memory = _Memory;
        }
        // Returns the size of the memory
        MemoryManager.prototype.getLength = function () {
            return this.memory.memoryBlock.length;
        };
        // Getter method for a location in memory
        MemoryManager.prototype.getMemoryFrom = function (location) {
            if (location >= _CurrentPCB.memoryLimit || location < _CurrentPCB.memoryBase) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, ""));
            }
            else {
                return this.memory.memoryBlock[location];
            }
        };
        // Setter for a location in memory
        MemoryManager.prototype.setMemoryAt = function (location, item) {
            if (location >= _CurrentPCB.memoryLimit || location < _CurrentPCB.memoryBase) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, ""));
            }
            else {
                this.memory.memoryBlock[location] = item;
            }
        };
        // Method to load a program in to memory
        MemoryManager.prototype.loadMemoryAt = function (location, item) {
            _MemoryManager.memory.memoryBlock[location] = item;
        };
        // Displays the memory in the host
        MemoryManager.prototype.updateHostDisplay = function () {
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
                    }
                    else {
                        div.innerHTML += "<b>0x" + header + "</b>";
                    }
                }
                // Print whats in memory at the current location
                div.innerHTML += " " + this.memory.memoryBlock[i];
            }
        };
        /**
         * Clears all memory partitions and update the memory display;
         */
        MemoryManager.prototype.clearMemory = function () {
            // _CPU.isExecuting = false;
            this.isFull = false;
            this.base = 0;
            this.limit = 256;
            for (var i = 0; i < 786; i++) {
                this.memory.memoryBlock[i] = "00";
            }
            this.updateHostDisplay();
            // Delete programs stored in PCB Array;
            _ResidentList = [];
        };
        /**
         * Used when loading programs to make sure they're
         * placed in the proper partition, with bases and
         * limits defined.
         */
        MemoryManager.prototype.setNextPartition = function () {
            switch (this.currentPartition) {
                case 0:
                    this.base = 256;
                    this.limit = 512;
                    this.isFull = false;
                    this.currentPartition++;
                    break;
                case 1:
                    this.base = 512;
                    this.limit = 768;
                    this.currentPartition++;
                    this.isFull = false;
                    break;
                case 2:
                    this.base = 0;
                    this.limit = 256;
                    this.isFull = true;
                    this.currentPartition = 0;
                    break;
                default:
                    void 0;
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
