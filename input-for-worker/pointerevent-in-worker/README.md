### `pointerevent-in-worker`

This is a simple example showcasing a possible way to handle events in a Worker
thread.  The worker here is in charge of generating a string from `mousedown`,
`mousemove` and `mouseup` input events (which is an artificial work just for a
demo).  The polyfill here makes it possible to use a "standard" event handling
code in Worker.  Under the hood, the polyfill maintains a local event handler
registry in Worker that relies on specially-structured postMessages to setup
event forwarding from the main thread.

[Link to demo](http://mustaqahmed.github.io/web/input-for-worker/pointerevent-in-worker/)

Note that the demo forwards all events through the main thread, so there is no
performance benefit with respect to events.

#### TODOs

- No support for removeEventHandler yet.

