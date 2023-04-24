import { app } from 'electron';
import Store from 'electron-store';
export var ConfigNames;
(function (ConfigNames) {
    ConfigNames["persistence"] = "PersistConfig";
    ConfigNames["log"] = "LogConfig";
})(ConfigNames || (ConfigNames = {}));
export class ClientStore {
    static stores;
    static cwd;
    constructor(cwd) {
        ClientStore.cwd = cwd ? cwd : app.getPath('appData');
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
            let store = new Store({ ...options, cwd: ClientStore.cwd });
            ClientStore.stores.set(options.name, store);
            store.openInEditor();
            return store;
        }
    }
}
