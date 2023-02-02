import {
    EndpointDescription,
    FindServersOnNetworkRequestOptions,
    MessageSecurityMode,
    OPCUAClient,
    OPCUAClientOptions,
    SecurityPolicy,
    ServerOnNetwork,
} from 'node-opcua'
import {Log} from '../../common/log'
import {Errors, Infos, Sources, Warns} from '../../common/enums'
import {SessionService} from './session.service'
import {ClientError, ClientInfo, ClientWarn} from '../models/infos.model'

export module ClientService {


    export let client: OPCUAClient = OPCUAClient.create({
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 10,
        },
        keepSessionAlive: true,
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
        requestedSessionTimeout: 36000,
    })
    export let uaConnectionAlive: boolean = false
    export let currentServer: string = 'no server'

    export function createClient(clientOptions?: OPCUAClientOptions) {
        try {
            if (clientOptions) client = OPCUAClient.create(clientOptions)
            Log.info(new ClientInfo(Sources.clientService, Infos.clientCreated))
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorCreateClient, e.message)
        }
    }

    export async function connectToServer(endpointUrl: string) {
        try {
            await client.connect(endpointUrl)
            uaConnectionAlive = true
            Log.info(new ClientInfo(Sources.clientService, Infos.connectionCreated, {Endpoint: endpointUrl}))
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorConnecting, e.message)
        }
    }

    export async function disconnectFromServer(deleteSubscription?: boolean) {
        if (SessionService.session) {
            try {
                if (deleteSubscription) {
                    await SessionService.closeSession(deleteSubscription)
                } else {
                    await SessionService.closeSession()
                }
                uaConnectionAlive = false
                Log.info(new ClientInfo(Sources.clientService, Infos.sessionClosed))
            } catch (e: any) {
                throw new ClientError(Sources.clientService, Errors.errorClosingSession, e.message)
            }
        }
        await client.disconnect()
        Log.info(new ClientInfo(Sources.clientService, Infos.clientDisconnect))
    }

    export async function getServersOnNetwork(options?: FindServersOnNetworkRequestOptions): Promise<ServerOnNetwork[]> {
        try {
            let servers = await client.findServersOnNetwork(options)
            if (!servers) Log.warn(new ClientWarn(Sources.clientService, Warns.serversNotExist))
            return servers
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorGetServers, e.message)
        }
    }

    export async function getEndpoints(): Promise<EndpointDescription[]> {
        try {
            let endpoints = await client.getEndpoints()
            if (!endpoints) Log.warn(new ClientWarn(Sources.clientService, Warns.endPointsNotExist))
            return endpoints
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorGetEndpoints, e.message)
        }
    }

    export function getPrivateKey() {
        Log.info(new ClientInfo(Sources.clientService, Infos.getPrivateKey))
        return client.getPrivateKey()
    }

    export function getClientCert() {
        Log.info(new ClientInfo(Sources.clientService, Infos.getCertificate))
        return client.getCertificate()
    }
}