"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { workerData } = require('worker_threads');
const activator_1 = require("./activator");
activator_1.ExtensionActivator.runFile(workerData);
// sandboxRun()
// export function runExtension() {}
