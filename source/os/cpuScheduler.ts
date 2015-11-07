module TSOS {
    export class CpuScheduler {
        public quantum: number        = 6;
        public quantumCounter: number = 1;
        public algorithm: string      = ROUND_ROBIN;

        constructor() {

        }

        // Looking ahead to iProject 4
        public getAlgorithm() {
            return this.algorithm;
        }

        public setAlgorithm(algorithm: string) {
            this.algorithm = algorithm;
        }

        public getQuantum(): number {
            return this.quantum;
        }

        public setQuantum(quantum: number) {
            this.quantum = quantum;
        }

        public schedule(): void {
            console.log("We schedulin'.");
            _CurrentPCB = _ReadyQueue.dequeue();
            _CPU.setToPCB(_CurrentPCB);
            _CurrentPCB.state = PROCESS_RUNNING;
            _CPU.isExecuting = true;
        }

        public shouldSwitchContext(): boolean {
            if (this.quantumCounter >= this.quantum) {
                this.quantumCounter = 0;
                console.log("Should switch context.");
                return true;
            } else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                console.log("Should switch context. Dequeing PCB.");
                return true;
            }

            console.log("Should not switch context.");
            return false;
        }

        public switchContext(): void {
            console.log("Switching context.");
            //var temp = _ReadyQueue.dequeue();
            //
            //if (_CurrentPCB.state !== PROCESS_TERMINATED) {
            //    temp.state = PROCESS_WAITING;
            //    _ReadyQueue.enqueue(temp);
            //}
            //
            //this.schedule();

            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                var temp = _CurrentPCB;
                temp.state = PROCESS_WAITING;
                _ReadyQueue.enqueue(temp);
                this.schedule();
            } else {
                _ReadyQueue.dequeue();

                // Process is terminated, so queue up the next one
                // ...unless there aren't any more processes to run.
                if (_ReadyQueue.getSize() > 0) {
                    this.schedule();
                } else {
                    _CPU.isExecuting = false;
                }
            }
        }
    }
}