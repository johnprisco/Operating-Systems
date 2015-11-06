module TSOS {
    export class ReadyQueue extends Queue {

        // Inherit the Array q from Queue

        constructor() {
            super();
        }

        public getElementAt(index: number): TSOS.ProcessControlBlock {
            return this.q[index];
        }

    }
}