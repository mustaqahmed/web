// ===================================================================
// Eventhandler Polyfill for worker
// ===================================================================

// A map from event type (string) to list of listener functions
var eventHandlerRegistry = {};

var originalAddEventListener;

function newAddEventListener(type, listener) {
    if (eventHandlerRegistry[type] === undefined) {
        eventHandlerRegistry[type] = [];
    }
    eventHandlerRegistry[type].push(listener);

    if (type !== "message" && eventHandlerRegistry[type].length == 1) {
        // Notify the main thread to start forwarding these event types
        var internalMessage = {
            _task_ : "forwardEvents",
            type : type
        }
        postMessage(internalMessage);
    }
}

function messageParser(msg) {
    if (!msg || !msg.data)
        throw "messageParser: Unexpected data received in Worker";

    var parsedType = "message";
    var parsedData = msg;
    if (msg.data._task_ && msg.data._task_ === "parseAsEvent"
        && msg.data.trimmedEventData) {
        parsedType = msg.data.trimmedEventData.type;
        parsedData = msg.data.trimmedEventData;
    }

    if (eventHandlerRegistry[parsedType]) {
        eventHandlerRegistry[parsedType].forEach(function(handler) {
            handler(parsedData);
        });
    }
}

function setupEventhandlerPolyfillOnWorker() {
    originalAddEventListener = addEventListener;
    addEventListener = newAddEventListener;

    originalAddEventListener("message", messageParser);
}


// ===================================================================
// User code for main
// ===================================================================

setupEventhandlerPolyfillOnWorker();

var pointerdowns = 0;
var pointerups = 0;

function updateMainThread(x, y) {
    postMessage("#downs=" + pointerdowns
                + " #ups=" + pointerups
                + " loc=(" + x + "," + y + ")");
}

addEventListener("message", function(msg) {
    console.log("User's worker 'message' handler");
});

addEventListener("pointerdown", function(e) {
    console.log("User's worker 'pointerdown' handler");
    pointerdowns++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("pointerup", function(e) {
    console.log("User's worker 'pointerup' handler");
    pointerups++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("pointermove", function(e) {
    console.log("User's worker 'pointermove' handler");
    updateMainThread(e.clientX, e.clientY);
});

// Additional handlers to check multiple handler invocation order

addEventListener("message", function(msg) {
    console.log("User's worker 'message' handler 2");
});

addEventListener("pointerdown", function(e) {
    console.log("User's worker 'pointerdown' handler 2");
});
