module TSOS {
    export class DeviceDriverFileSystem extends DeviceDriver {
        constructor() {
            super(this.krnFsDriverEntry);
        }

        public krnFsDriverEntry() {
            this.status = "loaded";
    }
    }
}