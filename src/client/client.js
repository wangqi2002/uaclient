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
exports.client = void 0;
const async_1 = __importDefault(require("async"));
const electron_1 = require("electron");
const error_1 = require("../platform/base/error");
const log_1 = require("../platform/base/log");
class Client {
    constructor() {
        try {
            this.requestSingleInstance();
            this.startup();
        }
        catch (e) {
            console.error(e.message);
            electron_1.app.exit(1);
        }
    }
    startup() {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.ErrorHandler.setUnexpectedErrorHandler(function (error) {
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
                throw e;
            }
        });
    }
    quit() { }
    initServices() {
        async_1.default.series([]);
    }
    createService() { }
    createWorkbench() {
        require("../workbench/workbench");
    }
    setErrorHandler(errorHandler) {
        error_1.ErrorHandler.setUnexpectedErrorHandler(errorHandler);
    }
    requestSingleInstance() {
        if (!electron_1.app.requestSingleInstanceLock()) {
            electron_1.app.quit();
        }
    }
}
exports.client = new Client();
