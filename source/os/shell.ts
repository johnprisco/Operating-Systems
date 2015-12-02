///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="cpuScheduler.ts" />
///<reference path="deviceDriverFileSystem.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellLocation,
                                  "whereami",
                                  "- Displays current location.");
            this.commandList[this.commandList.length] = sc;

            // browser
            sc = new ShellCommand(this.shellBrowser,
                                  "browser",
                                  "- Displays information about your browser. Specifically that its a liar.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "- Updates the host status.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- Loads user program into memory.");
            this.commandList[this.commandList.length] = sc;

            // bsod
            sc = new ShellCommand(this.shellBSOD,
                                  "bsod",
                                  "- Crashes the OS.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - Executes the program with the corresponding <pid>.");
            this.commandList[this.commandList.length] = sc;


            // clearmem
            sc = new ShellCommand(this.shellClearMemory,
                                  "clearmem",
                                  "- Clears the memory.");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunAll,
                                  "runall",
                                  "- Runs all the programs loaded in memory.");
            this.commandList[this.commandList.length] = sc;

            // quantum
            sc = new ShellCommand(this.shellSetQuantum,
                                  "quantum",
                                  "<num> - Sets the quantum of the CPU scheduler to <num>.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellListProcesses,
                                  "ps",
                                  "- Lists all the processes currently running.");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKillProcess,
                                  "kill",
                                  "<pid> - Kill the process with pid <pid>.");
            this.commandList[this.commandList.length] = sc;

            // create <filename> - creates a file with the specified filename.
            sc = new ShellCommand(this.shellCreateFile, "create", "");
            this.commandList[this.commandList.length] = sc;

            // read <filename> - displays the contents of file with the specified filename.
            sc = new ShellCommand(this.shellReadFile, "read", "");
            this.commandList[this.commandList.length] = sc;

            // write <filename> "data" - writes the data to file with name <filename>.
            sc = new ShellCommand(this.shellWriteFile, "write", "");
            this.commandList[this.commandList.length] = sc;

            // delete <filename> - removes file with name <filename> from disk.
            sc = new ShellCommand(this.shellDeleteFile, "delete", "");
            this.commandList[this.commandList.length] = sc;

            // format - formats the hard drive to be used by the operating system.
            sc = new ShellCommand(this.shellFormatDrive, "format", "");
            this.commandList[this.commandList.length] = sc;

            // ls - lists the files stored on the hard drive.
            sc = new ShellCommand(this.shellListFiles, "ls", "");
            this.commandList[this.commandList.length] = sc;

            // setschedule [rr, fcfs, priority] - sets the CPU scheduling algorithm to Round Robin, FCFS, Priority.
            sc = new ShellCommand(this.shellSetCPUSchedule,
                                  "setschedule",
                                  "[rr, fcfs, priority] - sets the CPU scheduling algorithm to Round Robin, FCFS, Priority.");
            this.commandList[this.commandList.length] = sc;

            // getschedule - prints the current CPU scheduling algorithm to the console.
            sc = new ShellCommand(this.shellGetCPUSchedule,
                                  "getschedule",
                                  "- prints the current CPU scheduling algorithm to the console.");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + ", version " + APP_VERSION + ".");
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.

            _CPU.isExecuting = false;
            _Mode = 0;
            _MemoryManager.clearMemory();
            _ReadyQueue.q = [];
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("Ver displays the current version of data.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown shuts down the Virtual OS.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears the screen and resets the cursor position.");
                        break;
                    case "trace":
                        _StdOut.putText("Trace <on | off> turns the OS trace on/off.");
                        break;
                    case "man":
                        _StdOut.putText("Man <topic> displays the man page for the specified <topic>.");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 <string> does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt <string> sets the prompt.");
                        break;
                    case "date":
                        _StdOut.putText("Date displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami shows your current location.");
                        break;
                    case "browser":
                        _StdOut.putText("Browser displays information about the browser this OS is running in.");
                        break;
                    case "status":
                        _StdOut.putText("Status updates the status in the client.");
                        break;
                    case "load":
                        _StdOut.putText("Load puts a user-submitted program in memory.");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD crashes the virtual OS.");
                        break;
                    case "run":
                        _StdOut.putText("Run executes a program in memory.");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clears all the memory; removes anything stored in memory.");
                        break;
                    case "runall":
                        _StdOut.putText("Runs all the programs loaded in memory.");
                        break;
                    case "quantum":
                        _StdOut.putText("Sets the Round Robin quantum to the provided argument.");
                        break;
                    case "ps":
                        _StdOut.putText("Lists the PIDs of the currently running processes.");
                        break;
                    case "kill":
                        _StdOut.putText("Terminates the process with the PID specified in the argument.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate() {
            var date: Date = new Date();
            _StdOut.putText("It is currently " + Utils.formatTime(date) + " on " + Utils.formatDate(date) + ".");
        }

        public shellLocation() {
            var lat: number = 0;
            var long: number = 0;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    lat = position.coords.latitude;
                    long = position.coords.longitude;
                    _StdOut.putText("Your current coordinates are " + lat + ", " + long);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                }, () => {
                    _StdOut.putText("Sorry, there was an error.");
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                });
            } else {
                _StdOut.putText("Sorry, there was an error.");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }

    }

        public shellBrowser() {
            _StdOut.putText("You're viewing this in " + navigator.appName + ". ");
            if (navigator.appName == "Netscape") {
                _StdOut.putText("Browsers lie.");
            }
        }

        public shellStatus(args) {
            Utils.updateStatus(args);
        }

        public shellLoad() {
            if (_MemoryManager.isFull) {
                _StdOut.putText("Memory is full, another program cannot be loaded.");
            } else {
                var input = (<HTMLInputElement>document.getElementById('taProgramInput')).value;
                var regex:RegExp = /[0-9A-F\s]/i;

                var commands = input.split(" ");
                console.log("Commands array: " + commands);
                // Handle the case where there is no user input
                if (input == "") {
                    _StdOut.putText("Put some text in the User Program Input field first.");
                    return;
                }

                if (commands.length > 256) {
                    _StdOut.putText("This program will not fit in a 256-byte partition in memory.");
                    return;
                }

                // Handle the case where there is non-hex input
                for (var i = 0; i < input.length; i++) {
                    if (regex.test(input.charAt(i)) === false) {
                        _StdOut.putText("There are non-hexadecimal characters inputted.");
                        return;
                    }
                }

                // If we've gotten this far, we can try loading the program into memory.
                for (var i = 0; i < commands.length; i++) {
                    // Put the byte at position i at position i in the block
                    console.log("Load command: " + commands[i] + " at " + (_MemoryManager.base + i));
                    _MemoryManager.loadMemoryAt(_MemoryManager.base + i, commands[i]);
                }
                // Create new PCB and store it in the array tracking all of the PCBs.
                _CurrentPCB = new ProcessControlBlock();
                _ResidentList.push(_CurrentPCB);
                _CurrentPCB.init(); // Init after pushing to properly determine length of _ResidentList

                // Update the counter to save the current partition
                _MemoryManager.setNextPartition();
                console.log("Current partition: " + _MemoryManager.currentPartition);
                // Print the memory and PID for the new process
                _MemoryManager.updateHostDisplay();
                _StdOut.putText("Process assigned ID " + _CurrentPCB.pid);
            }
        }

        public shellRun(args) {
            var regex = /^-?[\d.]+(?:e-?\d+)?$/;

            // Make sure they're submitting something a number.
            if(!(regex.test(args[0]))) {
                _StdOut.putText("That's not valid input.");
                return;
            }

            if (_ResidentList.length === 0) {
                 _StdOut.putText("There are no programs to run.");
            } else {
                // Let's start executing.
                var temp = _ResidentList[args[0]];
                console.log("Attempting to enqueue program with pid: " + temp.pid);
                if (temp.state === PROCESS_TERMINATED) {
                    _StdOut.putText("This process is terminated.");
                } else {
                    temp.state = PROCESS_READY;
                    _ReadyQueue.enqueue(temp);

                    if (!_CPU.isExecuting) {
                        _KernelInterruptQueue.enqueue(new Interrupt(RUN_PROGRAM_IRQ, ""));
                    }

                    console.log("Program running.");
                    _StdOut.putText("Program running.");
                }
            }
        }

        public shellClearMemory() {
            _MemoryManager.clearMemory();
            _StdOut.putText("Memory cleared.");
        }

        public shellBSOD() {
            var params = "";
            _KernelInterruptQueue.enqueue(new Interrupt(BSOD_IRQ, params));
        }

        public shellRunAll() {
            if (_ResidentList.length === 0) {
                _StdOut.putText("There are no programs to run.");
            } else {
                // Add all the loaded processes to the ready queue
                while (_ResidentList.length > 0) {
                    var temp = _ResidentList.shift();

                    if (temp.state !== PROCESS_TERMINATED) {
                        temp.state = PROCESS_READY;
                        _ReadyQueue.enqueue(temp);
                    }
                }

                for (var i in _ReadyQueue.q) {
                    console.log("Printing ready queue: " + _ReadyQueue.q[i].pid);
                }

                _KernelInterruptQueue.enqueue(new Interrupt(RUN_PROGRAM_IRQ, ""));
                console.log("All programs running.");
                _StdOut.putText("All programs running.");
            }
        }

        public shellSetQuantum(args) {
            var regex = /^-?[\d.]+(?:e-?\d+)?$/;

            // Make sure the user wants to set the quantum to a number,
            // not something unreasonable like a string.
            if(!(regex.test(args[0]))) {
                _StdOut.putText("Entering strings will not set the quantum.")
            } else {
                _CpuScheduler.setQuantum(args);
                _StdOut.putText("Updated CPU quantum to " + _CpuScheduler.getQuantum() + ".");
            }
        }

        public shellListProcesses() {
            if (!_CPU.isExecuting) {
                _StdOut.putText("No programs running.")
            } else {
                for (var j = 0; j < _ReadyQueue.getSize(); j++) {
                    _StdOut.putText("PID " + _ReadyQueue.q[j].pid + " is running.");
                    _StdOut.advanceLine();
                }
            }
        }

        public shellKillProcess(args) {
            var regex = /^-?[\d.]+(?:e-?\d+)?$/;

            // Make sure they're submitting something that could actually be a PID.
            if(!(regex.test(args[0]))) {
                _StdOut.putText("That's not a valid PID.")
            } else {
                console.log("Trying to pass PID " + args[0]);
                var pid = args[0];

                if (_CurrentPCB.pid === parseInt(pid)) {
                    _CurrentPCB.state = PROCESS_TERMINATED;
                    _ReadyQueue.dequeue();
                    Utils.updateReadyQueueDisplay();
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, ""));
                    _StdOut.putText("Process terminated.");
                } else {
                    // Check _ReadyQueue for that PID
                    for (var i in _ReadyQueue.q) {
                        console.log("ReadyQueue at i pid: " + _ReadyQueue.q[i].pid);
                        if (_ReadyQueue.q[i].pid === parseInt(pid)) {
                            _ReadyQueue.q[i].state = PROCESS_TERMINATED;
                            _ReadyQueue.q.splice(i, 1);
                            Utils.updateReadyQueueDisplay();
                            _StdOut.putText("Process terminated.");
                            break;
                        }
                    }
                }
            }
        }

        // Call methods from fsDD in these as necessary.
        public shellCreateFile(args) {

            // TODO: Consider using switch case here to print the appropriate message
            // TODO: depending on what is returned by the driver.

            if (_krnFileSystemDriver.createFile(args[0])) {
                _StdOut.putText("Success!");
            } else {
                _StdOut.putText("Something broke.");
            }
        }

        public shellReadFile(args) {
            // Check the args so it doesn't break the program
            _StdOut.putText(_krnFileSystemDriver.readFile(args[0]));
        }

        public shellWriteFile(args) {
            var textToWrite = "";

            for (var i = 1; i < args.length; i++) {
                if (args.length === 2) {
                    console.log("args.length === 2");
                    textToWrite = args[i];
                    textToWrite = textToWrite.slice(1, args[i].length);
                    textToWrite = textToWrite.slice(0, args[i].length - 2);
                    console.log("writing: " + textToWrite);
                    break;
                }

                if (i === 1) {
                    console.log("Trying to write: " + args[i].slice(1, args[i].length));
                    textToWrite += args[i].slice(1, args[i].length);
                } else if (i === args.length - 1) {
                    console.log("Trying to write: " + args[i].slice(0, args[i].length - 1));
                    textToWrite += " " + args[i].slice(0, args[i].length - 1);
                } else {
                    textToWrite += " " + args[i];
                }

            }

            if (_krnFileSystemDriver.writeFile(args[0], textToWrite)) {
                _StdOut.putText("Success!");
            } else {
                _StdOut.putText("Something broke.");
            }
        }

        public shellDeleteFile(args) {
            if (_krnFileSystemDriver.deleteFile(args[0])) {
                _StdOut.putText("Success!");
            } else {
                _StdOut.putText("Something broke.");
            }
        }

        public shellFormatDrive() {
            _krnFileSystemDriver.format();
        }

        public shellListFiles() {

        }

        public shellSetCPUSchedule(args) {

        }

        public shellGetCPUSchedule() {
            _StdOut.putText("CPU Scheduling determined by: " + _CpuScheduler.getAlgorithm());

        }
    }
}