/*******************************************************************************
  Mainthread polyfill to enable Worker-side event handling
*******************************************************************************/

(function(scope) {
    // A map from event target to a list of Worker objects.
    var workersForTarget = new Map();

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
        workersForTarget.get(e.currentTarget).forEach(function(eventHandlerWorker) {
            if (!(eventHandlerWorker instanceof Worker))
                throw "eventForwarder: bad target or worker";

            var internalMessage = {};
            internalMessage._task_ = "parseAsEvent";
            internalMessage.trimmedEventData = trimmedEvent(e);
            eventHandlerWorker.postMessage(internalMessage);
        });
    }

    function isEventForwardingRequestFromWorker(msg) {
        return msg.data._task_ && msg.data._task_ === "forwardEvents"
            && msg.data.type;
    }

    function associateEventTargetToWorker(target, worker) {
        var eventHandlerWorkers = workersForTarget.get(target);
        if (!eventHandlerWorkers) {
            eventHandlerWorkers = [];
            workersForTarget.set(target, eventHandlerWorkers);
        } else if (eventHandlerWorkers.includes(worker)) {
            // Avoid adding redundant event forwarders.
            return;
        }

        eventHandlerWorkers.push(worker);

        worker.addEventListener("message", function(msg) {
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
