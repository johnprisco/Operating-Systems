///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.quantumCounter = 1;
            this.algorithm = ROUND_ROBIN;
        }
        /**
         * Getter method for the scheduling algorithm
         * @returns {string}
         */
        CpuScheduler.prototype.getAlgorithm = function () {
            return this.algorithm;
        };
        /**
         * Sets the scheduling algorithm to the argument provided.
         * @param algorithm
         */
        CpuScheduler.prototype.setAlgorithm = function (algorithm) {
            this.algorithm = algorithm;
            this.quantumCounter = 1;
        };
        /**
         * Returns the value of the Round Robin quantum
         * @returns {number} the number the quantum is set to
         */
        CpuScheduler.prototype.getQuantum = function () {
            return this.quantum;
        };
        /**
         * Set the quantum to the number provided by the use
         * @param quantum: the new quantum value
         */
        CpuScheduler.prototype.setQuantum = function (quantum) {
            this.quantum = quantum;
        };
        /**
         * Start the CPU scheduler.
         * We get the first PCB off the Ready Queue and set the CPU to start
         */
        CpuScheduler.prototype.schedule = function () {
            console.log("We schedulin'.");
            _Mode = 1; // User mode now
            _CurrentPCB = _ReadyQueue.q[0];
            if (_CurrentPCB.location === PROCESS_ON_DISK) {
                console.log("CurrentPCB is on Disk.");
                _MemoryManager.rollOut(_MemoryManager.findPCBInFirstPartition());
                console.log("Successfully rolled out.");
                _MemoryManager.rollIn(_CurrentPCB);
                console.log("Successfully rolled in.");
            }
            _CPU.setToPCB(_CurrentPCB);
            _CurrentPCB.state = PROCESS_RUNNING;
            _CPU.isExecuting = true;
        };
        /**
         * Method to check if we should switch context,
         * in the case of a terminated process or a full quantum
         * has passed.
         * @returns {boolean}
         */
        CpuScheduler.prototype.shouldSwitchContext = function () {
            console.log("Current algorithm: " + this.getAlgorithm());
            switch (this.getAlgorithm()) {
                case ROUND_ROBIN:
                    if (this.quantumCounter >= this.quantum) {
                        this.quantumCounter = 0;
                        console.log("Should switch context.");
                        return true;
                    }
                    else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                        console.log("Should switch context. Dequeing PCB.");
                        return true;
                    }
                    break;
                case FCFS:
                    if (_CurrentPCB.state === PROCESS_TERMINATED) {
                        return true;
                    }
                    break;
                case PRIORITY:
                    if (_CurrentPCB.state === PROCESS_TERMINATED) {
                        return true;
                    }
                    break;
                default:
                    return false;
            }
        };
        /**
         * Switching context. Move to the next process,
         * but if the current process isn't terminated,
         * put it back on the Ready Queue.
         */
        CpuScheduler.prototype.switchContext = function () {
            console.log("Switching context.");
            // TODO: Account for scheduling algorithms
            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                var temp = _CurrentPCB;
                temp.state = PROCESS_WAITING;
                if (_ReadyQueue.getSize() > 0) {
                    if (_ReadyQueue.q[1].location === PROCESS_ON_DISK) {
                        _MemoryManager.rollOut(_MemoryManager.findPCBInFirstPartition());
                        _MemoryManager.rollIn(_ReadyQueue.q[1]);
                    }
                }
                _ReadyQueue.dequeue();
                _ReadyQueue.enqueue(temp);
                this.schedule();
            }
            else {
                _ReadyQueue.dequeue();
                // Process is terminated, so queue up the next one
                // ...unless there aren't any more processes to run.
                if (_ReadyQueue.getSize() > 0) {
                    this.schedule();
                }
                else {
                    // CPU is no longer executing and mode bit can be flipped back
                    _CPU.isExecuting = false;
                    _Mode = 0;
                }
            }
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
