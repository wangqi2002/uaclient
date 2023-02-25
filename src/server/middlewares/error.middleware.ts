import {Errors, ServerMessage, ServerStatusCodes, Sources} from '../../common/enums'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {ResponseModel} from '../models/response.model'
import {ClientError, ClientWarn} from '../models/infos.model'
import {Log} from '../../common/log'

export module ErrorMiddleware {

    export async function handleError(ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>, next: Next) {
        try {
            await next()
        } catch (e: any) {
            if (e instanceof ClientWarn) {
                Log.warn(e)
                ctx.body = new ResponseModel(e, ServerMessage.warn, ServerStatusCodes.success)
            } else {
                let error: any = e
                if (!(e instanceof ClientError)) error = new ClientError(Sources.server, Errors.internalError, e.message)
                Log.error(e)
                ctx.body = new ResponseModel(error, ServerMessage.error, ServerStatusCodes.internalError)
                ctx.app.emit('error', error)
            }
        }
    }
}