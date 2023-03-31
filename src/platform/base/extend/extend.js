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
exports.GlobalExtensionEnablement = exports.Extend = void 0;
const log_1 = require("../log/log");
const ipc_handler_1 = require("../../ipc/handlers/ipc.handler");
var Extend;
(function (Extend) {
    let plugins = new Map();
    // child_process.fork()
    function loadExtend(event, func) {
        if (plugins.get(event)) {
            throw log_1.ClientWarn;
        }
        else {
            plugins.set(event, func);
            ipc_handler_1.MainHandler.extendBind(event, func);
        }
    }
    Extend.loadExtend = loadExtend;
    function activateExtend(event) {
        let func = plugins.get(event);
        if (func) {
            func();
        }
    }
    Extend.activateExtend = activateExtend;
    function enableExtention() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
})(Extend = exports.Extend || (exports.Extend = {}));
class GlobalExtensionEnablement {
    constructor() {
        this.enabledExtensions = new Map();
    }
    enableExtention(extension, source) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    disableExtention(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.GlobalExtensionEnablement = GlobalExtensionEnablement;
