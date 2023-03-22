"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.SessionController = void 0;
const session_service_1 = require("../services/session.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
var SessionController;
(function (SessionController) {
    function init(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userInfo = ctx.request.body;
                yield session_service_1.SessionService.createSession(userInfo);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.init = init;
    function changeIdentity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userInfo = ctx.request.body;
                yield session_service_1.SessionService.changeIdentity(userInfo);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.changeIdentity = changeIdentity;
    function close(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let param = ctx.request.body;
                'deleteSubscription' in param
                    ? yield session_service_1.SessionService.closeSession(param['deleteSubscription'])
                    : yield session_service_1.SessionService.closeSession();
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.close = close;
    function readById(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let node = ctx.request.body;
                ctx.body = new response_model_1.ResponseModel(yield session_service_1.SessionService.readByNodeId(node));
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.readById = readById;
    function getIdByName(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let param = ctx.query;
                if (param && 'path' in param) {
                    // @ts-ignore
                    let path = param['path'].toString();
                    let result = yield session_service_1.SessionService.getNodeIdByBrowseName(path);
                    ctx.body = new response_model_1.ResponseModel(result);
                }
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.getIdByName = getIdByName;
    function write(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let param = ctx.request.body;
                yield session_service_1.SessionService.writeToServer(param);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.write = write;
    function browseRoot(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield session_service_1.SessionService.browseRootFolder();
                ctx.body = new response_model_1.ResponseModel(result);
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.browseRoot = browseRoot;
    function browse(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield session_service_1.SessionService.browse(ctx.request.body['node'], ctx.request.body['browseNext']);
                ctx.body = new response_model_1.ResponseModel(result);
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.browse = browse;
    function serverCert(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.serverCert = serverCert;
    function history(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield session_service_1.SessionService.historyRead(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.history = history;
    function historyValue(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield session_service_1.SessionService.readHistoryValue(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel(session_service_1.SessionService.serverCert());
            } catch (e) {
                throw e;
            }
        });
    }
    SessionController.historyValue = historyValue;
})(SessionController = exports.SessionController || (exports.SessionController = {}));
