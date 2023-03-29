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
exports.client = exports.Client = void 0;
const workbench_1 = require("./../workbench/workbench");
const path_1 = __importDefault(require("path"));
const broker_1 = require("./../platform/base/broker");
const electron_1 = require("electron");
const error_1 = require("../platform/base/error");
const log_1 = require("../platform/base/log");
const async_1 = __importDefault(require("async"));
const persistence_1 = require("../platform/base/persistence");
const config_1 = require("../platform/base/config");
class Client {
    constructor() {
        try {
            this.requestSingleInstance();
            this.startup();
            electron_1.ipcMain.on("client:quit", () => {
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
                console.log("nice");
                throw e;
            }
        });
    }
    initServices() {
        async_1.default.parallel([
            //初始化Broker中间转发者服务
            () => __awaiter(this, void 0, void 0, function* () {
                Client.broker = new broker_1.Broker();
            }),
            //初始化Log日志服务
            () => __awaiter(this, void 0, void 0, function* () {
                Client.logger = new log_1.Log();
            }),
            //初始化持久化ORM服务
            () => __awaiter(this, void 0, void 0, function* () {
                let defaultAttributes = config_1.ClientConfig.get("modelAttribute");
                Client.persistor = new persistence_1.Persistence(path_1.default.join(__dirname, "..", "..", "/databases/data.db"), "2023", //TODO 处理数据库自动命名的问题
                defaultAttributes);
            }),
            //初始化插件服务
            () => __awaiter(this, void 0, void 0, function* () { }),
        ]);
    }
    createWorkbench() {
        Client.workbench = new workbench_1.Workbench();
        Client.mainWindow = Client.workbench.getMainWindow();
    }
    setErrorHandler(errorHandler) {
        error_1.ErrorHandler.setUnexpectedErrorHandler(errorHandler);
    }
    quit() {
        async_1.default.series([
            //终结broker转发者服务
            () => __awaiter(this, void 0, void 0, function* () {
                Client.broker.terminateAllPipe();
            }),
        ]);
    }
}
exports.Client = Client;
exports.client = new Client();
