import {UaSession} from '../../common/client.classes'
import {
    CertificateManager,
    EndpointDescription,
    FindServersOnNetworkRequestOptions,
    MessageSecurityMode, OPCUACertificateManager,
    OPCUAClient,
    OPCUAClientOptions, OPCUAServerEndPoint,
    SecurityPolicy, ServerOnNetwork, StatusCode,
    UserIdentityInfo,
} from 'node-opcua'
import {Log} from '../../common/log'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'

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
    export let uaSession!: UaSession

    export function createClient(clientOptions: OPCUAClientOptions) {
        client = OPCUAClient.create(clientOptions)
    }

    export async function createClientSession(userInfo?: UserIdentityInfo) {
        uaSession = new UaSession(userInfo)
        await uaSession.createSession(client)
    }

    export async function connectToServer(endpointUrl: string) {
        try {
            await client.connect(endpointUrl)
            Log.info('Established connection.', {Endpoint: endpointUrl})
            console.log('success')
        } catch (e) {
            Log.error('error')
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
                Log.info('Session closed')
            } catch (e: any) {
                Log.error('Error closing UA session.', {error: e.message})
            }
        }
        await client.disconnect()
        Log.info('Client disconnected')
    }

    export async function getServersOnNetwork(options?: FindServersOnNetworkRequestOptions): Promise<ServerOnNetwork[]> {
        let servers = await client.findServersOnNetwork(options)
        if (!servers) Log.error('no servers')
        return servers
    }

    export async function getEndpoints(): Promise<EndpointDescription[]> {
        let endpoints = await client.getEndpoints()
        if (!endpoints) Log.warn('endpoints不存在')
        return endpoints
    }

    export function getPrivateKey() {
        Log.info('get private key')
        return client.getPrivateKey()
    }

    export function getCertificate() {
        Log.info('get certificate')
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
