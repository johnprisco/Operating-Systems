///<reference path="../globals.ts" />
// Representation of a Process Control Blocks
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(pid, programCounter, acc, x, y, z, instruction) {
            if (pid === void 0) { pid = null; }
            if (programCounter === void 0) { programCounter = 0; }
            if (acc === void 0) { acc = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (instruction === void 0) { instruction = ""; }
            this.pid = pid;
            this.programCounter = programCounter;
            this.acc = acc;
            this.x = x;
            this.y = y;
            this.z = z;
            this.instruction = instruction;
        }
        ProcessControlBlock.prototype.init = function () {
            this.pid = _PCBArray.length - 1;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
