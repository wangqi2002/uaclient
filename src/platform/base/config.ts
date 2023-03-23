import Store from 'electron-store'
import {app} from 'electron'

export enum ConfigNames {
    persistence = 'PersistConfig',
    log = 'LogConfig',
}

export module ClientConfig {

    export let configStore = new Store({
        name: 'client.config',
        fileExtension: 'json',
        cwd: app.getPath('exe'),
        clearInvalidConfig: true,
    })

    export function set(key: string, content: any) {
        configStore.set(key, content)
    }

    export function get(key: string) {
        return configStore.get(key)
    }

    export function del(key: string) {
        configStore.delete(key)
    }

    export function has(key: string) {
        return configStore.has(key)
    }
}