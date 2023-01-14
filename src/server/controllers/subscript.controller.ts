import Application = require('koa')
import Router = require('koa-router')
import {SubscriptService} from '../services/subscript.service'

export module SubscriptController{
    export async function init(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let options={}
        SubscriptService.createSubscription(options)
    }

    export async function modify(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let options={}
        SubscriptService.modifySubscription(options)
    }

    export async function addItemGroup(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let items=[]
        let names:string[]=[]
        let params={}
        SubscriptService.addMonitoredItemGroup(items,names)
    }

    export async function addItem(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let item={}
        let name=''
        SubscriptService.addMonitoredItem(item,name)
    }

    export async function getItems(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        await SubscriptService.getMonitoredItems()
    }

    export async function deleteItems(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let indexes=[]
        SubscriptService.deleteMonitoredItems(indexes)
    }

    // export async function deleteItemGroups(
    //     ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
    //     next:Application.Next
    // ){
    //     let indexes=[]
    //     SubscriptService.deleteMonitoredItemGroups(indexes)
    // }

    export async function terminate(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        await SubscriptService.terminateSubscription()
    }
}