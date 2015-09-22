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
                // If its shifted, we'll pull the code from the table in the Utils helper.
                // Otherwise, we can use the built in fromCharCode.
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
                // Here we pull these from the tables in the Utils function, as
                // fromCharCode does not work for these.
                if (isShifted) {
                    chr = Utils.getShiftedPunctuation(keyCode);
                } else {
                    chr = Utils.getPunctuation(keyCode);
                }
                _KernelInputQueue.enqueue(chr);

                // This is used to cycle through command history
                // Works as expected in Terminal on OS X.
            } else if (keyCode == 40) {                        // Up and Down arrow keys
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

                // Command autocomplete.
            } else if (keyCode == 9) {                          // Tab
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

                // If there are multiple matches, print them all for the user to see.
                } else if (matches.length > 1) {
                    _Console.deleteLine();
                    for (var i = 0; i < matches.length; i++) {
                        _StdOut.putText(matches[i] + "   ");
                    }
                    _Console.advanceLine();
                    _OsShell.putPrompt();
                }
            }

        }
    }
}
