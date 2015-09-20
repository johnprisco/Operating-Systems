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

        public static formatDate(date:Date):string {
            const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

            var formattedString:string = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

            return formattedString;
        }

        public static formatTime(date:Date):string {
            var formattedString:string = date.getHours() + ":" + date.getMinutes();
            return formattedString;
        }

        public static getCurrentLocation():string {
            var lat: number = 0;
            var long: number = 0;
            var formattedString: string = "";

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    lat = position.coords.latitude;
                    long = position.coords.longitude;
                    console.log("Your current coordinates are " + lat + ", " + long);
                    formattedString = "Your current coordinates are " + lat + ", " + long;
                }, () => {
                    formattedString = "Sorry, there was an error";
                });
            } else {
                formattedString = "Sorry, there was an error.";
            }

            return formattedString;
        }

        public static updateDateTime(): void {
            var date:Date = new Date();
            _Datetime.innerText = "It's " + Utils.formatTime(date) + " on " + Utils.formatDate(date) + ".";
        }

        public static updateStatus(args: string): void {
            var status: string = "";
            for (var i: number = 0; i < args.length; i++) {
                status += args[i] + " ";
            }
            _Status.innerText = status;
        }
    }
}
