/*******************************************************************************
  Main thread user code.
*******************************************************************************/

function setupPrimaryWorker() {
    var primaryCanvas = document.getElementById("canvas-primary");
    var primaryWorker = new Worker("worker.js");
    associateEventTargetToWorker(primaryCanvas, primaryWorker);

    primaryWorker.postMessage(
        {
            fillStyle: "hsla(120, 100%, 40%, 0.4)"
        });

    primaryWorker.addEventListener("message", function(msg) {
        var context = primaryCanvas.getContext('bitmaprenderer');
        context.transferFromImageBitmap(msg.data);
    });
}

function setupMirrorWorker() {
    var mirrorCanvas = document.getElementById("canvas-mirror");
    var mirrorWorker = new Worker("worker.js");
    associateEventTargetToWorker(mirrorCanvas, mirrorWorker);

    mirrorWorker.postMessage(
        {
            fillStyle: "hsla(240, 100%, 40%, 0.4)",
            transform: {
                a: 1,
                b: 0,
                c: 0,
                d: -1,
                e: 0,
                f: 300
            }
        });
    mirrorWorker.addEventListener("message", function(msg) {
        var context = mirrorCanvas.getContext('bitmaprenderer');
        context.transferFromImageBitmap(msg.data);
    });
}

setupPrimaryWorker();
setupMirrorWorker();
