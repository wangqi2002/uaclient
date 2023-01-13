import Application = require('koa')
import Router = require('koa-router')
import {SessionService} from '../services/session.service'

export module SessionController{
    export async function init(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        await SessionService.createSession()
    }

    export async function changeIdentity(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        await SessionService.changeIdentity()
    }

    export async function close(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        await SessionService.closeSession()
    }

    export async function readManyByIds(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let nodes=ctx.body
        await SessionService.readByNodeIds(nodes)
    }

    export async function getIdByName(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let path=ctx.body
        await SessionService.getNodeIdByBrowseName(path)
    }

    export async function writeMany(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        let nodes=ctx.body
        await SessionService.writeToServer(nodes)
    }

    export async function browseRoot(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ){
        await SessionService.browseRootFolder()
    }
}