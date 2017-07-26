/*******************************************************************************
  Worker-side user code.
*******************************************************************************/

importScripts("../worker-polyfill.js");

var offscreenCanvas = new OffscreenCanvas(300, 150);

function drawPoint(x, y) {
    var context = offscreenCanvas.getContext("2d");
    const radius = 5;

    context.save();
    context.translate(x, y);
    context.beginPath();
    context.arc(0, 0, radius, 0, 2.0 * Math.PI, false);
    context.closePath();
    context.fill();
    context.restore();
}

function updateMainThread() {
    createImageBitmap(offscreenCanvas).then(img => {postMessage(img)});
}

function initialize() {
    // Allow setting fillStyle and transform through postMessages.
    addEventListener("message", msg => {
        var data = msg.data;

        if (data.canvas) {
            offscreenCanvas = data.canvas;
        }

        if (data.fillStyle) {
            offscreenCanvas.getContext("2d").fillStyle = data.fillStyle;
        }

        if (data.transform) {
            offscreenCanvas.getContext("2d").transform(
                data.transform.a,
                data.transform.b,
                data.transform.c,
                data.transform.d,
                data.transform.e,
                data.transform.f);
        }
    });


    // Add event handlers for drawing.
    addEventListener("pointerdown", e => {
        drawPoint(e.clientX, e.clientY);
        // updateMainThread();
    });

    addEventListener("pointermove", e => {
        if (e.buttons) {
            drawPoint(e.clientX, e.clientY);
            // updateMainThread();
        }
    });

    addEventListener("pointerup", e => {
        // updateMainThread();
    });
}

initialize();
