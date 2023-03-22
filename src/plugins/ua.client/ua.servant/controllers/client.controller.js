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
exports.ClientController = void 0;
const client_service_1 = require("../services/client.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
var ClientController;
(function (ClientController) {
    function init(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let clientOptions = ctx.request.body;
                client_service_1.ClientService.createClient(clientOptions);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.init = init;
    function connect(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let param = ctx.request.body;
                if (param['endpointUrl']) {
                    let endpointUrl = param['endpointUrl'];
                    yield client_service_1.ClientService.connectToServer(endpointUrl);
                    ctx.body = new response_model_1.ResponseModel();
                }
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.connect = connect;
    function disconnect(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleteSubscription = ctx.request.body['deleteSubscription'];
                yield client_service_1.ClientService.disconnectFromServer(deleteSubscription);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.disconnect = disconnect;
    function getEndpoints(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let endpoints = yield client_service_1.ClientService.getEndpoints(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel(endpoints);
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.getEndpoints = getEndpoints;
    function getPrivateKey(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ctx.body = client_service_1.ClientService.getPrivateKey();
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.getPrivateKey = getPrivateKey;
    function getCertificate(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ctx.body = new response_model_1.ResponseModel(client_service_1.ClientService.getClientCert());
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.getCertificate = getCertificate;
    function getServers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ctx.body = new response_model_1.ResponseModel(client_service_1.ClientService.getServersOnNetwork());
            } catch (e) {
                throw e;
            }
        });
    }
    ClientController.getServers = getServers;
})(ClientController = exports.ClientController || (exports.ClientController = {}));
