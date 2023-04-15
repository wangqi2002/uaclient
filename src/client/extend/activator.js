"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActivator = void 0;
const worker_threads_1 = require("worker_threads");
class ExtensionActivator {
    constructor() { }
    //通过vm2沙箱执行插件文件
    static activateExtension(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            ExtensionActivator.runningWorkers.set(extension.identifier.id, new worker_threads_1.Worker('./src/client/run.js', { workerData: extension.storage }));
        });
    }
    static activateThis(start, beforeClose) {
        new worker_threads_1.Worker(__dirname);
    }
    static runFile(path) { }
    killWorker(workerId) {
        let worker = ExtensionActivator.runningWorkers.get(workerId);
        ExtensionActivator.runningWorkers.delete(workerId);
        worker === null || worker === void 0 ? void 0 : worker.terminate();
    }
    beforeClose() {
        ExtensionActivator.runningWorkers.forEach((value, workerId) => {
            this.killWorker(workerId);
        });
    }
}
exports.ExtensionActivator = ExtensionActivator;
