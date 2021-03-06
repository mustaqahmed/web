/*******************************************************************************
  Main thread user code.
*******************************************************************************/

if (window.Worker) {
    var myWorker = new Worker("worker.js");
    var target = document.getElementById("target");
    var result = document.getElementById("result");

    myWorker.bindEventTarget(target);

    myWorker.addEventListener("message", msg => {
        result.textContent = msg.data;
    });

    // Regular messages to Workers still work.
    target.addEventListener("mouseenter", e => {
        myWorker.postMessage("ping from main");
    });
}
