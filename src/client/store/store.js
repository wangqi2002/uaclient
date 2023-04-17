"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStore = exports.ConfigNames = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
var ConfigNames;
(function (ConfigNames) {
    ConfigNames["persistence"] = "PersistConfig";
    ConfigNames["log"] = "LogConfig";
})(ConfigNames = exports.ConfigNames || (exports.ConfigNames = {}));
class ClientStore {
    constructor(cwd = 'C:\\Users\\Administrator\\Desktop\\client.data') {
        ClientStore.cwd = cwd;
        ClientStore.stores = new Map();
        ClientStore.create({
            name: 'config',
            fileExtension: 'json',
            clearInvalidConfig: true,
        });
    }
    static set(storeName, key, content) {
        let store = ClientStore.stores.get(storeName);
        if (store) {
            store.set(key, content);
            return true;
        }
        else {
            return false;
        }
    }
    static get(storeName, key) {
        let store = ClientStore.stores.get(storeName);
        if (store) {
            return store.get(key);
        }
        else {
            return false;
        }
    }
    static del(storeName, key) {
        let store = ClientStore.stores.get(storeName);
        if (store) {
            store.delete(key);
            return true;
        }
        else {
            return false;
        }
    }
    static has(storeName, key) {
        let store = ClientStore.stores.get(storeName);
        if (store) {
            return store.has(key);
        }
        else {
            return false;
        }
    }
    static create(options) {
        if (ClientStore.stores.has(options.name)) {
            return false;
        }
        else {
            let store = new electron_store_1.default(Object.assign(Object.assign({}, options), { cwd: ClientStore.cwd }));
            ClientStore.stores.set(options.name, store);
            store.openInEditor();
            return store;
        }
    }
}
exports.ClientStore = ClientStore;
