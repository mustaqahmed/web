/*******************************************************************************
  Main thread user code.
*******************************************************************************/

if (window.Worker) {
    var myWorker = new Worker("worker.js");
    var target = document.getElementById("target");
    var result = document.getElementById("result");

    associateEventTargetToWorker(target, myWorker);

    myWorker.addEventListener("message", function(msg) {
        result.textContent = msg.data;
    });

    // Regular messages to Workers still work.
    target.addEventListener("mouseenter", function(e) {
        myWorker.postMessage("ping from main");
    });
}
