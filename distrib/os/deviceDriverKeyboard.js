///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) ||
                (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57)) {
                if (isShifted) {
                    chr = TSOS.Utils.getShiftedDigit(keyCode);
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 8) {
                if (_Console.buffer != "") {
                    var characterToBackspace = _Console.buffer.charAt(_Console.buffer.length - 1);
                    _Console.backspace(characterToBackspace);
                }
            }
            else if (((keyCode >= 186) && (keyCode <= 192)) ||
                ((keyCode >= 219) && (keyCode <= 222))) {
                if (isShifted) {
                    chr = TSOS.Utils.getShiftedPunctuation(keyCode);
                }
                else {
                    chr = TSOS.Utils.getPunctuation(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 40) {
                _Console.deleteLine();
                _Console.buffer = "";
                _Console.historyIndex += 1;
                if (_Console.commandHistory[_Console.historyIndex]) {
                    TSOS.Utils.setPrompt(_Console.commandHistory[_Console.historyIndex]);
                }
                else if (_Console.historyIndex < 0) {
                    _Console.historyIndex = -1;
                }
                else if (_Console.historyIndex >= _Console.commandHistory.length) {
                    _Console.historyIndex = _Console.commandHistory.length;
                }
            }
            else if (keyCode == 38) {
                _Console.deleteLine();
                _Console.buffer = "";
                _Console.historyIndex -= 1;
                if (_Console.commandHistory[_Console.historyIndex]) {
                    TSOS.Utils.setPrompt(_Console.commandHistory[_Console.historyIndex]);
                }
                else if (_Console.historyIndex < 0) {
                    _Console.historyIndex = -1;
                }
                else if (_Console.historyIndex >= _Console.commandHistory.length) {
                    _Console.historyIndex = _Console.commandHistory.length;
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
