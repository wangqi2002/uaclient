"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActivator = void 0;
const events_1 = __importDefault(require("events"));
// import { Worker } from 'worker_threads'
const child_process_1 = require("child_process");
class ExtensionActivator {
    constructor() {
        ExtensionActivator.events = new events_1.default();
        ExtensionActivator.extensionInstanceManagers = new Map();
    }
    static activate(extension) {
        ExtensionActivator.events.emit('activate', extension);
    }
    /**
     * @description 每个插件的入口文件extension.js必须导出一个instance对象实现extensionInstance接口
     * @param IExtension
     */
    doActivateExtension(IExtension) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let { extension } = yield (_a = IExtension.storage, Promise.resolve().then(() => __importStar(require(_a))));
                yield extension.activate();
                let worker = undefined;
                if (extension.workerEntrance) {
                    // worker = new Worker(extension.workerEntrance)
                    (0, child_process_1.fork)(extension.workerEntrance);
                    // cluster.fork(extension.workerEntrance)
                    // await require(extension.workerEntrance)
                }
                ExtensionActivator.extensionInstanceManagers.set(IExtension.identifier.id, {
                    identifier: IExtension.identifier,
                    worker: worker,
                    instance: {
                        activate: extension.activate,
                        beforeClose: extension.beforeClose,
                        workerEntrance: extension.workerEntrance,
                    },
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    static terminateExtensionInstance(extensionId) {
        let instance = ExtensionActivator.extensionInstanceManagers.get(extensionId);
        try {
            if (instance) {
                instance.instance.beforeClose();
                if (instance.worker)
                    instance.worker.terminate();
            }
        }
        catch (e) {
            throw e;
        }
    }
    static beforeClose() {
        ExtensionActivator.extensionInstanceManagers.forEach((instance, extensionId) => {
            ExtensionActivator.terminateExtensionInstance(extensionId);
        });
    }
}
exports.ExtensionActivator = ExtensionActivator;
const activator = new ExtensionActivator();
ExtensionActivator.events.on('activate', (extension) => {
    activator.doActivateExtension(extension);
});
