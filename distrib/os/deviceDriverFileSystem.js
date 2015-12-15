///<reference path="../globals.ts" />
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
            this.initialValue = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        }
        DeviceDriverFileSystem.prototype.format = function () {
            for (var track = 0; track < this.tracks; track++) {
                for (var sector = 0; sector < this.sectors; sector++) {
                    for (var block = 0; block < this.blocks; block++) {
                        var key = track.toString() + sector.toString() + block.toString();
                        sessionStorage.setItem(key, this.initialValue);
                    }
                }
            }
            this.isFormatted = true;
            this.updateHostDisplay();
            _StdOut.putText("Hard drive has been formatted.");
        };
        DeviceDriverFileSystem.prototype.createFile = function (filename) {
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
            var str = "1" + nextAvailableFileBlock + TSOS.Utils.stringToHex(filename);
            str = TSOS.Utils.rightPadString(str);
            sessionStorage.setItem(nextAvailableDirectoryBlock, str);
            sessionStorage.setItem(nextAvailableFileBlock, TSOS.Utils.rightPadString("1~~~"));
            this.updateHostDisplay();
            return true;
            // write filename at next available DIR block with TSB set to the next available file block
            //return false;
        };
        DeviceDriverFileSystem.prototype.searchForFileWithName = function (filename) {
            var hexFilename = TSOS.Utils.stringToHex(filename);
            var paddedHexFilename = TSOS.Utils.rightPadString(hexFilename).slice(0, 124);
            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);
                    // check if its in use
                    if (currentData.charAt(0) === "1") {
                        void 0;
                        // compare hex filename to stored file name
                        // if there's a match, return the tsb where that file starts.
                        void 0;
                        void 0;
                        if (paddedHexFilename === currentData.slice(4, 128)) {
                            void 0;
                            return currentData.slice(1, 4);
                        }
                    }
                }
            }
            // 404 Not Found
            return null;
        };
        DeviceDriverFileSystem.prototype.findDirectoryBlockForFile = function (filename) {
            var hexFilename = TSOS.Utils.stringToHex(filename);
            var paddedHexFilename = TSOS.Utils.rightPadString(hexFilename).slice(0, 124);
            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);
                    // check if its in use
                    if (currentData.charAt(0) === "1") {
                        void 0;
                        // compare hex filename to stored file name
                        // if there's a match, return the tsb where that file starts.
                        void 0;
                        void 0;
                        if (paddedHexFilename === currentData.slice(4, 128)) {
                            void 0;
                            return tsb;
                        }
                    }
                }
            }
        };
        DeviceDriverFileSystem.prototype.findNextAvailableDirectoryBlock = function () {
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
        };
        DeviceDriverFileSystem.prototype.findNextAvailableFileBlock = function () {
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
        };
        DeviceDriverFileSystem.prototype.writeFile = function (filename, text) {
            var tsb = this.searchForFileWithName(filename);
            text = TSOS.Utils.stringToHex(text);
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
            text = "1~~~" + TSOS.Utils.rightPadString(text).slice(0, 124);
            sessionStorage.setItem(tsb, text);
            this.updateHostDisplay();
            return true;
        };
        DeviceDriverFileSystem.prototype.writeProgramFile = function (filename, text) {
            var tsb = this.searchForFileWithName(filename);
            while (text.length > 124) {
                // we need to find a new block
                var temp = text.slice(0, 124);
                var nextBlock = this.findNextAvailableFileBlock();
                temp = "1" + nextBlock + temp;
                sessionStorage.setItem(tsb, temp);
                tsb = nextBlock;
                text = text.slice(124, text.length);
            }
            text = "1~~~" + TSOS.Utils.rightPadString(text).slice(0, 124);
            sessionStorage.setItem(tsb, text);
            this.updateHostDisplay();
            return true;
        };
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
            var str = "";
            var tsb = this.searchForFileWithName(filename);
            var data = sessionStorage.getItem(tsb);
            var nextTsb = data.slice(1, 4);
            while (nextTsb != "~~~") {
                data = data.slice(4, data.length);
                str += TSOS.Utils.hexToString(data);
                var data = sessionStorage.getItem(nextTsb);
                nextTsb = data.slice(1, 4);
            }
            data = data.slice(4, data.length);
            str += TSOS.Utils.hexToString(data);
            return str;
        };
        DeviceDriverFileSystem.prototype.readProgramData = function (filename) {
            var str = "";
            void 0;
            var tsb = this.searchForFileWithName(filename);
            void 0;
            void 0;
            var data = sessionStorage.getItem(tsb);
            void 0;
            void 0;
            var nextTsb = data.slice(1, 4);
            void 0;
            while (nextTsb != "~~~") {
                data = data.slice(4, data.length);
                str += data;
                var data = sessionStorage.getItem(nextTsb);
                nextTsb = data.slice(1, 4);
            }
            data = data.slice(4, data.length);
            str += data;
            var strArray = [];
            void 0;
            for (var i = 0; i < str.length; i = i + 2) {
                strArray.push(str.charAt(i) + str.charAt(i + 1));
            }
            void 0;
            return strArray;
        };
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
            var tsb = this.searchForFileWithName(filename);
            var data = sessionStorage.getItem(tsb);
            var nextTsb = data.slice(1, 4);
            while (nextTsb != "~~~") {
                sessionStorage.setItem(tsb, this.initialValue);
                // set the next tsb
                tsb = nextTsb;
                data = sessionStorage.getItem(tsb);
                nextTsb = data.slice(1, 4);
            }
            var dirBlock = this.findDirectoryBlockForFile(filename);
            sessionStorage.setItem(dirBlock, this.initialValue);
            sessionStorage.setItem(tsb, this.initialValue);
            this.updateHostDisplay();
            return true;
        };
        DeviceDriverFileSystem.prototype.listFiles = function () {
            var str = "";
            for (var sector = 0; sector < this.sectors; sector++) {
                for (var block = 1; block < this.blocks; block++) {
                    var tsb = "0" + sector.toString() + block.toString();
                    var currentData = sessionStorage.getItem(tsb);
                    if (currentData.charAt(0) === "1") {
                        str += TSOS.Utils.hexToString(currentData.slice(4, 128)) + " ";
                    }
                }
            }
            return str;
        };
        DeviceDriverFileSystem.prototype.updateHostDisplay = function () {
            var div = document.getElementById('hd-table');
            div.innerHTML = "";
            for (var track = 0; track < this.tracks; track++) {
                for (var sector = 0; sector < this.sectors; sector++) {
                    for (var block = 0; block < this.blocks; block++) {
                        var tsb = track.toString() + sector.toString() + block.toString();
                        div.innerHTML += "<br><b>" + tsb + "</b> " + sessionStorage.getItem(tsb);
                    }
                }
            }
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
