"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentMiddleware = void 0;
require("koa-body/lib/index");
const typia_1 = require("typia");
const ua_enums_1 = require("../../common/ua.enums");
const log_1 = require("../../../../platform/base/log/log");
const util_1 = require("../utils/util");
var AgentMiddleware;
(function (AgentMiddleware) {
    function clientValidator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ctx.request.path) {
                case '/client/init': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.clientCreated, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('OPCUAClientOptions | undefined');
                    }
                    break;
                }
                case '/client/connect': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.connectionCreated, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('{ endpointUrl: string }');
                    }
                    break;
                }
                case '/client/endpoints': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.connectionCreated, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('{ endpointUrl: string }');
                    }
                    break;
                }
                case '/client/disconnect': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.sessionClosed));
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.clientDisconnect));
                        yield next();
                    }
                    else {
                        throw validateError('{ deleteSubscription: boolean } | {}');
                    }
                    break;
                }
                case '/client/private_key': {
                    log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.getPrivateKey));
                    break;
                }
                case 'client/cert': {
                    log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.clientService, ua_enums_1.UaInfos.getCertificate));
                    break;
                }
                default:
                    yield next();
            }
        });
    }
    AgentMiddleware.clientValidator = clientValidator;
    function sessionValidator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ctx.request.body) {
                case '/session/init': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.sessionService, ua_enums_1.UaInfos.sessionCreated));
                        yield next();
                    }
                    else {
                        throw validateError('UserIdentityInfo | undefined');
                    }
                    break;
                }
                case '/session/change_identity': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('UserIdentityInfo');
                    }
                    break;
                }
                case '/session/close': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('{ deleteSubscription: boolean } | undefined');
                    }
                    break;
                }
                case '/session/read': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('ReadValueIdOptions');
                    }
                    break;
                }
                case '/session/id': {
                    if ((0, typia_1.is)(ctx.query)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.sessionService, ua_enums_1.UaInfos.getIdByName, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('{ path: string }');
                    }
                    break;
                }
                case '/session/write': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('WriteValueOptions');
                    }
                    break;
                }
                case '/session/browse': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('{ nodes: BrowseDescriptionLike, browseNext: boolean }');
                    }
                    break;
                }
                case '/session/history': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('HistoryReadRequest');
                    }
                    break;
                }
                case '/session/history/value': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('HistoryValueParam');
                    }
                    break;
                }
                default:
                    yield next();
            }
        });
    }
    AgentMiddleware.sessionValidator = sessionValidator;
    function subscriptValidator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ctx.request.path) {
                case '/subscript/init': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.installedSub));
                        yield next();
                    }
                    else {
                        throw validateError('ClientSubscriptionOptions');
                    }
                    break;
                }
                case '/subscript/modify': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.modifySubscription, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('ModifySubscriptionOptions');
                    }
                    break;
                }
                case '/subscript/item/group': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.monitoredItemInit, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('SubscriptGroupParam');
                    }
                    break;
                }
                case '/subscript/item/single': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.monitoredItemInit, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('SubscriptSingleParam');
                    }
                    break;
                }
                case '/subscript/item/delete': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.monitoredItemTerminate, Object.assign({}, ctx.request.body)));
                        yield next();
                    }
                    else {
                        throw validateError('NodeID[]');
                    }
                    break;
                }
                case '/subscript/terminate': {
                    log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaInfos.terminateSub));
                    yield next();
                    break;
                }
                default:
                    yield next();
            }
        });
    }
    AgentMiddleware.subscriptValidator = subscriptValidator;
    function certValidator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ctx.request.body) {
                case '/cert/create': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        if (util_1.CertUtils.validateCertOptions(ctx.request.body)) {
                            log_1.Log.info(new log_1.ClientInfo(ua_enums_1.UaSources.paramValidator, ua_enums_1.UaInfos.certCreated));
                            yield next();
                        }
                        else {
                            throw new log_1.ClientError(ua_enums_1.UaSources.paramValidator, ua_enums_1.UaErrors.errorCertOptions, 'country too long');
                        }
                    }
                    else {
                        throw validateError('CreateSelfSignCertificateParam1');
                    }
                    break;
                }
                case '/cert/trust_status' || '/cert/trust' || '/cert/reject': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('Buffer');
                    }
                    break;
                }
                default:
                    yield next();
            }
        });
    }
    AgentMiddleware.certValidator = certValidator;
    function dbValidator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ctx.request.body) {
                /**
                 * @description 此处绑定了pipe的事件,并且当
                 */
                case '/db/init': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        util_1.DbUtils.validateDbName(ctx.request.body['tableName']);
                        yield next();
                    }
                    else {
                        throw validateError('{createMode:TableCreateModes, tableName?:string, fields:IFieldNames}');
                    }
                    break;
                }
                case '/db/insert': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('IDbData');
                    }
                    break;
                }
                case '/db/insert_many': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        yield next();
                    }
                    else {
                        throw validateError('IDbData[]');
                    }
                    break;
                }
                case '/db/create_table': {
                    if ((0, typia_1.is)(ctx.request.body)) {
                        if (ctx.request.body) {
                            if ('tableName' in ctx.request.body) {
                                if (!util_1.DbUtils.validateDbName(ctx.request.body['tableName'])) {
                                    throw new log_1.ClientError(ua_enums_1.UaSources.paramValidator, ua_enums_1.UaErrors.unFormatDbName, 'It cannot start with a number. The name can only contain: ' +
                                        'Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters');
                                }
                            }
                            if ('fieldNames' in ctx.request.body && ctx.request.body['fieldNames']) {
                                let key;
                                for (key in ctx.request.body['fieldNames']) {
                                    if (!util_1.DbUtils.validateDbName(ctx.request.body['fieldNames'][key])) {
                                        throw new log_1.ClientError(ua_enums_1.UaSources.paramValidator, ua_enums_1.UaErrors.unFormatDbName, 'It cannot start with a number. The name can only contain: ' +
                                            'Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters');
                                    }
                                }
                            }
                        }
                        yield next();
                    }
                    else {
                        throw validateError('{ tableName?: string, fieldNames?: IFieldNames } | undefined');
                    }
                    break;
                }
                default:
                    yield next();
            }
        });
    }
    AgentMiddleware.dbValidator = dbValidator;
    function validateError(paramType) {
        return new log_1.ClientError(ua_enums_1.UaSources.paramValidator, ua_enums_1.UaErrors.errorValidateParam, `Supposed to be ${paramType}`);
    }
})(AgentMiddleware = exports.AgentMiddleware || (exports.AgentMiddleware = {}));
