import {FindServersOnNetworkRequestOptions, OPCUAClient, OPCUAClientOptions,} from 'node-opcua'
import {Errors, Sources, Warns} from '../../common/enums'
import {SessionService} from './session.service'
import {ClientError, ClientWarn} from '../models/infos.model'
import {Config} from '../../config/config.default'

export module ClientService {

    export let client!: OPCUAClient
    export let uaConnectionAlive: boolean = false
    export let currentServer: string = 'no server'
    let clientOption = Config.defaultClient

    export function createClient(clientOptions: OPCUAClientOptions = clientOption) {
        try {
            client = OPCUAClient.create(clientOptions)
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorCreateClient, e.message)
        }
    }

    export async function connectToServer(endpointUrl: string) {
        try {
            await client.connect(endpointUrl)
            uaConnectionAlive = true
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorConnecting, e.message)
        }
    }

    export async function disconnectFromServer(deleteSubscription: boolean = true) {
        if (SessionService.session) {
            try {
                await SessionService.closeSession(deleteSubscription)
                uaConnectionAlive = false
            } catch (e: any) {
                throw new ClientError(Sources.clientService, Errors.errorClosingSession, e.message)
            }
        }
        await client.disconnect()
    }

    export async function getServersOnNetwork(options?: FindServersOnNetworkRequestOptions) {
        try {
            let servers = await client.findServersOnNetwork(options)
            if (!servers) throw new ClientWarn(Sources.clientService, Warns.serversNotExist)
            return servers
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorGetServers, e.message)
        }
    }

    export async function getEndpoints(reduce?: boolean) {
        try {
            let endpoints = await client.getEndpoints()
            if (!endpoints) throw new ClientWarn(Sources.clientService, Warns.endPointsNotExist)
            if (reduce) {
                return endpoints.map(endpoint => ({
                    endpointUrl: endpoint.endpointUrl,
                    securityMode: endpoint.securityMode.toString(),
                    securityPolicy: endpoint.securityPolicyUri ? endpoint.securityPolicyUri.toString() : undefined,
                }))
            } else {
                return endpoints
            }
        } catch (e: any) {
            throw new ClientError(Sources.clientService, Errors.errorGetEndpoints, e.message)
        }
    }

    export function getPrivateKey() {
        return client.getPrivateKey()
    }

    export function getClientCert() {
        return client.getCertificate()
    }
}