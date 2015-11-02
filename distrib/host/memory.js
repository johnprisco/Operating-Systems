///<reference path="../globals.ts" />
// Representation of 256-byte CPU memory
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        // Initialize the memory so its all empty (00)
        function Memory() {
            // The block of memory will be represented via an array
            this.memoryBlock = [];
            for (var i = 0; i < 256; i++) {
                this.memoryBlock[i] = "00";
            }
        }
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
