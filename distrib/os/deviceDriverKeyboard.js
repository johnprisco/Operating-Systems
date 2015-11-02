///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
                // If its shifted, we'll pull the code from the table in the Utils helper.
                // Otherwise, we can use the built in fromCharCode.
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
                // Here we pull these from the tables in the Utils function, as
                // fromCharCode does not work for these.
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
            else if (keyCode == 9) {
                var matches = [];
                var buffer = _Console.buffer;
                // Compare the buffer to every command in the command list,
                // and add any matches to the array.
                if (buffer != "") {
                    for (var i = 0; i < _OsShell.commandList.length; i++) {
                        var current = _OsShell.commandList[i].command;
                        if (current.substring(0, buffer.length) == buffer) {
                            matches.push(_OsShell.commandList[i].command);
                        }
                    }
                }
                // If there is only one match, print that command
                if (matches.length == 1) {
                    _Console.deleteLine();
                    for (var i = 0; i < matches[0].length; i++) {
                        _KernelInputQueue.enqueue(matches[0].charAt(i));
                    }
                }
                else if (matches.length > 1) {
                    _Console.deleteLine();
                    for (var i = 0; i < matches.length; i++) {
                        _StdOut.putText(matches[i] + "   ");
                    }
                    _Console.advanceLine();
                    _OsShell.putPrompt();
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
