import { ExtensionActivator } from "./activator"
import { Worker } from "worker_threads"

function sandboxRun() {
    let path = process.argv[0]
    ExtensionActivator.runFile(path)
}

function workerThreadRun(path: string) {
    let worker = new Worker(path)
    worker.on("error", () => {
        //处理子线程中的错误
    })
}

// sandboxRun()
