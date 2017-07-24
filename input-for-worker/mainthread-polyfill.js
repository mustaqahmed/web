/*******************************************************************************

  mainthread-polyfill.js: Mainthread polyfill to enable Worker-side event
  handling

  - Any Worker thread that wants to handle input events must use
    worker-polyfill.js.

  - The method Window.associateEventTargetToWorker in this polyfill must be
    called before: (i) the main thread Worker object adds any event handlers for
    "message" and (ii) the Worker thread adds any non-message event handlers.

*******************************************************************************/

(function(scope) {
    // A map from event target to Worker
    var workerForTarget = {};

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
        var eventHandlerWorker = workerForTarget[e.currentTarget];
        if (!(eventHandlerWorker instanceof Worker))
            throw "eventForwarder: bad target or worker";

        var internalMessage = {};
        internalMessage._task_ = "parseAsEvent";
        internalMessage.trimmedEventData = trimmedEvent(e);
        eventHandlerWorker.postMessage(internalMessage);
    }

    function isEventForwardingRequestFromWorker(msg) {
        return msg.data._task_ && msg.data._task_ === "forwardEvents"
            && msg.data.type;
    }

    function associateEventTargetToWorker(target, worker) {
        if (workerForTarget[target])
            throw "associateEventTargetToWorker: duplicate associations";

        workerForTarget[target] = worker;

        myWorker.addEventListener("message", function(msg) {
            if (isEventForwardingRequestFromWorker(msg)) {
                target.addEventListener(msg.data.type, eventForwarder);
                msg.stopImmediatePropagation();
            }
        });
    }

    function initialize() {
        if (scope.associateEventTargetToWorker)
            return;
        scope.associateEventTargetToWorker = associateEventTargetToWorker;
    }

    initialize();
})(self);
