import Store from "electron-store"

export enum ConfigNames {
    persistence = "PersistConfig",
    log = "LogConfig",
}

export type storeOptions = {
    name: string
    fileExtension: string
    cwd: string
    clearInvalidConfig: boolean
}

type storeName = string
export class ClientStore {
    static stores: Map<storeName, Store>

    constructor() {
        ClientStore.stores = new Map<string, Store>()
        ClientStore.stores.set(
            "config",
            new Store({
                name: "config",
                fileExtension: "json",
                cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
                clearInvalidConfig: true,
            })
        )
    }

    static set(storeName: storeName, key: string, content: any): boolean {
        let store = ClientStore.stores.get(storeName)
        if (store) {
            store.set(key, content)
            return true
        } else {
            return false
        }
    }

    static get(storeName: storeName, key: string): any {
        let store = ClientStore.stores.get(storeName)
        if (store) {
            return store.get(key)
        } else {
            return false
        }
    }

    static del(storeName: storeName, key: string) {
        let store = ClientStore.stores.get(storeName)
        if (store) {
            store.delete(key)
            return true
        } else {
            return false
        }
    }

    static has(storeName: storeName, key: string): boolean {
        let store = ClientStore.stores.get(storeName)
        if (store) {
            return store.has(key)
        } else {
            return false
        }
    }

    static create(options: storeOptions) {
        if (ClientStore.stores.has(options.name)) {
            return false
        } else {
            let store = new Store(options)
            ClientStore.stores.set(options.name, store)
            store.openInEditor()
            return store
        }
    }
}
