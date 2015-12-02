/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str):string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
             Huh? WTF? Okay... take a breath. Here we go:
             - The "|" separates this into two expressions, as in A or B.
             - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
             - "\s+$" is the same thing, but at the end of the string.
             - "g" makes is global, so we get all the whitespace.
             - "" is nothing, which is what we replace the whitespace with.
             */
        }

        public static rot13(str:string):string {
            /*
             This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
             You can do this in three lines with a complex regular expression, but I'd have
             trouble explaining it in the future.  There's a lot to be said for obvious code.
             */
            var retVal:string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch:string = str[i];
                var code:number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }


        // Functions used to format date and time as necessary.
        public static formatDate(date:Date):string {
            const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

            var formattedString:string = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

            return formattedString;
        }

        public static formatTime(date:Date):string {
            var minuteString: string;
            var minutes: number = date.getMinutes();

            if (minutes < 10) {
                minuteString = "0" + minutes;
            } else {
                minuteString = minutes.toString();
            }

            var formattedString:string = date.getHours() + ":" + minuteString;
            return formattedString;
        }

        public static updateDateTime(): void {
            var date:Date = new Date();
            _Datetime.innerText = "It's " + Utils.formatTime(date) + " on " + Utils.formatDate(date) + ".";
        }

        // Updates the host with the status supplied by the user.
        public static updateStatus(args: string): void {
            var status: string = "";
            for (var i: number = 0; i < args.length; i++) {
                status += args[i] + " ";
            }
            _Status.innerText = status;
        }

        //
        // Tables used to print symbols and punctuation
        //
        public static getPunctuation(keyCode: number): string {
            var table = {
                '186' : ';',
                '187' : '=',
                '188' : ',',
                '189' : '-',
                '190' : '.',
                '191' : '/',
                '192' : '`',
                '219' : '[',
                '220' : '\\',
                '221' : ']',
                '222' : '\''
            };
            return table[keyCode];
        }

        public static getShiftedPunctuation(keyCode: number): string {
            var table = {
                '186' : ':',
                '187' : '+',
                '188' : '<',
                '189' : '_',
                '190' : '>',
                '191' : '?',
                '192' : '~',
                '219' : '{',
                '220' : '|',
                '221' : '}',
                '222' : '\"'
            };
            return table[keyCode];
        }

        public static getShiftedDigit(keyCode: number): string {
            var table = {
                '48' : ')',
                '49' : '!',
                '50' : '@',
                '51' : '#',
                '52' : '$',
                '53' : '%',
                '54' : '^',
                '55' : '&',
                '56' : '*',
                '57' : '('
            };
            return table[keyCode];
        }

        // Helper function to set prompt with specified string
        public static setPrompt(str: string): void {
            for (var i = 0; i < str.length; i++) {
                _KernelInputQueue.enqueue(str.charAt(i));
            }
        }

        // Helper function to convert hex to decimal.
        public static hexToDecimal(hex): number {
            return parseInt(hex, 16);
        }

        public static stringToHex(str: string): string {
            var hex = "";
            for (var i = 0; i < str.length; i++) {
                hex += str.charCodeAt(i).toString(16);
            }
            return hex;
        }

        public static hexToString(data: string): string {
            var str = "";
            for (var i = 0; i < data.length; i += 2) {
                str += String.fromCharCode(parseInt(data.substr(i, 2), 16));
            }

            return str;
        }

        public static rightPadString(str: string): string {
            while (str.length < 128) {
                str += "0";
            }
            return str;

        }

        // Method to track the turnaround and wait times of the running processes.
        public static trackTime(): void {
            if (_CurrentPCB.state != PROCESS_TERMINATED) {
                _CurrentPCB.turnaroundTime++;
            }

            if (_CurrentPCB.state === PROCESS_WAITING ||
                _CurrentPCB.state === PROCESS_NEW ||
                _CurrentPCB.state === PROCESS_READY) {
                _CurrentPCB.waitTime++;
            }

            for (var i in _ReadyQueue.q) {

                if (_ReadyQueue.q[i].state != PROCESS_TERMINATED) {
                    _ReadyQueue.q[i].turnaroundTime++;
                }

                if (_ReadyQueue.q[i].state === PROCESS_WAITING ||
                    _ReadyQueue.q[i].state === PROCESS_NEW ||
                    _ReadyQueue.q[i].state === PROCESS_READY) {
                    _ReadyQueue.q[i].waitTime++;
                }
            }
        }

        // Hacky method to display the Ready Queue in the host
        // It will be fixed in time.
        public static updateReadyQueueDisplay() {
            for (var i in _ReadyQueue.q) {
                document.getElementById('pid-pcb-' + i).innerHTML   = _ReadyQueue.q[i].pid.toString();
                document.getElementById('state-pcb-' + i).innerHTML = _ReadyQueue.q[i].state.toString();
                document.getElementById('pc-pcb-' + i).innerHTML    = _ReadyQueue.q[i].programCounter.toString();
                document.getElementById('acc-pcb-' + i).innerHTML   = _ReadyQueue.q[i].acc.toString();
                document.getElementById('x-pcb-' + i).innerHTML     = _ReadyQueue.q[i].x.toString();
                document.getElementById('y-pcb-' + i).innerHTML     = _ReadyQueue.q[i].y.toString();
                document.getElementById('z-pcb-' + i).innerHTML     = _ReadyQueue.q[i].z.toString();
                document.getElementById('turn-pcb-' + i).innerHTML  = _ReadyQueue.q[i].turnaroundTime.toString();
                document.getElementById('wait-pcb-' + i).innerHTML  = _ReadyQueue.q[i].waitTime.toString();
            }
        }
    }
}
