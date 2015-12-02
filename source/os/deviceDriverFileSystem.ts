module TSOS {
    export class DeviceDriverFileSystem extends DeviceDriver {

        public isFormatted: boolean = false;
        public tracks:  number = 4;
        public sectors: number = 8;
        public blocks:  number = 8;
        public initialValue: string = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

        constructor() {
            super();
        }

        public format() {
            for (var track = 0; track < this.tracks; track++) {
                for (var sector = 0; sector < this.sectors; sector++) {
                    for (var block = 0; block < this.blocks; block++) {
                        var key = track.toString() + sector.toString() + block.toString();
                        sessionStorage.setItem(key, this.initialValue);
                    }
                }
            }

            this.isFormatted = true;
            _StdOut.putText("Hard drive has been formatted.");

        }

        public createFile(filename: string): boolean {
            if (!this.isFormatted) {
                return false;
            }

            // search DIR section for filename to see if it already exists
            if (this.searchForFileWithName(filename) != null) {
                // Already exists
                return false;
            }

            // search DIR section (0th track) for next available block
            var nextAvailableDirectoryBlock = this.findNextAvailableDirectoryBlock();
            var nextAvailableFileBlock = this.findNextAvailableFileBlock();

            if (nextAvailableDirectoryBlock === null || nextAvailableFileBlock === null) {
                return false;
            }

            var str = "1" + nextAvailableFileBlock + Utils.stringToHex(filename);
            str = Utils.rightPadString(str);
            sessionStorage.setItem(nextAvailableDirectoryBlock, str);
            sessionStorage.setItem(nextAvailableFileBlock, Utils.rightPadString("1~~~"));
            return true;
            // write filename at next available DIR block with TSB set to the next available file block
            //return false;
        }

        public searchForFileWithName(filename: string): string {
            var hexFilename = Utils.stringToHex(filename);
            var paddedHexFilename = Utils.rightPadString(hexFilename).slice(0,124);

            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);

                    // check if its in use

                    if (currentData.charAt(0) === "1") {
                        console.log("We've found an in-use block.");
                        // compare hex filename to stored file name
                        // if there's a match, return the tsb where that file starts.
                        console.log("paddedHexFilename: " + paddedHexFilename);
                        console.log("current Data: " + currentData.slice(4,128));
                        if (paddedHexFilename === currentData.slice(4,128)) {
                            console.log("Trying to return: " + currentData.slice(1,4));
                            return currentData.slice(1,4);
                        }
                    }
                }
            }


            // 404 Not Found
            return null;
        }

        public findDirectoryBlockForFile(filename: string): string {
            var hexFilename = Utils.stringToHex(filename);
            var paddedHexFilename = Utils.rightPadString(hexFilename).slice(0,124);

            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();

                    var currentData = sessionStorage.getItem(tsb);

                    // check if its in use

                    if (currentData.charAt(0) === "1") {
                        console.log("We've found an in-use block.");
                        // compare hex filename to stored file name
                        // if there's a match, return the tsb where that file starts.
                        console.log("paddedHexFilename: " + paddedHexFilename);
                        console.log("current Data: " + currentData.slice(4,128));
                        if (paddedHexFilename === currentData.slice(4,128)) {
                            console.log("Trying to return: " + currentData.slice(1,4));
                            return tsb;
                        }
                    }
                }
            }
        }

        public findNextAvailableDirectoryBlock(): string {
            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);

                    if (currentData.charAt(0) === "0") {
                        return tsb;
                    }
                }
            }
            return null;
        }

        public findNextAvailableFileBlock(): string {
            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 0; block < this.blocks; block++) {
                    var tsb = "1" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);

                    if (currentData.charAt(0) === "0") {
                        return tsb;
                    }
                }
            }
            return null;
        }

        public writeFile(filename: string, text: string): boolean {
            var tsb = this.searchForFileWithName(filename);
            text = Utils.stringToHex(text);

            // check if text is greater than the space available and handle appropriately
            while (text.length > 124) {
                // we need to find a new block
                var temp = text.slice(0, 124);
                var nextBlock = this.findNextAvailableFileBlock();
                temp = "1" + nextBlock + temp;
                sessionStorage.setItem(tsb, temp);
                tsb = nextBlock;
                text = text.slice(124, text.length);
            }

            text = "1~~~" + Utils.rightPadString(text).slice(0, 124);
            sessionStorage.setItem(tsb, text);
            return true;

        }

        public readFile(filename: string): string {
            var str = "";
            var tsb = this.searchForFileWithName(filename);
            var data = sessionStorage.getItem(tsb);
            var nextTsb = data.slice(1,4);

            while (nextTsb != "~~~") {
                data = data.slice(4, data.length);
                str += Utils.hexToString(data);
                var data = sessionStorage.getItem(nextTsb);
                nextTsb = data.slice(1,4);
            }

            data = data.slice(4, data.length);
            str += Utils.hexToString(data);
            return str;
        }

        public deleteFile(filename: string): boolean {
            var tsb = this.searchForFileWithName(filename);
            var data = sessionStorage.getItem(tsb);
            var nextTsb = data.slice(1,4);

            while (nextTsb != "~~~") {
                sessionStorage.setItem(tsb, this.initialValue);
                // set the next tsb
                tsb = nextTsb;
                data = sessionStorage.getItem(tsb);
                nextTsb = data.slice(1,4);
            }

            var dirBlock = this.findDirectoryBlockForFile(filename);
            sessionStorage.setItem(dirBlock, this.initialValue);
            sessionStorage.setItem(tsb, this.initialValue);

            return true;
        }
    }
}