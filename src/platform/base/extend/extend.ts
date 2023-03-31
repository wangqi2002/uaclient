import { ClientWarn } from "../log/log"
import { MainHandler } from "../../ipc/handlers/ipc.handler"
import child_process from "child_process"
//todo 修改以使用child_process执行插件
export module Extend {
    type activateEvent = string
    type activateFunction = Function
    let plugins: Map<activateEvent, activateFunction> = new Map()
    // child_process.fork()

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
