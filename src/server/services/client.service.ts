import {UaSession} from '../../common/client.classes'
import {
    EndpointDescription,
    FindServersOnNetworkRequestOptions,
    MessageSecurityMode,
    OPCUACertificateManager,
    OPCUAClient,
    OPCUAClientOptions,
    SecurityPolicy,
    ServerOnNetwork,
    StatusCode,
    UserIdentityInfo,
} from 'node-opcua'
import {Log} from '../../common/log'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import {Errors, Infos, Sources, Warns} from '../../common/enums'
import {ClientError, ClientInfo, ClientWarn} from '../../common/informations'

export module ClientService {

    // let sourceModule:SourceModules=SourceModules.clientService
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
    export let uaSession!: UaSession

    export function createClient(clientOptions: OPCUAClientOptions) {
        client = OPCUAClient.create(clientOptions)
        Log.info(new ClientInfo(Sources.clientService, Infos.clientCreated))
    }

    export async function createClientSession(userInfo?: UserIdentityInfo) {
        uaSession = new UaSession(userInfo)
        await uaSession.createSession(client)
        Log.info(new ClientInfo(Sources.clientService, Infos.sessionCreated))
    }

    export async function connectToServer(endpointUrl: string) {
        try {
            await client.connect(endpointUrl)
            Log.info(new ClientInfo(Sources.clientService, Infos.connectionCreated,{Endpoint:endpointUrl}))
        } catch (e) {
            throw new ClientError(Sources.clientService, Errors.errorConnecting,{Error:e.message})
        }
    }

    export async function disconnectFromServer(deleteSubscription?: boolean) {
        if (uaSession) {
            try {
                if (deleteSubscription) {
                    await uaSession.closeSession(deleteSubscription)
                } else {
                    await uaSession.closeSession()
                }
                Log.info(new ClientInfo(Sources.clientService, Infos.sessionClosed))
            } catch (e: any) {
                throw new ClientError(Sources.clientService, Errors.errorClosingSession,{Error:e.message})
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

export module CertificateService {
    let path = require('path')
    export let certificate = new OPCUACertificateManager({
        rootFolder: path.join(__dirname, '..', '..', '..'),
        name: 'pki',
        automaticallyAcceptUnknownCertificate: false
    })

    /**
     * @description 创建一个证书,dns即domin names,默认证书根文件夹为项目根目录,
     * 默认pem文件存放路径为own/cert/self_signed_certificate.pem
     * validity为有效时间
     * 具体请转到CreateSelfSignCertificateParam1声明处查看
     * @param params
     */
    export async function createCertificate(params: CreateSelfSignCertificateParam1) {
        await certificate.createSelfSignedCertificate({...params})
    }

    export async function trustServerCertificate(serverCertificate: Certificate) {
        await certificate.trustCertificate(serverCertificate)
    }

    export async function rejectServerCertificate(serverCertificate: Certificate) {
        await certificate.rejectCertificate(serverCertificate)
    }

    export async function getTrustStatus(serverCertificate: Certificate):Promise<StatusCode> {
        return await certificate.getTrustStatus(serverCertificate)
    }
}
