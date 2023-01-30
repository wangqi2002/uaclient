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
import {Errors, Sources, TableCreateModes} from '../../common/enums'
import {AddManyParam, AddOneParam} from '../models/params.model'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import {IFieldNames} from '../models/db.model'
import {DbData} from '../models/data.model'
import Database from 'better-sqlite3'

export module ValidatorMiddleware {

    /**
     * @description
     * 验证所有请求参数并且抛出异常,当使用数据库服务时会验证表名是否符合标准,如果出现参数错误会返回ClientError
     * @param ctx
     * @param next
     */
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

            case '/db/init': {
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
                if (is<{ tableName?: string, fieldNames?: IFieldNames }>(ctx.request.body)) {
                    validateDbName(ctx.request.body['tableName'])
                    await next()
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }
            case '/db/backup': {
                if (is<{ fileName: string }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }
            case '/db/config': {
                if (is<{ fileName: string, options: Database.Options }>(ctx.request.body)) {
                    await next()
                } else {
                    throw validateError('CreateSelfSignCertificateParam1')
                }
                break
            }

            default:
                await next()
        }
    }

    function validateError(type: any) {
        return new ClientError(Sources.paramValidator, Errors.errorValidateParam, `Supposed to be ${type}`)
    }

    function validateDbName(str?: string) {
        if (str) {
            let reg = new RegExp('^[a-zA-Z_][\u4E00-\u9FA5A-Za-z0-9]{2,20}$')
            if (!reg.test(str)) throw new ClientError(Sources.paramValidator, Errors.unFormatDbName)
        } else {
            return false
        }
        return true
    }
}