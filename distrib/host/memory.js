///<reference path="../globals.ts" />
// Representation of 256-byte CPU memory
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        // Constructor so I don't get errors.
        function Memory() {
            // The block of memory will be represented via an array
            this.memoryBlock = [];
        }
        Memory.prototype.init = function () {
            // Initialize the block to 256 bytes
            for (var i = 0; i < 256; i++) {
                this.memoryBlock[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
