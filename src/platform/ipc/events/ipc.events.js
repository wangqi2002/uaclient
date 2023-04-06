"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainEvents = exports.rendererEvents = void 0;
var rendererEvents;
(function (rendererEvents) {
    let mainEvents;
    (function (mainEvents) {
        mainEvents["minimize"] = "main:mini";
        mainEvents["maximize"] = "main:max";
        mainEvents["close"] = "main:close";
        mainEvents["quit"] = "main:quit";
    })(mainEvents = rendererEvents.mainEvents || (rendererEvents.mainEvents = {}));
    let extensionEvents;
    (function (extensionEvents) {
        extensionEvents["install"] = "extension:install";
        extensionEvents["uninstall"] = "extension:uninstall";
    })(extensionEvents = rendererEvents.extensionEvents || (rendererEvents.extensionEvents = {}));
    let workspaceEvents;
    (function (workspaceEvents) {
        workspaceEvents["create"] = "workspace:create";
    })(workspaceEvents = rendererEvents.workspaceEvents || (rendererEvents.workspaceEvents = {}));
    let persistEvents;
    (function (persistEvents) {
        persistEvents["init"] = "persist:init";
    })(persistEvents = rendererEvents.persistEvents || (rendererEvents.persistEvents = {}));
    let viewEvents;
    (function (viewEvents) {
        viewEvents["closeAll"] = "view:closeAll";
    })(viewEvents = rendererEvents.viewEvents || (rendererEvents.viewEvents = {}));
    let logEvents;
    (function (logEvents) {
        logEvents["info"] = "log:info";
        logEvents["error"] = "log:error";
        logEvents["warn"] = "log:warn";
    })(logEvents = rendererEvents.logEvents || (rendererEvents.logEvents = {}));
})(rendererEvents = exports.rendererEvents || (exports.rendererEvents = {}));
var MainEvents;
(function (MainEvents) {
    let logEmitEvents;
    (function (logEmitEvents) {
        logEmitEvents["error"] = "log:emit.error";
        logEmitEvents["info"] = "log:emit.info";
        logEmitEvents["warn"] = "log:emit.warn";
    })(logEmitEvents = MainEvents.logEmitEvents || (MainEvents.logEmitEvents = {}));
})(MainEvents = exports.MainEvents || (exports.MainEvents = {}));
