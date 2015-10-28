///<reference path="../globals.ts" />

// Representation of 256-byte CPU memory
module TSOS {
    export class Memory {
        // The block of memory will be represented via an array
        public memoryBlock = [];

        // Constructor so I don't get errors.
        public constructor() {}

        public init(): void {
            // Initialize the block to 256 bytes
            for (var i = 0; i < 256; i++) {
                this.memoryBlock[i] = "00";
            }
        }
    }
}