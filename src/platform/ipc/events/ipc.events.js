"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainEvents = exports.rendererEvents = void 0;
var rendererEvents;
(function (rendererEvents) {
    let benchEvents;
    (function (benchEvents) {
        benchEvents["minimize"] = "render:bench.mini";
        benchEvents["maximize"] = "render:bench.max";
        benchEvents["close"] = "render:bench.close";
        benchEvents["quit"] = "render:bench.quit";
    })(benchEvents = rendererEvents.benchEvents || (rendererEvents.benchEvents = {}));
    let extensionEvents;
    (function (extensionEvents) {
        extensionEvents["install"] = "render:extension.install";
        extensionEvents["uninstall"] = "render:extension.uninstall";
    })(extensionEvents = rendererEvents.extensionEvents || (rendererEvents.extensionEvents = {}));
    let workspaceEvents;
    (function (workspaceEvents) {
        workspaceEvents["create"] = "render:workspace.create";
    })(workspaceEvents = rendererEvents.workspaceEvents || (rendererEvents.workspaceEvents = {}));
    let persistEvents;
    (function (persistEvents) {
        persistEvents["init"] = "render:persist.init";
    })(persistEvents = rendererEvents.persistEvents || (rendererEvents.persistEvents = {}));
    let viewEvents;
    (function (viewEvents) {
        viewEvents["closeAll"] = "render:view.closeAll";
    })(viewEvents = rendererEvents.viewEvents || (rendererEvents.viewEvents = {}));
    let logEvents;
    (function (logEvents) {
        logEvents["info"] = "render:log.info";
        logEvents["error"] = "render:log.error";
        logEvents["warn"] = "render:log.warn";
    })(logEvents = rendererEvents.logEvents || (rendererEvents.logEvents = {}));
})(rendererEvents = exports.rendererEvents || (exports.rendererEvents = {}));
var MainEvents;
(function (MainEvents) {
    let logEmitEvents;
    (function (logEmitEvents) {
        logEmitEvents["error"] = "main:log.error";
        logEmitEvents["info"] = "main:log.info";
        logEmitEvents["warn"] = "main:log.warn";
    })(logEmitEvents = MainEvents.logEmitEvents || (MainEvents.logEmitEvents = {}));
})(MainEvents = exports.MainEvents || (exports.MainEvents = {}));
