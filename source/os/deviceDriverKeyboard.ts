///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode == 32)                     ||   // space
                       (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);

            } else if ((keyCode >= 48) && (keyCode <= 57)) {    // Digits
                if (isShifted) {
                    chr = Utils.getShiftedDigit(keyCode);
                } else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);

            } else if (keyCode == 8) {                          // Backspace
                if (_Console.buffer != "") {
                    var characterToBackspace = _Console.buffer.charAt(_Console.buffer.length - 1);
                    _Console.backspace(characterToBackspace);
                }

            } else if (((keyCode >= 186) && (keyCode <= 192)) ||
                       ((keyCode >= 219) && (keyCode <= 222))) { // Punctuation
                if (isShifted) {
                    chr = Utils.getShiftedPunctuation(keyCode);
                } else {
                    chr = Utils.getPunctuation(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode == 40) {
                _Console.deleteLine();
                _Console.buffer = "";
                _Console.historyIndex += 1;

                if (_Console.commandHistory[_Console.historyIndex]) {
                    Utils.setPrompt(_Console.commandHistory[_Console.historyIndex]);
                } else if (_Console.historyIndex < 0) {
                    _Console.historyIndex = -1;
                } else if (_Console.historyIndex >= _Console.commandHistory.length) {
                    _Console.historyIndex = _Console.commandHistory.length;
                }
            } else if (keyCode == 38) {
                _Console.deleteLine();
                _Console.buffer = "";
                _Console.historyIndex -= 1;

                if (_Console.commandHistory[_Console.historyIndex]) {
                    Utils.setPrompt(_Console.commandHistory[_Console.historyIndex]);
                } else if (_Console.historyIndex < 0) {
                    _Console.historyIndex = -1;
                } else if (_Console.historyIndex >= _Console.commandHistory.length) {
                    _Console.historyIndex = _Console.commandHistory.length;
                }
            }

        }
    }
}
