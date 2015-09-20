/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
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
        };
        Utils.rot13 = function (str) {
            /*
             This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
             You can do this in three lines with a complex regular expression, but I'd have
             trouble explaining it in the future.  There's a lot to be said for obvious code.
             */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        Utils.formatDate = function (date) {
            var months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
            var formattedString = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
            return formattedString;
        };
        Utils.formatTime = function (date) {
            var minuteString;
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minuteString = "0" + minutes;
            }
            else {
                minuteString = minutes.toString();
            }
            var formattedString = date.getHours() + ":" + minuteString;
            return formattedString;
        };
        //public static getCurrentLocation():string {
        //    var lat: number = 0;
        //    var long: number = 0;
        //    var formattedString: string = "";
        //
        //    if (navigator.geolocation) {
        //        navigator.geolocation.getCurrentPosition((position) => {
        //            lat = position.coords.latitude;
        //            long = position.coords.longitude;
        //            formattedString = "Your current coordinates are " + lat + ", " + long;
        //        }, () => {
        //            formattedString = "Sorry, there was an error";
        //        });
        //    } else {
        //        formattedString = "Sorry, there was an error.";
        //    }
        //
        //    return formattedString;
        //}
        Utils.updateDateTime = function () {
            var date = new Date();
            _Datetime.innerText = "It's " + Utils.formatTime(date) + " on " + Utils.formatDate(date) + ".";
        };
        Utils.updateStatus = function (args) {
            var status = "";
            for (var i = 0; i < args.length; i++) {
                status += args[i] + " ";
            }
            _Status.innerText = status;
        };
        Utils.getPunctuation = function (keyCode) {
            var table = {
                '186': ';',
                '187': '=',
                '188': ',',
                '189': '-',
                '190': '.',
                '191': '/',
                '192': '`',
                '219': '[',
                '220': '\\',
                '221': ']',
                '222': '\''
            };
            return table[keyCode];
        };
        Utils.getShiftedPunctuation = function (keyCode) {
            var table = {
                '186': ':',
                '187': '+',
                '188': '<',
                '189': '_',
                '190': '>',
                '191': '?',
                '192': '~',
                '219': '{',
                '220': '|',
                '221': '}',
                '222': '\"'
            };
            return table[keyCode];
        };
        Utils.getShiftedDigit = function (keyCode) {
            var table = {
                '48': ')',
                '49': '!',
                '50': '@',
                '51': '#',
                '52': '$',
                '53': '%',
                '54': '^',
                '55': '&',
                '56': '*',
                '57': '('
            };
            return table[keyCode];
        };
        Utils.setPrompt = function (str) {
            for (var i = 0; i < str.length; i++) {
                _KernelInputQueue.enqueue(str.charAt(i));
            }
        };
        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
