import {ClientService} from '../services/client.service'
import {ResponseModel} from '../models/response.model'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'

export module ClientController {

    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let clientOptions = ctx.request.body
            ClientService.createClient(clientOptions)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function connect(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param['endpointUrl']) {
                let endpointUrl = param['endpointUrl']
                await ClientService.connectToServer(endpointUrl)
                ctx.body = new ResponseModel()
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function disconnect(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let deleteSubscription = true
            await ClientService.disconnectFromServer(deleteSubscription)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function getEndpoints(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let endpoints = await ClientService.getEndpoints()
            ctx.body = new ResponseModel(endpoints)
        } catch (e: any) {
            throw e
        }
    }

    export async function getPrivateKey(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            ctx.body = ClientService.getPrivateKey()
        } catch (e: any) {
            throw e
        }
    }

    export async function getCertificate(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            ctx.body = ClientService.getCertificate()
        } catch (e: any) {
            throw e
        }
    }

    export async function getServers(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            ctx.body = ClientService.getServersOnNetwork()
        } catch (e: any) {
            throw e
        }
    }
}