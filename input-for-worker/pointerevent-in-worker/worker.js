/*********************************************************************
  Worker-side user code.
*********************************************************************/

importScripts("../event-handler-worker-polyfill.js");

var downs = 0;
var ups = 0;

function updateMainThread(x, y) {
    postMessage("#downs=" + downs
                + " #ups=" + ups
                + " loc=(" + x + "," + y + ")");
}

addEventListener("message", function(msg) {
    console.log("User's 'message' handler in worker");
});

addEventListener("mousedown", function(e) {
    console.log("User's 'mousedown' handler in worker");
    downs++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("mouseup", function(e) {
    console.log("User's 'mouseup' handler in worker");
    ups++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("mousemove", function(e) {
    console.log("User's 'mousemove' handler in worker");
    updateMainThread(e.clientX, e.clientY);
});

// Additional handlers to check multiple handler invocation order

addEventListener("message", function(msg) {
    console.log("User's 'message' handler#2 in worker");
});

addEventListener("mousedown", function(e) {
    console.log("User's 'mousedown' handler#2 in worker");
});
