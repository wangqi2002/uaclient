import {SubscriptService} from '../services/subscript.service'
import {IRouterParamContext} from 'koa-router'
import {Next, ParameterizedContext} from 'koa'
import {ResponseModel} from '../models/response.model'
import {ServerMessage} from '../../common/enums'
import 'koa-body/lib/index'

export module SubscriptController {
    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['options']) {
            let options = param['options']
            SubscriptService.createSubscription(options)
            ctx.body = new ResponseModel(ServerMessage.success)
        }
    }

    export async function modify(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['options']) {
            let options = param['options']
            await SubscriptService.modifySubscription(options)
            ctx.body = new ResponseModel(ServerMessage.success)
        }
    }

    export async function addItemGroup(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['items'] && param['displayNames']) {
            let items = param['items']
            let displayNames = param['displayNames']
            SubscriptService.addMonitoredItemGroup(items, displayNames)
        }
    }

    export async function addItem(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['item'] && param['displayNames']) {
            let item = param['item']
            let displayName = param['displayName']
            SubscriptService.addMonitoredItem(item, displayName)
            ctx.body = new ResponseModel(ServerMessage.success)
        }

    }

    export async function getItems(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let items = await SubscriptService.getMonitoredItems()
        ctx.body = new ResponseModel(items)
    }

    export async function deleteItems(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let indexes: string[] = ctx.request.body
        await SubscriptService.deleteMonitoredItems(indexes)
        ctx.body = new ResponseModel(ServerMessage.success)
    }

    // export async function deleteItemGroups(
    //     ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
    //     next:Next
    // ){
    //     let indexes=[]
    //     SubscriptService.deleteMonitoredItemGroups(indexes)
    // }

    export async function terminate(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        await SubscriptService.terminateSubscription()
        ctx.body = new ResponseModel(ServerMessage.success)
    }
}