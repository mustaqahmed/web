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

function isEventhandlerPolyfillMessageFromWorker(msg, eventTarget) {
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

    setupEventhandlerPolyfillOnMain(myWorker,
                                    document.getElementById("target"));

    myWorker.addEventListener("message", function(msg) {
        if (isEventhandlerPolyfillMessageFromWorker(msg, target))
            return;
        result.textContent = msg.data;
    });
}
