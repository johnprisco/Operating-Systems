///<reference path="../globals.ts" />
// Representation of a Process Control Blocks
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        // Initializes all fields
        function ProcessControlBlock(pid, programCounter, acc, x, y, z, memoryBase, memoryLimit, state, turnaroundTime, waitTime) {
            if (pid === void 0) { pid = 0; }
            if (programCounter === void 0) { programCounter = 0; }
            if (acc === void 0) { acc = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (memoryBase === void 0) { memoryBase = 0; }
            if (memoryLimit === void 0) { memoryLimit = 256; }
            if (state === void 0) { state = PROCESS_NEW; }
            if (turnaroundTime === void 0) { turnaroundTime = 0; }
            if (waitTime === void 0) { waitTime = 0; }
            this.pid = pid;
            this.programCounter = programCounter;
            this.acc = acc;
            this.x = x;
            this.y = y;
            this.z = z;
            this.memoryBase = memoryBase;
            this.memoryLimit = memoryLimit;
            this.state = state;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        ProcessControlBlock.prototype.init = function () {
            this.pid = _ResidentList.length - 1;
            this.memoryBase = _MemoryManager.base;
            this.memoryLimit = _MemoryManager.limit;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
