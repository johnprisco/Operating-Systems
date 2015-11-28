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
            void 0;
            _Mode = 1; // User mode now
            _CurrentPCB = _ReadyQueue.q[0];
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
            if (this.quantumCounter >= this.quantum) {
                this.quantumCounter = 0;
                void 0;
                return true;
            }
            else if (_CurrentPCB.state === PROCESS_TERMINATED) {
                void 0;
                return true;
            }
            void 0;
            return false;
        };
        /**
         * Switching context. Move to the next process,
         * but if the current process isn't terminated,
         * put it back on the Ready Queue.
         */
        CpuScheduler.prototype.switchContext = function () {
            void 0;
            if (_CurrentPCB.state !== PROCESS_TERMINATED) {
                var temp = _CurrentPCB;
                temp.state = PROCESS_WAITING;
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
