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

// TODO: Need a way to preserve the drawing in offscreenCanvas, at least for
// pointerdown & pointermove.
function updateMainThread() {
    createImageBitmap(offscreenCanvas).then(image => {postMessage(image, [image])});
}

function initializeDrawingThread() {
    // Allow setting fillStyle and transform through postMessages.
    addEventListener("message", function(msg) {
        var context = offscreenCanvas.getContext("2d");
        var data = msg.data;

        if (data.fillStyle)
            context.fillStyle = data.fillStyle;
        if (data.transform)
            context.transform(data.transform.a,
                              data.transform.b,
                              data.transform.c,
                              data.transform.d,
                              data.transform.e,
                              data.transform.f);
    });


    // Add event handlers for drawing.
    addEventListener("pointerdown", function(e) {
        drawPoint(e.clientX, e.clientY);
        updateMainThread();
    });

    addEventListener("pointermove", function(e) {
        if (e.buttons) {
            drawPoint(e.clientX, e.clientY);
            updateMainThread();
        }
    });

    addEventListener("pointerup", function(e) {
        updateMainThread();
    });
}

initializeDrawingThread();
