module TSOS {
    export class CpuScheduler {
        public quantum = 6;
        public quantumCounter = 0;
        public algorithm = ROUND_ROBIN;

        constructor() {

        }

        public schedule(): void {
            console.log("We schedulin'.");
            _CurrentPCB = _ReadyQueue.getElementAt(0);
            // TODO: This will reset the PC every time we call schedule,
            // TODO: move this somewhere else
            _CPU.PC = _CurrentPCB.programCounter;
            _CurrentPCB.state = PROCESS_RUNNING;
            _CPU.isExecuting = true;
        }

        public shouldSwitchContext(): boolean {
            if (this.quantumCounter === this.quantum) {
                this.quantumCounter = 0;
                return true;
            } else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                return true;
            }

            return false;
        }

        public switchContext(): void {
            var temp = _ReadyQueue.dequeue();

            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                temp.state = PROCESS_WAITING;
                _ReadyQueue.enqueue(temp);
            }

            this.schedule();
        }

        public test(): void {
            console.log("Testing CPU Scheduler accessibility.");
        }
    }
}