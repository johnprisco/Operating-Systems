///<reference path="../globals.ts" />
// Representation of a Process Control Blocks
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        // Initializes all fields
        function ProcessControlBlock(pid, programCounter, acc, x, y, z, memoryBase, memoryLimit) {
            if (pid === void 0) { pid = 0; }
            if (programCounter === void 0) { programCounter = 0; }
            if (acc === void 0) { acc = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (memoryBase === void 0) { memoryBase = 0; }
            if (memoryLimit === void 0) { memoryLimit = 0; }
            this.pid = pid;
            this.programCounter = programCounter;
            this.acc = acc;
            this.x = x;
            this.y = y;
            this.z = z;
            this.memoryBase = memoryBase;
            this.memoryLimit = memoryLimit;
        }
        ProcessControlBlock.prototype.init = function () {
            this.pid = _PCBArray.length - 1;
            this.memoryBase = _MemoryManager.base;
            this.memoryLimit = _MemoryManager.limit;
        };
        // Update the host with the current values of the PCB
        ProcessControlBlock.prototype.updateHostDisplay = function (op) {
            document.getElementById('pc-pcb').innerHTML = this.programCounter.toString();
            document.getElementById('acc-pcb').innerHTML = this.acc.toString();
            document.getElementById('x-pcb').innerHTML = this.x.toString();
            document.getElementById('y-pcb').innerHTML = this.y.toString();
            document.getElementById('z-pcb').innerHTML = this.z.toString();
            document.getElementById('ir-pcb').innerHTML = op;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
