module TSOS {
    export class ReadyQueue extends Queue {

        // Inherit the Array q from Queue

        constructor() {
            super();
        }

        public getPCBAt(index: number): TSOS.ProcessControlBlock {
            console.log("Trying to get element at index: " + index + " with pid " + this.q[index])
            return this.q[index];
        }
    }
}