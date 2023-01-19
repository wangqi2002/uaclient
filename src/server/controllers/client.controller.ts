import {ClientService} from '../services/client.service'
import {ResponseModel} from '../models/response.model'
import {ServerMessage} from '../../common/enums'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'

export module ClientController {

    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let clientOptions = ctx.request.body
        ClientService.createClient(clientOptions)
        ctx.body = new ResponseModel(ServerMessage.success)
    }

    export async function connect(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['endpointUrl']) {
            let endpointUrl = param['endpointUrl']
            await ClientService.connectToServer(endpointUrl)
            ctx.body = new ResponseModel(ServerMessage.success)
        }
    }

    export async function disconnect(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let deleteSubscription = true
        await ClientService.disconnectFromServer(deleteSubscription)
        ctx.body = new ResponseModel(ServerMessage.success)
    }

    export async function getEndpoints(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let endpoints = await ClientService.getEndpoints()
        ctx.body = new ResponseModel(ServerMessage.success, endpoints)
    }
}