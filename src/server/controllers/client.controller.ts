import { Log } from '../../common/log'
import { ClientService } from '../services/client.service'
import Application = require('koa')
import Router = require('koa-router')

export module ClientController {

    export async function init(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        let clientOptions=ctx.body
        let userInfo=ctx.body
        ClientService.createClient(clientOptions)
    }

    export async function connect(
        ctx:Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        let endpointUrl=ctx.body
        await ClientService.connectToServer(endpointUrl)
    }
    export async function disconnect(
        ctx: Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        let deleteSubscription=true
        await ClientService.disconnectFromServer(deleteSubscription)
    }

    export function getEndpoints(
        ctx:Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        next:Application.Next
    ) {
        return ClientService.getEndpoints()
    }
}