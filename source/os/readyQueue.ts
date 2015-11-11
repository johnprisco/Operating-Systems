module TSOS {
    export class ReadyQueue extends Queue {

        // Inherit the Array q from Queue

        constructor() {
            super();
        }

        /**
         * This method gets the PCB at the index passed in.
         * @param index: where to find the PCB we're looking for
         * @returns {ProcessControlBlock} a PCB at the index in the ReadyQueue
         */
        public getPCBAt(index: number): TSOS.ProcessControlBlock {
            console.log("Trying to get element at index: " + index + " with pid " + this.q[index])
            return this.q[index];
        }
    }
}