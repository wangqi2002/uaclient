import {ClientError} from '../../common/informations'
import {Errors, Sources} from '../../common/enums'
import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'

export module ErrorMiddleware {
    export async function handleError(ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>, next: Next) {
        try {
            await next()
        } catch (e: any) {
            let error: any = e
            if (typeof e != typeof ClientError) {
                error = new ClientError(Sources.server, Errors.internalError, e.message)
            }
            ctx.body = error
            ctx.app.emit('error', error)
        }
    }
}