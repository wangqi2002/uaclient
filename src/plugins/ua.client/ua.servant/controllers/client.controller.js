"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ClientController = void 0;
const client_service_1 = require("../services/client.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
var ClientController;
(function (ClientController) {
    async function init(ctx, next) {
        try {
            let clientOptions = ctx.request.body;
            client_service_1.ClientService.createClient(clientOptions);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    ClientController.init = init;

    async function connect(ctx, next) {
        try {
            let param = ctx.request.body;
            if (param['endpointUrl']) {
                let endpointUrl = param['endpointUrl'];
                await client_service_1.ClientService.connectToServer(endpointUrl);
                ctx.body = new response_model_1.ResponseModel();
            }
        } catch (e) {
            throw e;
        }
    }

    ClientController.connect = connect;

    async function disconnect(ctx, next) {
        try {
            let deleteSubscription = ctx.request.body['deleteSubscription'];
            await client_service_1.ClientService.disconnectFromServer(deleteSubscription);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    ClientController.disconnect = disconnect;

    async function getEndpoints(ctx, next) {
        try {
            let endpoints = await client_service_1.ClientService.getEndpoints(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel(endpoints);
        } catch (e) {
            throw e;
        }
    }

    ClientController.getEndpoints = getEndpoints;

    async function getPrivateKey(ctx, next) {
        try {
            ctx.body = client_service_1.ClientService.getPrivateKey();
        } catch (e) {
            throw e;
        }
    }

    ClientController.getPrivateKey = getPrivateKey;

    async function getCertificate(ctx, next) {
        try {
            ctx.body = new response_model_1.ResponseModel(client_service_1.ClientService.getClientCert());
        } catch (e) {
            throw e;
        }
    }

    ClientController.getCertificate = getCertificate;

    async function getServers(ctx, next) {
        try {
            ctx.body = new response_model_1.ResponseModel(client_service_1.ClientService.getServersOnNetwork());
        } catch (e) {
            throw e;
        }
    }

    ClientController.getServers = getServers;
})(ClientController = exports.ClientController || (exports.ClientController = {}));
