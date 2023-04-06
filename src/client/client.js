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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extend_1 = require("./extend/extend");
const workbench_1 = require("./../workbench/workbench");
const broker_1 = require("../platform/base/broker/broker");
const electron_1 = require("electron");
const error_1 = require("./error/error");
const log_1 = require("../platform/base/log/log");
const async_1 = __importDefault(require("async"));
const persistence_1 = require("../platform/base/persist/persistence");
const store_1 = require("../platform/base/store/store");
const ipc_handler_1 = require("../platform/ipc/handlers/ipc.handler");
const ipc_events_1 = require("../platform/ipc/events/ipc.events");
const path = require("path");
class Client {
    constructor() {
        try {
            this.requestSingleInstance();
            this.startup();
            ipc_handler_1.EventBind.mainBind(ipc_events_1.rendererEvents.mainEvents.quit, () => {
                this.quit();
            });
        }
        catch (e) {
            console.error(e.message);
            electron_1.app.exit(1);
        }
    }
    requestSingleInstance() {
        if (!electron_1.app.requestSingleInstanceLock()) {
            electron_1.app.quit();
        }
    }
    startup() {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.ErrorHandler.setUnexpectedErrorHandler((error) => {
                if ("source" in error) {
                    log_1.Log.error(error);
                }
                else {
                    log_1.Log.error(new log_1.ClientError("Uncaught", "An unexpected exception while client running", error.message, error.stack));
                }
            });
            try {
                yield this.createWorkbench();
                yield this.initServices();
            }
            catch (e) {
                console.log("出错了");
                throw e;
            }
        });
    }
    initServices() {
        new store_1.ClientStore();
        async_1.default.parallel([
            //初始化Broker中间转发者服务
            () => __awaiter(this, void 0, void 0, function* () {
                this.broker = new broker_1.Broker();
            }),
            //初始化Log日志服务
            () => __awaiter(this, void 0, void 0, function* () {
                new log_1.Log();
            }),
            //初始化ORM服务
            () => __awaiter(this, void 0, void 0, function* () {
                let defaultAttributes = store_1.ClientStore.get("config", "modelAttribute");
                this.persistor = new persistence_1.Persistence(path.join(__dirname, "..", "..", "/databases/data.db"), "2023", //TODO 处理数据库自动命名的问题
                defaultAttributes);
            }),
            //初始化插件服务
            () => __awaiter(this, void 0, void 0, function* () {
                new extend_1.GlobalExtensionManager();
            }),
            //初始化log服务
            () => __awaiter(this, void 0, void 0, function* () {
                new log_1.Log();
            }),
            //初始化postbox服务
            () => __awaiter(this, void 0, void 0, function* () { }),
        ]);
    }
    createWorkbench() {
        this.workbench = new workbench_1.Workbench(path.join(__dirname, "../workbench/preload.js"), path.join(__dirname, "../workbench/index.html"), true);
        this.mainWindow = this.workbench.getMainWindow();
        this.mainWindow.once("ready-to-show", () => {
            this.mainWindow.show();
        });
    }
    setErrorHandler(errorHandler) {
        error_1.ErrorHandler.setUnexpectedErrorHandler(errorHandler);
    }
    quit() {
        async_1.default.series([
            //终结broker转发者服务
            () => __awaiter(this, void 0, void 0, function* () {
                this.broker.onClose();
            }),
        ]);
    }
}
const client = new Client();
