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
import {Errors, Infos, Sources, TableCreateModes} from '../../common/enums'
import {IDbData, IFieldNames, NodeID, SubscriptGroupParam, SubscriptSingleParam} from '../models/params.model'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import Database from 'better-sqlite3'
import {ClientError, ClientInfo} from '../models/infos.model'
import {Log} from '../../common/log'
import {CertUtils, DbUtils} from '../utils/util'

export module ValidatorMiddleware {
    export async function clientValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.path) {
            case '/client/init': {
                if (is<OPCUAClientOptions | undefined>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.clientService, Infos.clientCreated, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('OPCUAClientOptions | undefined')
                }
                break
            }
            case '/client/connect': {
                if (is<{ endpointUrl: string }>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.clientService, Infos.connectionCreated, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('{ endpointUrl: string }')
                }
                break
            }
            case '/client/endpoints': {
                if (is<{ reduce: boolean } | undefined>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.clientService, Infos.connectionCreated, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('{ endpointUrl: string }')
                }
                break
            }
            case '/client/disconnect': {
                if (is<{ deleteSubscription: boolean } | undefined>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.clientService, Infos.sessionClosed))
                    Log.info(new ClientInfo(Sources.clientService, Infos.clientDisconnect))
                    await next()
                } else {
                    throw validateError('{ deleteSubscription: boolean } | {}')
                }
                break
            }
            case '/client/private_key': {
                Log.info(new ClientInfo(Sources.clientService, Infos.getPrivateKey))
                break
            }
            case 'client/cert': {
                Log.info(new ClientInfo(Sources.clientService, Infos.getCertificate))
                break
            }
            default:
                await next()
        }
    }

    export async function sessionValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.body) {
            case '/session/init': {
                if (is<UserIdentityInfo | undefined>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.sessionService, Infos.sessionCreated))
                    await next()
                } else {
                    throw validateError('UserIdentityInfo | undefined')
                }
                break
            }
            case '/session/change_identity': {
                if (is<UserIdentityInfo>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('UserIdentityInfo')
                }
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
                if (is<ReadValueIdOptions>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('ReadValueIdOptions')
                }
                break
            }
            case '/session/id': {
                if (is<{ path: string }>(ctx.query)) {
                    Log.info(new ClientInfo(Sources.sessionService, Infos.getIdByName, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('{ path: string }')
                }
                break
            }
            case '/session/write': {
                if (is<WriteValueOptions>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('WriteValueOptions')
                }
                break
            }
            case '/session/browse': {
                if (is<{ node: BrowseDescriptionLike, browseNext: boolean }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ nodes: BrowseDescriptionLike, browseNext: boolean }')
                }
                break
            }
            default:
                await next()
        }
    }

    export async function subscriptValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.path) {
            case '/subscript/init': {
                if (is<ClientSubscriptionOptions | undefined>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.subscriptService, Infos.installedSub))
                    await next()
                } else {
                    throw validateError('ClientSubscriptionOptions')
                }
                break
            }
            case '/subscript/modify': {
                if (is<ModifySubscriptionOptions>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.subscriptService, Infos.modifySubscription, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('ModifySubscriptionOptions')
                }
                break
            }
            case '/subscript/item/group': {
                if (is<SubscriptGroupParam>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.subscriptService, Infos.monitoredItemInit, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('SubscriptGroupParam')
                }
                break
            }
            case '/subscript/item/single': {
                if (is<SubscriptSingleParam>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.subscriptService, Infos.monitoredItemInit, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('SubscriptSingleParam')
                }
                break
            }
            case '/subscript/item/delete': {
                if (is<NodeID[]>(ctx.request.body)) {
                    Log.info(new ClientInfo(Sources.subscriptService, Infos.monitoredItemTerminate, {...ctx.request.body}))
                    await next()
                } else {
                    throw validateError('NodeID[]')
                }
                break
            }
            case '/subscript/terminate': {
                Log.info(new ClientInfo(Sources.subscriptService, Infos.terminateSub))
                await next()
                break
            }
            default:
                await next()
        }
    }

    export async function certValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.body) {
            case '/cert/create': {
                if (is<CreateSelfSignCertificateParam1>(ctx.request.body)) {
                    if (CertUtils.validateCertOptions(ctx.request.body)) {
                        Log.info(new ClientInfo(Sources.paramValidator, Infos.certCreated))
                        await next()
                    } else {
                        throw new ClientError(Sources.paramValidator, Errors.errorCertOptions, 'country too long')
                    }
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }
            case '/cert/trust_status' || '/cert/trust' || '/cert/reject': {
                if (is<Certificate>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('Buffer')
                }
                break
            }
            default:
                await next()
        }
    }

    export async function dbValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.body) {
            case '/db/init': {
                if (is<{ createMode: TableCreateModes, tableName?: string, fields?: IFieldNames }>(ctx.request.body)) {
                    DbUtils.validateDbName(ctx.request.body['tableName'])
                    await next()
                } else {
                    throw validateError('{createMode:TableCreateModes, tableName?:string, fields:IFieldNames}')
                }
                break
            }
            case '/db/insert': {
                if (is<IDbData>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('IDbData')
                }
                break
            }
            case '/db/insert_many': {
                if (is<IDbData[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('IDbData[]')
                }
                break
            }
            case '/db/create_table': {
                if (is<{ tableName?: string, fieldNames?: IFieldNames } | undefined>(ctx.request.body)) {
                    if (ctx.request.body) {
                        if ('tableName' in ctx.request.body) {
                            if (!DbUtils.validateDbName(ctx.request.body['tableName'] as string)) {
                                throw new ClientError(Sources.paramValidator, Errors.unFormatDbName,
                                    'It cannot start with a number. The name can only contain: ' +
                                    'Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters')
                            }
                        }
                        if ('fieldNames' in ctx.request.body && ctx.request.body['fieldNames']) {
                            let key: keyof IFieldNames
                            for (key in ctx.request.body['fieldNames']) {
                                if (!DbUtils.validateDbName(ctx.request.body['fieldNames'][key])) {
                                    throw new ClientError(Sources.paramValidator, Errors.unFormatDbName,
                                        'It cannot start with a number. The name can only contain: ' +
                                        'Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters')
                                }
                            }
                        }
                    }
                    await next()
                } else {
                    throw validateError('{ tableName?: string, fieldNames?: IFieldNames } | undefined')
                }
                break
            }
            case '/db/backup': {
                if (is<{ fileName: string }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ fileName: string }')
                }
                break
            }
            case '/db/config': {
                if (is<{ fileName: string, options: Database.Options }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ fileName: string, options: Database.Options }')
                }
                break
            }
            default:
                await next()
        }
    }

    function validateError(paramType: any) {
        return new ClientError(Sources.paramValidator, Errors.errorValidateParam, `Supposed to be ${paramType}`)
    }
}