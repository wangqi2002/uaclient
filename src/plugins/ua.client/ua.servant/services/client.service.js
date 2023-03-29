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
exports.ClientService = void 0;
const node_opcua_1 = require("node-opcua");
const ua_enums_1 = require("../../common/ua.enums");
const session_service_1 = require("./session.service");
const config_default_1 = require("../../config/config.default");
const log_1 = require("../../../../platform/base/log");
var ClientService;
(function (ClientService) {
    ClientService.uaConnectionAlive = false;
    ClientService.currentServer = 'No Server';
    let clientOption = config_default_1.Config.defaultClient;
    function createClient(clientOptions = clientOption) {
        try {
            ClientService.client = node_opcua_1.OPCUAClient.create(clientOptions);
        }
        catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.clientService, ua_enums_1.UaErrors.errorCreateClient, e.message, e.stack);
        }
    }
    ClientService.createClient = createClient;
    function connectToServer(endpointUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ClientService.client.connect(endpointUrl);
                ClientService.uaConnectionAlive = true;
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.clientService, ua_enums_1.UaErrors.errorConnecting, e.message, e.stack);
            }
        });
    }
    ClientService.connectToServer = connectToServer;
    function disconnectFromServer(deleteSubscription = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (session_service_1.SessionService.session) {
                try {
                    yield session_service_1.SessionService.closeSession(deleteSubscription);
                    ClientService.uaConnectionAlive = false;
                }
                catch (e) {
                    throw new log_1.ClientError(ua_enums_1.UaSources.clientService, ua_enums_1.UaErrors.errorClosingSession, e.message, e.stack);
                }
            }
            yield ClientService.client.disconnect();
        });
    }
    ClientService.disconnectFromServer = disconnectFromServer;
    //todo 测试此项
    function getServersOnNetwork(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let servers = yield ClientService.client.findServersOnNetwork(options);
                if (!servers)
                    throw new log_1.ClientWarn(ua_enums_1.UaSources.clientService, ua_enums_1.UaWarns.serversNotExist);
                return servers;
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.clientService, ua_enums_1.UaErrors.errorGetServers, e.message, e.stack);
            }
        });
    }
    ClientService.getServersOnNetwork = getServersOnNetwork;
    function getEndpoints(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (params && params['clientExist'] === false && params['endpoint']) {
                    ClientService.client = node_opcua_1.OPCUAClient.create(clientOption);
                    yield connectToServer(params['endpoint']);
                }
                let endpoints = yield ClientService.client.getEndpoints();
                if (!endpoints)
                    throw new log_1.ClientWarn(ua_enums_1.UaSources.clientService, ua_enums_1.UaWarns.endPointsNotExist);
                if (params && params['reduce']) {
                    let re = /^.*?#/;
                    return endpoints.map(endpoint => ({
                        endpointUrl: endpoint.endpointUrl,
                        securityMode: node_opcua_1.MessageSecurityMode[endpoint.securityMode].toString(),
                        securityPolicy: endpoint.securityPolicyUri
                            ? endpoint.securityPolicyUri.toString().replace(re, '')
                            : undefined
                    }));
                }
                else {
                    return endpoints;
                }
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.clientService, ua_enums_1.UaErrors.errorGetEndpoints, e.message, e.stack);
            }
        });
    }
    ClientService.getEndpoints = getEndpoints;
    function getPrivateKey() {
        return ClientService.client.getPrivateKey();
    }
    ClientService.getPrivateKey = getPrivateKey;
    function getClientCert() {
        return ClientService.client.getCertificate();
    }
    ClientService.getClientCert = getClientCert;
})(ClientService = exports.ClientService || (exports.ClientService = {}));
function f() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ClientService.connectToServer('a');
    });
}
// f()
