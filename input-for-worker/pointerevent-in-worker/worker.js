/*******************************************************************************
  Worker-side user code.
*******************************************************************************/

importScripts("../worker-polyfill.js");

var downs = 0;
var ups = 0;

function updateMainThread(x, y) {
    postMessage("#downs=" + downs
                + " #ups=" + ups
                + " loc=(" + x + "," + y + ")");
}

addEventListener("mousedown", function(e) {
    downs++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("mouseup", function(e) {
    ups++;
    updateMainThread(e.clientX, e.clientY);
});

addEventListener("mousemove", function(e) {
    updateMainThread(e.clientX, e.clientY);
});


// Additional event listeners show that (a) multiple handler invocation and (b)
// regular message reception work.

addEventListener("message", function(msg) {
    console.log("User's 'message' handler in worker");
});

addEventListener("message", function(msg) {
    console.log("User's 'message' handler#2 in worker");
});

addEventListener("mousedown", function(e) {
    console.log("User's 'mousedown' handler#2 in worker");
});
