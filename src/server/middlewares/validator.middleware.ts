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
import {Errors, Sources, TableCreateModes} from '../../common/enums'
import {AddManyParam, AddOneParam} from '../models/params.model'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import {DbData, IFieldNames} from '../models/db.model'
import Database from 'better-sqlite3'
import {ClientError} from '../models/infos.model'
import {validateDbName} from '../utils/util'

export module ValidatorMiddleware {

    /**
     * @description 验证所有请求参数并且抛出异常,当使用数据库服务时会验证表名是否符合标准,如果出现参数错误会返回ClientError
     * @param ctx
     * @param next
     */
    export async function paramValidator(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        switch (ctx.request.path) {
            case '/client': {
                console.log(ctx.request.body)
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
                    throw validateError('{ deleteSubscription: boolean } | {}')
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
                if (is<UserIdentityInfo>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('UserIdentityInfo')
                }
                break
            }
            case '/session/close': {
                if (is<{ deleteSubscription: string } | undefined>(ctx.request.body)) {
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
                if (is<{ node: BrowseDescriptionLike, browseNext: string }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('{ nodes: BrowseDescriptionLike, browseNext: boolean }')
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
                console.log(ctx.request.body)
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
                    throw validateError('AddManyParam')
                }
                break
            }
            case '/subscript/add_one': {
                if (is<AddOneParam>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('AddOneParam')
                }
                break
            }
            case '/subscript/delete_items': {
                if (is<string[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('string[]')
                }
                break
            }

            case '/cert/create': {
                if (is<CreateSelfSignCertificateParam1>(ctx.request.body)) {
                    await next()
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

            case '/db': {
                if (is<{ createMode: TableCreateModes, tableName?: string, fields?: IFieldNames }>(ctx.request.body)) {
                    validateDbName(ctx.request.body['tableName'])
                    await next()
                } else {
                    throw validateError('{createMode:TableCreateModes, tableName?:string, fields:IFieldNames}')
                }
                break
            }
            case '/db/insert': {
                if (is<DbData>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }
            case '/db/insert_many': {
                if (is<DbData[]>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }
            case '/db/create_table': {
                if (is<{ tableName?: string, fieldNames?: IFieldNames } | undefined>(ctx.request.body)) {
                    if (ctx.request.body) validateDbName(ctx.request.body['tableName'])
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