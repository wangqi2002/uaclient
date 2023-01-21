import {SessionService} from '../services/session.service'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {ResponseModel} from '../models/response.model'
import {BrowseDescriptionLike, ReadValueIdOptions, UserIdentityInfo, WriteValueOptions} from 'node-opcua'
import 'koa-body/lib/index'

export module SessionController {

    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let userInfo: UserIdentityInfo | undefined = ctx.request.body
            await SessionService.createSession(userInfo)
            ctx.body = new ResponseModel()
        } catch (e: any) {
            throw e
        }
    }

    export async function changeIdentity(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let userInfo: UserIdentityInfo = ctx.request.body
            await SessionService.changeIdentity(userInfo)
            ctx.body = new ResponseModel()
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
            let nodes: ReadValueIdOptions[] = ctx.request.body
            ctx.body = new ResponseModel(await SessionService.readByNodeIds(nodes))
            // let param = ctx.request.body
            // if (param && 'nodeIds' in param) {
            //     let nodes = param['nodeIds']
            //     let result = await SessionService.readByNodeIds(nodes)
            //     ctx.body = new ResponseModel(result)
            // }
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
                let path: string = param['path'].toString()
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
            if (param && 'nodeToWrite' in param) {
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
                let result = await SessionService.browse(nodes)
                ctx.body = new ResponseModel(result)
            }
        } catch (e: any) {
            throw e
        }
    }
}