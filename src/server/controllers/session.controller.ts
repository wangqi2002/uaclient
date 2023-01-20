import {SessionService} from '../services/session.service'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {ResponseModel} from '../models/response.model'
import {BrowseDescriptionLike, WriteValueOptions} from 'node-opcua'
import 'koa-body/lib/index'

export module SessionController {

    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param['userInfo']) {
                await SessionService.createSession(param['userInfo'])
                ctx.body = new ResponseModel()
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function changeIdentity(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param['userInfo']) {
                await SessionService.changeIdentity(param['userInfo'])
                ctx.body = new ResponseModel()
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function close(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            await SessionService.closeSession(true)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function readManyByIds(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param['nodeIds']) {
                let nodes = param['nodeIds']
                let result = await SessionService.readByNodeIds(nodes)
                ctx.body = new ResponseModel(result)
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function getIdByName(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.query
            if (param['path']) {
                let path = param['path'].toString()
                let result = await SessionService.getNodeIdByBrowseName(path)
                ctx.body = new ResponseModel(result)
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function writeMany(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param['nodeToWrite']) {
                let nodes: WriteValueOptions[] = param['nodeToWrite']
                await SessionService.writeToServer(nodes)
                ctx.body = new ResponseModel()
            }
        } catch (e: any) {
            throw e
        }
    }

    export async function browseRoot(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let result = await SessionService.browseRootFolder()
            ctx.body = new ResponseModel(result)
        } catch (e: any) {
            throw e
        }
    }

    export async function browse(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let param = ctx.request.body
            if (param) {
                let nodes: BrowseDescriptionLike = param
                let result = await SessionService.browseByNodeId(nodes)
                ctx.body = new ResponseModel(result)
            }
        } catch (e: any) {
            throw e
        }
    }
}