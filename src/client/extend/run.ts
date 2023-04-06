import { ExtensionActivator } from "./activator"

function sandboxRun() {
    let path = process.argv[0]
    ExtensionActivator.runFile(path)
}
sandboxRun()
