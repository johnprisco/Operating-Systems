module TSOS {
    export class MemoryManager {
        public memory: TSOS.Memory;

        constructor() {
            this.memory = _Memory;
        }

        // Returns the size of the memory
        public getLength(): number {
            return this.memory.memoryBlock.length;
        }

        // Getter method for a location in memory
        public getMemoryFrom(location: number) {
            return _MemoryManager.memory.memoryBlock[location];
        }

        // Setter for a location in memory
        public setMemoryAt(location, item) {
            _MemoryManager.memory.memoryBlock[location] = item;
        }

        // Displays the memory in the host
        public updateHostDisplay(): void {
            var div = document.getElementById("memory-table");
            div.innerHTML = "";
            var length = this.getLength();

            // Loop through all of the memory and print accordingly
            for (var i = 0; i < length; i++) {
                if (i % 8 === 0) {
                    var header = i.toString(16);

                    // Make the hex look correct if too short
                    while (header.length <= 2) {
                        header = "0" + header;
                    }

                    if (i != 0) {
                        div.innerHTML += "<br><b>0x" + header + "</b>";
                    } else {
                        div.innerHTML += "<b>0x" + header + "</b>";
                    }
                }

                // Print whats in memory at the current location
                div.innerHTML += " " + this.getMemoryFrom(i);
            }


        }
    }
}