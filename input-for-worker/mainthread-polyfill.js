/*******************************************************************************
  Mainthread polyfill to enable Worker-side event handling
*******************************************************************************/

(scope => {
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
        workersForTarget.get(e.currentTarget).forEach(eventHandlerWorker => {
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

    function bindEventTarget(target) {
        var eventHandlerWorkers = workersForTarget.get(target);
        if (!eventHandlerWorkers) {
            eventHandlerWorkers = [];
            workersForTarget.set(target, eventHandlerWorkers);
        } else if (eventHandlerWorkers.includes(this)) {
            // Avoid adding redundant event forwarders.
            return;
        }

        eventHandlerWorkers.push(this);

        this.addEventListener("message", msg => {
            if (isEventForwardingRequestFromWorker(msg)) {
                target.addEventListener(msg.data.type, eventForwarder);
                msg.stopImmediatePropagation();
            }
        });
    }

    function initialize() {
        if (!scope.Worker)
            return;
        if (scope.Worker.prototype.bindEventTarget)
            return;
        scope.Worker.prototype.bindEventTarget = bindEventTarget;
    }

    initialize();
})(self);
