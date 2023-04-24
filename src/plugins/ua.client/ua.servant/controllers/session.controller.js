import { SessionService } from '../services/session.service';
import { ResponseModel } from '../models/response.model';
import 'koa-body/lib/index';
export var SessionController;
(function (SessionController) {
    async function init(ctx, next) {
        try {
            let userInfo = ctx.request.body;
            await SessionService.createSession(userInfo);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.init = init;
    async function changeIdentity(ctx, next) {
        try {
            let userInfo = ctx.request.body;
            await SessionService.changeIdentity(userInfo);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.changeIdentity = changeIdentity;
    async function close(ctx, next) {
        try {
            let param = ctx.request.body;
            'deleteSubscription' in param
                ? await SessionService.closeSession(param['deleteSubscription'])
                : await SessionService.closeSession();
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.close = close;
    async function readById(ctx, next) {
        try {
            let node = ctx.request.body;
            ctx.body = new ResponseModel(await SessionService.readByNodeId(node));
        }
        catch (e) {
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
                let result = await SessionService.getNodeIdByBrowseName(path);
                ctx.body = new ResponseModel(result);
            }
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.getIdByName = getIdByName;
    async function write(ctx, next) {
        try {
            let param = ctx.request.body;
            await SessionService.writeToServer(param);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.write = write;
    async function browseRoot(ctx, next) {
        try {
            let result = await SessionService.browseRootFolder();
            ctx.body = new ResponseModel(result);
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.browseRoot = browseRoot;
    async function browse(ctx, next) {
        try {
            let result = await SessionService.browse(ctx.request.body['node'], ctx.request.body['browseNext']);
            ctx.body = new ResponseModel(result);
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.browse = browse;
    async function serverCert(ctx, next) {
        try {
            ctx.body = new ResponseModel(SessionService.serverCert());
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.serverCert = serverCert;
    async function history(ctx, next) {
        try {
            await SessionService.historyRead(ctx.request.body);
            ctx.body = new ResponseModel(SessionService.serverCert());
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.history = history;
    async function historyValue(ctx, next) {
        try {
            await SessionService.readHistoryValue(ctx.request.body);
            ctx.body = new ResponseModel(SessionService.serverCert());
        }
        catch (e) {
            throw e;
        }
    }
    SessionController.historyValue = historyValue;
})(SessionController || (SessionController = {}));
