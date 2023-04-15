"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessManager = void 0;
const child_process_1 = __importDefault(require("child_process"));
class ProcessManager {
    constructor() {
        ProcessManager.processes = new Map();
    }
    /**
     * @description 创建一个子线程,指定path和moduleName,其中moduleName应当是一个工作的子进程所属模块
     * @param path
     * @param module
     * @param options
     */
    static createChildProcess(path, module, options) {
        let child = child_process_1.default.fork(path, options);
        if (child.pid) {
            ProcessManager.processes.set(module, child);
        }
    }
    static killProcess(module) {
        let child = ProcessManager.processes.get(module);
        if (child) {
            child.kill();
        }
    }
    beforeClose() {
        ProcessManager.processes.forEach((process, module) => {
            process.kill();
            ProcessManager.events.emit('process-killed', module);
        });
    }
}
exports.ProcessManager = ProcessManager;
