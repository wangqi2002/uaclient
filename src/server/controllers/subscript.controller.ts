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
        try {
            SubscriptService.createSubscription(ctx.request.body)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function modify(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            await SubscriptService.modifySubscription(ctx.request.body)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function addItemGroup(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            SubscriptService.addMonitoredItemGroup(ctx.request.body)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function addItem(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        // let param = ctx.request.body
        // if (param['item'] && param['displayNames']) {
        //     let item = param['item']
        //     let displayName = param['displayName']
        //     SubscriptService.addMonitoredItem(item, displayName)
        //     ctx.body = new ResponseModel(ServerMessage.success)
        // }
        try {
            SubscriptService.addMonitoredItem(ctx.request.body)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function getItems(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let items = await SubscriptService.getMonitoredItems()
            ctx.body = new ResponseModel(items)
        } catch (e: any) {
            throw e
        }
    }

    export async function deleteItems(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        // let indexes: string[] =
        try {
            await SubscriptService.deleteMonitoredItems(ctx.request.body)
            ctx.body = new ResponseModel(ServerMessage.success)
        } catch (e: any) {
            throw e
        }
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
        try {
            await SubscriptService.terminateSubscription()
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }
}