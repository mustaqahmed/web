/*******************************************************************************
  Main thread user code.
*******************************************************************************/

var primaryCanvas = document.getElementById("canvas-primary");

function setupPrimaryWorker() {
    var primaryWorker = new Worker("worker.js");
    associateEventTargetToWorker(primaryCanvas, primaryWorker);

    var offscreenPrimaryCanvas = primaryCanvas.transferControlToOffscreen();
    primaryWorker.postMessage(
        {
            canvas: offscreenPrimaryCanvas,
            fillStyle: "hsla(120, 100%, 30%, 0.4)"
        },
        [offscreenPrimaryCanvas]);
}

function setupMirrorWorker() {
    var mirrorWorker = new Worker("worker.js");

    // Note that mirrorWorker's input comes from primaryCanvas.
    associateEventTargetToWorker(primaryCanvas, mirrorWorker);

    var mirrorCanvas = document.getElementById("canvas-mirror");
    var offscreenMirrorCanvas = mirrorCanvas.transferControlToOffscreen();
    mirrorWorker.postMessage(
        {
            canvas: offscreenMirrorCanvas,
            fillStyle: "hsla(120, 100%, 70%, 0.4)",
            transform: {
                a: 1,
                b: 0,
                c: 0,
                d: -1,
                e: 0,
                f: 150
            }
        },
        [offscreenMirrorCanvas]);
}

setupPrimaryWorker();
setupMirrorWorker();
