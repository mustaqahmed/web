/*******************************************************************************
  Worker-side user code.
*******************************************************************************/

importScripts("../worker-polyfill.js");

var context;

function assertContext() {
    if (!context)
        throw "OffscreenCanvas is not initialized";
}

function drawPoint(x, y) {
    assertContext();

    context.beginPath();
    context.arc(x, y, 5, 0, 2.0 * Math.PI, false);
    context.closePath();
    context.fill();
    context.commit();
}

function initialize() {
    // Allow setting fillStyle and transform through postMessages.
    addEventListener("message", msg => {
        var data = msg.data;

        if (data.canvas) {
            context = data.canvas.getContext("2d");
        }

        if (data.fillStyle) {
            assertContext();
            context.fillStyle = data.fillStyle;
        }

        if (data.transform) {
            assertContext();
            context.transform(data.transform.a,
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
    });

    addEventListener("pointermove", e => {
        if (e.buttons)
            drawPoint(e.clientX, e.clientY);
    });

    addEventListener("pointerup", e => {
        drawPoint(e.clientX, e.clientY);
    });
}

initialize();
