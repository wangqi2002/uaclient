"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activator_1 = require("./activator");
function sandboxRun() {
    let path = process.argv[0];
    activator_1.ExtensionActivator.runFile(path);
}
sandboxRun();
