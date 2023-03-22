import {ClientWarn} from './log'
import {MainHandler} from '../ipc/ipc.handler'

export type activateEvent = string
export type activateFunction = Function

export module Extend {
    let plugins: Map<activateEvent, activateFunction> = new Map()

    export function loadExtend(event: activateEvent, func: activateFunction) {
        if (plugins.get(event)) {
            throw ClientWarn
        } else {
            plugins.set(event, func)
            MainHandler.extendBind(event, func)
        }
    }

    export function activateExtend() {

    }
}