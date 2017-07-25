### Prototypes for input event handling in Workers

Examples showcasing a possible way to handle events in a Worker thread.  The
polyfill here makes it possible to use a "standard" event handling code in
Worker after a minimal initialization in the main thread.  Under the hood, the
polyfill maintains a local event handler registry in Worker that relies on
specially-structured postMessages to setup event forwarding from the main
thread.

Note that the polyfill forwards events through the main thread, so there is no
performance benefit with respect to events.


#### Live demos

- [pointerevent-in-worker](http://mustaqahmed.github.io/web/input-for-worker/pointerevent-in-worker/):
  The worker here is in charge of generating a string from `mousedown`,
  `mousemove` and `mouseup` input events.  The demo also shows that multiple
  event handlers and regular message passing works.  This works in Chrome and
  Firefox.

- [events-in-offscreen-canvas](http://mustaqahmed.github.io/web/input-for-worker/events-in-offscreen-canvas/):
  Two copies of the same Worker code takes care of two `OffscreenCanvas`
  instances, each doing its own transform.  Note that the Worker for the mirror
  takes its input from the primary canvas while draws on the second canvas.
  This demo works in Chrome only, with the
  `--enable-experimental-canvas-features` flag.

#### Polyfill usage
- The polyfill has two parts: `mainthread-polyfill.js` is loaded in the main
  thread while `worker-polyfill.js` is loaded in the Worker threads that want to
  handle input events.

- The main thread must call Window.associateEventTargetToWorker for a Worker
  object before:
  - the main thread Worker object adds any event handlers for "message" events,
    and
  - the corresponding Worker thread adds any non-message event handlers.


#### TODOs

- No support for removeEventHandler yet.
