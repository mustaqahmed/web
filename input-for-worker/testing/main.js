/*******************************************************************************
  Main thread user code.
*******************************************************************************/

var primaryCanvas = document.getElementById("canvas-primary");

function setupPrimaryWorker() {
    var primaryWorker = new Worker("worker.js");
    associateEventTargetToWorker(primaryCanvas, primaryWorker);

    var offscreenCanvas = primaryCanvas.transferControlToOffscreen();
    primaryWorker.postMessage(
        {
            canvas: offscreenCanvas,
            fillStyle: "hsla(120, 100%, 30%, 0.4)"
        }, [offscreenCanvas]);

    primaryWorker.addEventListener("message", msg => {
        var context = primaryCanvas.getContext('bitmaprenderer');
        context.transferFromImageBitmap(msg.data);
    });
}

function setupMirrorWorker() {
    var mirrorWorker = new Worker("worker.js");

    // Note that mirrorWorker's input comes from primaryCanvas.
    associateEventTargetToWorker(primaryCanvas, mirrorWorker);

    mirrorWorker.postMessage(
        {
            fillStyle: "hsla(120, 100%, 70%, 0.4)",
            transform: {
                a: 1,
                b: 0,
                c: 0,
                d: -1,
                e: 0,
                f: 150
            }
        });

    mirrorWorker.addEventListener("message", msg => {
        var mirrorCanvas = document.getElementById("canvas-mirror");
        var context = mirrorCanvas.getContext('bitmaprenderer');
        context.transferFromImageBitmap(msg.data);
    });
}

setupPrimaryWorker();
//setupMirrorWorker();
