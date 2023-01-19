import {SessionService} from '../services/session.service'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {ResponseModel} from '../models/response.model'
import {ServerMessage} from '../../common/enums'
import {WriteValueOptions} from 'node-opcua'

export module SessionController {
    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        await SessionService.createSession(param['userInfo'])
        ctx.body = new ResponseModel(ServerMessage.success)
    }

    export async function changeIdentity(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['userInfo']) {
            await SessionService.changeIdentity(param['userInfo'])
            ctx.body = new ResponseModel(ServerMessage.success)
        }

    }

    export async function close(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        await SessionService.closeSession(true)
        ctx.body = new ResponseModel(ServerMessage.success)
    }

    export async function readManyByIds(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['nodeIds']) {
            let nodes = param['nodeIds']
            let result = await SessionService.readByNodeIds(nodes)
            ctx.body = new ResponseModel(ServerMessage.success, result)
        }
    }

    export async function getIdByName(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.query
        if (param['path']) {
            let path = param['path'].toString()
            let result = await SessionService.getNodeIdByBrowseName(path)
            ctx.body = new ResponseModel(ServerMessage.success, result)
        }

    }

    export async function writeMany(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let param = ctx.request.body
        if (param['nodeToWrite']) {
            let nodes: WriteValueOptions[] = param['nodeToWrite']
            await SessionService.writeToServer(nodes)
            ctx.body = new ResponseModel(ServerMessage.success)
        }

    }

    export async function browseRoot(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let result = await SessionService.browseRootFolder()
        ctx.request.body = new ResponseModel(ServerMessage.success, result)
    }
}