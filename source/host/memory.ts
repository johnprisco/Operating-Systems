///<reference path="../globals.ts" />

// Representation of 768-byte CPU memory
module TSOS {
    export class Memory {
        // The block of memory will be represented via an array
        public memoryBlock = [];

        // Initialize the memory so its all empty (00)
        public constructor() {
            for (var i = 0; i < 786; i++) {
                this.memoryBlock[i] = "00";
            }
        }
    }
}