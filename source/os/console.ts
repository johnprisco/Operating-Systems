///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public commandHistory = [],
                    public historyIndex = 0) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell, add it to command history ...
                    _OsShell.handleInput(this.buffer);
                    this.commandHistory.push(this.buffer);
                    this.historyIndex = this.commandHistory.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                for (var i = 0; i < text.length; i++) {
                    var character: string = text.charAt(i);

                    if (this.lineWrap(character)) {
                        this.advanceLine();
                    }

                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, character);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, character);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
         }

        public lineWrap(str): boolean {
            var width: number = this.currentXPosition + CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, str);
            // If the next character would be drawn beyond the width of the canvas, return true; Yes, we line wrap.
            if (width > _Canvas.width) {
                return true;
            }

            // ...Otherwise, return false, no line wrap, putText as normal.
            return false;
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // Vertical scrolling implementation
            if (this.currentYPosition >= _Canvas.height) {
                var currentCanvas: ImageData = _DrawingContext.getImageData(0, this.currentFontSize + 5, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(currentCanvas, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }

        // Helper function to graphically remove a line from the console.
        public deleteLine(): void {
            var startX: number = this.currentXPosition;
            var startY: number = this.currentYPosition - _DefaultFontSize - 1;

            for (var i = 0; i < this.buffer.length; i++) {
                startX -= _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(i));
            }

            _DrawingContext.clearRect(startX, startY, this.currentXPosition, this.currentYPosition);
            this.currentXPosition = startX;
        }

        // Helper function to remove a single character from the console.
        public backspace(chr): void {
            var width: number = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));
            var height: number = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            this.currentXPosition -= width;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - height, width, _DefaultFontSize + height + 1);
            _Console.buffer = _Console.buffer.slice(0, -1);
        }


    }
 }
