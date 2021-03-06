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
const APP_NAME: string    = "PriscOS";
const APP_VERSION: string = "1.A4";

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

// Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const TIMER_IRQ: number                = 0;
const KEYBOARD_IRQ: number             = 1;
const BSOD_IRQ: number                 = 2;
const RUN_PROGRAM_IRQ: number          = 3;
const CONTEXT_SWITCH_IRQ: number       = 4;
const KILL_PROCESS_IRQ: number         = 5;
const SYSCALL_IRQ: number              = 6;
const BREAK_IRQ: number                = 7;
const MEMORY_OUT_OF_BOUNDS_IRQ: number = 8;

const BSOD_BKG = new Image();
BSOD_BKG.src = "distrib/images/bsod.png";

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory: TSOS.Memory;
var _MemoryManager: TSOS.MemoryManager;
var _ResidentList = new Array;
var _ReadyQueue: TSOS.ReadyQueue;
var _CurrentPCB: TSOS.ProcessControlBlock; // Tracks the current program
var _SingleStepMode: boolean = false; // Single step flag
var _CpuScheduler: TSOS.CpuScheduler;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

// The possible states of scheduling
const ROUND_ROBIN = "Round Robin";
const FCFS        = "First Come, First Served";
const PRIORITY    = "Priority";


// The possible states of a process
const PROCESS_NEW         = "New";
const PROCESS_RUNNING     = "Running";
const PROCESS_WAITING     = "Waiting";
const PROCESS_READY       = "Ready";
const PROCESS_TERMINATED  = "Terminated";
const PROCESS_IN_MEMORY   = "Memory";
const PROCESS_ON_DISK     = "On Disk";

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFileSystemDriver;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};

var _Datetime: HTMLSpanElement; // Initialized in Control.hostInit(). Displays date, time, and user submitted status.
var _Status: HTMLSpanElement;