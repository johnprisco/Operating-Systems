var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            _super.call(this);
            this.isFormatted = false;
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.initialValue = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
        }
        DeviceDriverFileSystem.prototype.krnFsDriverEntry = function () {
            this.status = "loaded";
        };
        DeviceDriverFileSystem.prototype.format = function () {
            if (this.isFormatted) {
                _StdOut.putText("Drive is already formatted.");
                return;
            }
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        var key = i.toString() + j.toString() + k.toString();
                        sessionStorage.setItem(key, this.initialValue);
                    }
                }
            }
            this.isFormatted = true;
            _StdOut.putText("Hard drive has been formatted.");
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
