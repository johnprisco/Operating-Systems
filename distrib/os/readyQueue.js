var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSOS;
(function (TSOS) {
    var ReadyQueue = (function (_super) {
        __extends(ReadyQueue, _super);
        // Inherit the Array q from Queue
        function ReadyQueue() {
            _super.call(this);
        }
        ReadyQueue.prototype.getElementAt = function (index) {
            return this.q[index];
        };
        return ReadyQueue;
    })(TSOS.Queue);
    TSOS.ReadyQueue = ReadyQueue;
})(TSOS || (TSOS = {}));
