module TSOS {
    export class DeviceDriverFileSystem extends DeviceDriver {

        public isFormatted: boolean = false;
        public tracks:  number = 4;
        public sectors: number = 8;
        public blocks:  number = 8;
        public initialValue: string = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";

        constructor() {
            super();
        }

        public krnFsDriverEntry() {
            this.status = "loaded";
    }

        public format() {
            if (this.isFormatted) {
                _StdOut.putText("Drive is already formatted.");
                return;
            }

            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        var key = i.toString() + j.toString() + k.toString();
                        sessionStorage.setItem(key, this.initialValue);
                    }
                }
            }

            this.isFormatted = true;
            _StdOut.putText("Hard drive has been formatted.");

        }
    }
}