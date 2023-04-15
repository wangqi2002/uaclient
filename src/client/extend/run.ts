const { workerData } = require('worker_threads')
import { ExtensionActivator } from './activator'

ExtensionActivator.runFile(workerData)
// sandboxRun()
// export function runExtension() {}
