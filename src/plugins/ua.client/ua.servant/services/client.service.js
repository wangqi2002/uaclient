import { MessageSecurityMode, OPCUAClient } from 'node-opcua';
import { UaErrors, UaSources, UaWarns } from '../../common/ua.enums';
import { SessionService } from './session.service';
import { Config } from '../../config/config.default';
import { ClientError, ClientWarn } from '../../../../platform/base/log/log';
export var ClientService;
(function (ClientService) {
    ClientService.uaConnectionAlive = false;
    ClientService.currentServer = 'No Server';
    let clientOption = Config.defaultClient;
    function createClient(clientOptions = clientOption) {
        try {
            ClientService.client = OPCUAClient.create(clientOptions);
        }
        catch (e) {
            throw new ClientError(UaSources.clientService, UaErrors.errorCreateClient, e.message, e.stack);
        }
    }
    ClientService.createClient = createClient;
    async function connectToServer(endpointUrl) {
        try {
            await ClientService.client.connect(endpointUrl);
            ClientService.uaConnectionAlive = true;
        }
        catch (e) {
            throw new ClientError(UaSources.clientService, UaErrors.errorConnecting, e.message, e.stack);
        }
    }
    ClientService.connectToServer = connectToServer;
    async function disconnectFromServer(deleteSubscription = true) {
        if (SessionService.session) {
            try {
                await SessionService.closeSession(deleteSubscription);
                ClientService.uaConnectionAlive = false;
            }
            catch (e) {
                throw new ClientError(UaSources.clientService, UaErrors.errorClosingSession, e.message, e.stack);
            }
        }
        await ClientService.client.disconnect();
    }
    ClientService.disconnectFromServer = disconnectFromServer;
    //todo 测试此项
    async function getServersOnNetwork(options) {
        try {
            let servers = await ClientService.client.findServersOnNetwork(options);
            if (!servers)
                throw new ClientWarn(UaSources.clientService, UaWarns.serversNotExist);
            return servers;
        }
        catch (e) {
            throw new ClientError(UaSources.clientService, UaErrors.errorGetServers, e.message, e.stack);
        }
    }
    ClientService.getServersOnNetwork = getServersOnNetwork;
    async function getEndpoints(params) {
        try {
            if (params && params['clientExist'] === false && params['endpoint']) {
                ClientService.client = OPCUAClient.create(clientOption);
                await connectToServer(params['endpoint']);
            }
            let endpoints = await ClientService.client.getEndpoints();
            if (!endpoints)
                throw new ClientWarn(UaSources.clientService, UaWarns.endPointsNotExist);
            if (params && params['reduce']) {
                let re = /^.*?#/;
                return endpoints.map((endpoint) => ({
                    endpointUrl: endpoint.endpointUrl,
                    securityMode: MessageSecurityMode[endpoint.securityMode].toString(),
                    securityPolicy: endpoint.securityPolicyUri
                        ? endpoint.securityPolicyUri.toString().replace(re, '')
                        : undefined,
                }));
            }
            else {
                return endpoints;
            }
        }
        catch (e) {
            throw new ClientError(UaSources.clientService, UaErrors.errorGetEndpoints, e.message, e.stack);
        }
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
})(ClientService || (ClientService = {}));
async function f() {
    await ClientService.connectToServer('a');
}
// f()
