"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.SessionController = void 0;
const session_service_1 = require("../services/session.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
var SessionController;
(function (SessionController) {
    async function init(ctx, next) {
        try {
            let userInfo = ctx.request.body;
            await session_service_1.SessionService.createSession(userInfo);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SessionController.init = init;

    async function changeIdentity(ctx, next) {
        try {
            let userInfo = ctx.request.body;
            await session_service_1.SessionService.changeIdentity(userInfo);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SessionController.changeIdentity = changeIdentity;

    async function close(ctx, next) {
        try {
            let param = ctx.request.body;
            'deleteSubscription' in param
                ? await session_service_1.SessionService.closeSession(param['deleteSubscription'])
                : await session_service_1.SessionService.closeSession();
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SessionController.close = close;

    async function readById(ctx, next) {
        try {
            let node = ctx.request.body;
            ctx.body = new response_model_1.ResponseModel(await session_service_1.SessionService.readByNodeId(node));
        } catch (e) {
            throw e;
        }
    }

    SessionController.readById = readById;

    async function getIdByName(ctx, next) {
        try {
            let param = ctx.query;
            if (param && 'path' in param) {
                // @ts-ignore
                let path = param['path'].toString();
                let result = await session_service_1.SessionService.getNodeIdByBrowseName(path);
                ctx.body = new response_model_1.ResponseModel(result);
            }
        } catch (e) {
            throw e;
        }
    }

    SessionController.getIdByName = getIdByName;

    async function write(ctx, next) {
        try {
            let param = ctx.request.body;
            await session_service_1.SessionService.writeToServer(param);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SessionController.write = write;

    async function browseRoot(ctx, next) {
        try {
            let result = await session_service_1.SessionService.browseRootFolder();
            ctx.body = new response_model_1.ResponseModel(result);
        } catch (e) {
            throw e;
        }
    }

    SessionController.browseRoot = browseRoot;

    async function browse(ctx, next) {
        try {
            let result = await session_service_1.SessionService.browse(ctx.request.body['node'], ctx.request.body['browseNext']);
            ctx.body = new response_model_1.ResponseModel(result);
        } catch (e) {
            throw e;
        }
    }

    SessionController.browse = browse;

    async function serverCert(ctx, next) {
        try {
            ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
        } catch (e) {
            throw e;
        }
    }

    SessionController.serverCert = serverCert;

    async function history(ctx, next) {
        try {
            await session_service_1.SessionService.historyRead(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
        } catch (e) {
            throw e;
        }
    }

    SessionController.history = history;

    async function historyValue(ctx, next) {
        try {
            await session_service_1.SessionService.readHistoryValue(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
        } catch (e) {
            throw e;
        }
    }

    SessionController.historyValue = historyValue;
})(SessionController = exports.SessionController || (exports.SessionController = {}));
