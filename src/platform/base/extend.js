"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extend = void 0;
const log_1 = require("./log");
const ipc_handler_1 = require("../ipc/ipc.handler");
var Extend;
(function (Extend) {
    let plugins = new Map();
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
})(Extend = exports.Extend || (exports.Extend = {}));
