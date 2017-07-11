### `pointerevent-in-worker`

[Link to demo](http://mustaqahmed.github.io/web/input-for-worker/pointerevent-in-worker/)

This is a simple example showcasing a possible way to handle events in a Worker
thread.  The worker here is in charge of generating a string from `pointerdown`,
`pointermove` and `pointerup` input events.  The polyfill here makes it possible
to use a "standard" event handling code in Worker.  Under the hood, the polyfill
maintains a local event handler registry in Worker that relies on
specially-structured postMessages to comminucate with the main thread.

Limitations:
- All events are forwarded from the main thread, so there is no performance
  benefit.
- Assumes a single Worker and a single EventTarget in main.
  TODO(mustaq): Fix when needed.
- Event handler for "message" events in the main thread still needs a filter.
  TODO(mustaq): Make the filtering transparent, similar to worker.
