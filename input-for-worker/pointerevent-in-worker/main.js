/*********************************************************************
  Main thread code.
*********************************************************************/


// -------------------------------------------------------------------
// Polyfill code
// -------------------------------------------------------------------

// Assumes a single Worker object and a single EventTarget in the main
// thread.
var eventHandlerWorker;
var mainThreadEventTarget;

function trimmedEvent(event) {
    const allowedAttributes = ["boolean", "number", "string"];
    var trimmed = {};
    for (attribute in event) {
        if (allowedAttributes.includes(typeof event[attribute]))
            trimmed[attribute] = event[attribute];
    }
    return trimmed;
}

function eventForwarder(e) {
    var internalMessage = {};
    internalMessage._task_ = "parseAsEvent";
    internalMessage.trimmedEventData = trimmedEvent(e);
    eventHandlerWorker.postMessage(internalMessage);
}

function isEventhandlerPolyfillMessageFromWorker(msg) {
    if (!msg.data._task_)
        return false;

    if (msg.data._task_ === "forwardEvents" && msg.data.type) {
        mainThreadEventTarget.addEventListener(
            msg.data.type, eventForwarder);
    }

    return true;
}

function setupEventhandlerPolyfillOnMain(worker, target) {
    eventHandlerWorker = worker;
    mainThreadEventTarget = target;
}


// -------------------------------------------------------------------
// User code
// -------------------------------------------------------------------

var result = document.getElementById("result");

if (window.Worker) {
    var myWorker = new Worker("worker.js");
    var target = document.getElementById("target");

    setupEventhandlerPolyfillOnMain(myWorker, target);

    myWorker.addEventListener("message", function(msg) {
        // All incoming messages must be checked first.
        if (isEventhandlerPolyfillMessageFromWorker(msg))
            return;
        result.textContent = msg.data;
    });

    // This extra ping to worker shows that regular messages still works.
    target.addEventListener("mouseenter", function(e) {
        myWorker.postMessage("ping from main");
    });
}
