/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
// TESTING
//
var APP_NAME = "PriscOS";
var APP_VERSION = "1.A4";
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
// Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var TIMER_IRQ = 0;
var KEYBOARD_IRQ = 1;
var BSOD_IRQ = 2;
var RUN_PROGRAM_IRQ = 3;
var CONTEXT_SWITCH_IRQ = 4;
var KILL_PROCESS_IRQ = 5;
var SYSCALL_IRQ = 6;
var BREAK_IRQ = 7;
var MEMORY_OUT_OF_BOUNDS_IRQ = 8;
var BSOD_BKG = new Image();
BSOD_BKG.src = "distrib/images/bsod.png";
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory;
var _MemoryManager;
var _ResidentList = new Array;
var _ReadyQueue;
var _CurrentPCB; // Tracks the current program
var _SingleStepMode = false; // Single step flag
var _CpuScheduler;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
// The possible states of scheduling
var ROUND_ROBIN = "Round Robin";
// The possible states of a process
var PROCESS_NEW = "New";
var PROCESS_RUNNING = "Running";
var PROCESS_WAITING = "Waiting";
var PROCESS_READY = "Ready";
var PROCESS_TERMINATED = "Terminated";
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
var _Datetime; // Initialized in Control.hostInit(). Displays date, time, and user submitted status.
var _Status;
