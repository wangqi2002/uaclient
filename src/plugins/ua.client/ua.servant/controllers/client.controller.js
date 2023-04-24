import { ClientService } from '../services/client.service';
import { ResponseModel } from '../models/response.model';
import 'koa-body/lib/index';
export var ClientController;
(function (ClientController) {
    async function init(ctx, next) {
        try {
            let clientOptions = ctx.request.body;
            ClientService.createClient(clientOptions);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.init = init;
    async function connect(ctx, next) {
        try {
            let param = ctx.request.body;
            if (param['endpointUrl']) {
                let endpointUrl = param['endpointUrl'];
                await ClientService.connectToServer(endpointUrl);
                ctx.body = new ResponseModel();
            }
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.connect = connect;
    async function disconnect(ctx, next) {
        try {
            let deleteSubscription = ctx.request.body['deleteSubscription'];
            await ClientService.disconnectFromServer(deleteSubscription);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.disconnect = disconnect;
    async function getEndpoints(ctx, next) {
        try {
            let endpoints = await ClientService.getEndpoints(ctx.request.body);
            ctx.body = new ResponseModel(endpoints);
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.getEndpoints = getEndpoints;
    async function getPrivateKey(ctx, next) {
        try {
            ctx.body = ClientService.getPrivateKey();
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.getPrivateKey = getPrivateKey;
    async function getCertificate(ctx, next) {
        try {
            ctx.body = new ResponseModel(ClientService.getClientCert());
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.getCertificate = getCertificate;
    async function getServers(ctx, next) {
        try {
            ctx.body = new ResponseModel(ClientService.getServersOnNetwork());
        }
        catch (e) {
            throw e;
        }
    }
    ClientController.getServers = getServers;
})(ClientController || (ClientController = {}));
