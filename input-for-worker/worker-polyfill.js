/*******************************************************************************
  worker-polyfill.js: Polyfill for Worker-side event handling
*******************************************************************************/

(function() {
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

    function initialize() {
        originalAddEventListener = addEventListener;
        addEventListener = newAddEventListener;

        originalAddEventListener("message", messageParser);
    }

    initialize();
})();
