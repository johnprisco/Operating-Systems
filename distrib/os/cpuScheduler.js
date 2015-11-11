var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.quantumCounter = 1;
            this.algorithm = ROUND_ROBIN;
        }
        // Looking ahead to iProject 4
        CpuScheduler.prototype.getAlgorithm = function () {
            return this.algorithm;
        };
        CpuScheduler.prototype.setAlgorithm = function (algorithm) {
            this.algorithm = algorithm;
        };
        CpuScheduler.prototype.getQuantum = function () {
            return this.quantum;
        };
        CpuScheduler.prototype.setQuantum = function (quantum) {
            this.quantum = quantum;
        };
        CpuScheduler.prototype.schedule = function () {
            console.log("We schedulin'.");
            //_CurrentPCB = _ReadyQueue.dequeue();
            _CurrentPCB = _ReadyQueue.q[0];
            _CPU.setToPCB(_CurrentPCB);
            _CurrentPCB.state = PROCESS_RUNNING;
            _CPU.isExecuting = true;
        };
        CpuScheduler.prototype.shouldSwitchContext = function () {
            if (this.quantumCounter >= this.quantum) {
                this.quantumCounter = 0;
                console.log("Should switch context.");
                return true;
            }
            else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                console.log("Should switch context. Dequeing PCB.");
                return true;
            }
            console.log("Should not switch context.");
            return false;
        };
        CpuScheduler.prototype.switchContext = function () {
            console.log("Switching context.");
            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                var temp = _CurrentPCB;
                temp.state = PROCESS_WAITING;
                _ReadyQueue.dequeue();
                _ReadyQueue.enqueue(temp);
                this.schedule();
            }
            else {
                // Process is terminated, so queue up the next one
                // ...unless there aren't any more processes to run.
                if (_ReadyQueue.getSize() > 0) {
                    this.schedule();
                }
                else {
                    _CPU.isExecuting = false;
                }
            }
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
