"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = exports.ConfigNames = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
const electron_1 = require("electron");
var ConfigNames;
(function (ConfigNames) {
    ConfigNames["persistence"] = "PersistConfig";
    ConfigNames["log"] = "LogConfig";
})(ConfigNames = exports.ConfigNames || (exports.ConfigNames = {}));
var ClientConfig;
(function (ClientConfig) {
    ClientConfig.configStore = new electron_store_1.default({
        name: 'client.config',
        fileExtension: 'json',
        cwd: electron_1.app.getPath('exe'),
        clearInvalidConfig: true,
    });
    function set(key, content) {
        ClientConfig.configStore.set(key, content);
    }
    ClientConfig.set = set;
    function get(key) {
        return ClientConfig.configStore.get(key);
    }
    ClientConfig.get = get;
    function del(key) {
        ClientConfig.configStore.delete(key);
    }
    ClientConfig.del = del;
    function has(key) {
        return ClientConfig.configStore.has(key);
    }
    ClientConfig.has = has;
})(ClientConfig = exports.ClientConfig || (exports.ClientConfig = {}));
