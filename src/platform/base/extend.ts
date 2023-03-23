import {ClientWarn} from './log'
import {MainHandler} from '../ipc/ipc.handler'
//todo 修改以使用child_process执行插件
export module Extend {
    type activateEvent = string
    type activateFunction = Function
    let plugins: Map<activateEvent, activateFunction> = new Map()

    export function loadExtend(event: activateEvent, func: activateFunction) {
        if (plugins.get(event)) {
            throw ClientWarn
        } else {
            plugins.set(event, func)
            MainHandler.extendBind(event, func)
        }
    }

    export function activateExtend(event: activateEvent) {
        let func = plugins.get(event)
        if (func) {
            func()
        }
    }
}