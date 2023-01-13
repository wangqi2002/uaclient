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
import {ClientError, ClientInfo, ClientWarn} from '../../common/informations'
import {SessionService} from './session.service'

export module ClientService {

    export let client: OPCUAClient = OPCUAClient.create({
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 1,
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
    })
    export let uaConnectionAlive: boolean = false

    export function createClient(clientOptions: OPCUAClientOptions) {
        client = OPCUAClient.create(clientOptions)
        Log.info(new ClientInfo(Sources.clientService, Infos.clientCreated))
    }

    export async function connectToServer(endpointUrl: string) {
        try {
            await client.connect(endpointUrl)
            Log.info(new ClientInfo(Sources.clientService, Infos.connectionCreated, {Endpoint: endpointUrl}))
        } catch (e) {
            throw new ClientError(Sources.clientService, Errors.errorConnecting, {Error: e.message})
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
                Log.info(new ClientInfo(Sources.clientService, Infos.sessionClosed))
            } catch (e: any) {
                throw new ClientError(Sources.clientService, Errors.errorClosingSession, {Error: e.message})
            }
        }
        await client.disconnect()
        Log.info(new ClientInfo(Sources.clientService, Infos.clientDisconnect))
    }

    export async function getServersOnNetwork(options?: FindServersOnNetworkRequestOptions): Promise<ServerOnNetwork[]> {
        let servers = await client.findServersOnNetwork(options)
        if (!servers) Log.warn(new ClientWarn(Sources.clientService, Warns.serversNotExist))
        return servers
    }

    export async function getEndpoints(): Promise<EndpointDescription[]> {
        let endpoints = await client.getEndpoints()
        if (!endpoints) Log.warn(new ClientWarn(Sources.clientService, Warns.endPointsNotExist))
        return endpoints
    }

    export function getPrivateKey() {
        Log.info(new ClientInfo(Sources.clientService, Infos.getPrivateKey))
        return client.getPrivateKey()
    }

    export function getCertificate() {
        Log.info(new ClientInfo(Sources.clientService, Infos.getCertificate))
        return client.getCertificate()
    }

}

