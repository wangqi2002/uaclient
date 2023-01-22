import {Next, ParameterizedContext} from 'koa'
import {IRouterParamContext} from 'koa-router'
import {
    BrowseDescriptionLike,
    ClientSubscriptionOptions,
    ModifySubscriptionOptions,
    OPCUAClientOptions,
    ReadValueIdOptions,
    UserIdentityInfo,
    WriteValueOptions
} from 'node-opcua'
import 'koa-body/lib/index'
import {is} from 'typia'
import {ClientError} from '../../common/informations'
import {Errors, Sources} from '../../common/enums'
import {AddManyParam, AddOneParam} from '../models/params.model'

export module ValidatorMiddleware {
    export async function paramValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.path) {
            case '/client': {
                if (is<OPCUAClientOptions | undefined>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('OPCUAClientOptions | undefined')
                }
                break
            }
            case '/client/connect': {
                if (is<{ endpointUrl: string }>(ctx.request.body)) {
                    await next()
                } else {
                    console.log(ctx.request.body)
                    throw validateError('{ endpointUrl: string }')
                }
                break
            }
            case '/client/disconnect': {
                if (is<{ deleteSubscription: string } | undefined>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ deleteSubscription: string } | undefined')
                }
                break
            }

            case '/session': {
                if (is<UserIdentityInfo | undefined>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('UserIdentityInfo | undefined')
                }
                break
            }
            case '/session/change_identity': {
                is<UserIdentityInfo>(ctx.request.body)
                break
            }
            case '/session/close': {
                if (is<{ deleteSubscription: boolean } | undefined>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ deleteSubscription: boolean } | undefined')
                }
                break
            }
            case '/session/read': {
                if (is<ReadValueIdOptions[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ReadValueIdOptions[]')
                }
                break
            }
            case '/session/id': {
                if (is<{ path: string }>(ctx.query)) {
                    await next()
                } else {
                    throw validateError('{ path: string }')
                }
                break
            }
            case '/session/write': {
                if (is<WriteValueOptions[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('WriteValueOptions[]')
                }
                break
            }
            case '/session/browse': {
                if (is<BrowseDescriptionLike>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('BrowseDescriptionLike')
                }
                break
            }

            case '/subscript': {
                if (is<ClientSubscriptionOptions | undefined>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ClientSubscriptionOptions')
                }
                break
            }
            case '/subscript/modify': {
                if (is<ModifySubscriptionOptions>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ModifySubscriptionOptions')
                }
                break
            }
            case '/subscript/add_many': {
                if (is<AddManyParam>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ModifySubscriptionOptions')
                }
                break
            }
            case '/subscript/add_one': {
                if (is<AddOneParam>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ModifySubscriptionOptions')
                }
                break
            }
            case '/subscript/delete_items': {
                if (is<string[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ModifySubscriptionOptions')
                }
                break
            }
            default:
                await next()
        }
    }

    function validateError(type: any) {
        return new ClientError(Sources.paramValidator, Errors.errorValidateParam, `supposed to be ${type}`)
    }
}