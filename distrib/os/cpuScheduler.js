var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.quantumCounter = 0;
            this.algorithm = ROUND_ROBIN;
        }
        CpuScheduler.prototype.schedule = function () {
            console.log("We schedulin'.");
            _CurrentPCB = _ReadyQueue.getElementAt(0);
            // TODO: This will reset the PC every time we call schedule,
            // TODO: move this somewhere else
            _CPU.PC = _CurrentPCB.programCounter;
            _CurrentPCB.state = PROCESS_RUNNING;
            _CPU.isExecuting = true;
        };
        CpuScheduler.prototype.shouldSwitchContext = function () {
            if (this.quantumCounter === this.quantum) {
                this.quantumCounter = 0;
                return true;
            }
            else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                return true;
            }
            return false;
        };
        CpuScheduler.prototype.switchContext = function () {
            var temp = _ReadyQueue.dequeue();
            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                temp.state = PROCESS_WAITING;
                _ReadyQueue.enqueue(temp);
            }
            this.schedule();
        };
        CpuScheduler.prototype.test = function () {
            console.log("Testing CPU Scheduler accessibility.");
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
