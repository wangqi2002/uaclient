import {OPCUACertificateManager, StatusCode} from 'node-opcua'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import {Errors, Infos, Sources} from '../../common/enums'
import {Log} from '../../common/log'
import {ClientError, ClientInfo} from '../models/infos.model'

export module CertificateService {
    let path = require('path')
    export let certificate = new OPCUACertificateManager({
        rootFolder: path.join(__dirname, '..', '..', '..'),
        name: 'pki',
        automaticallyAcceptUnknownCertificate: false
    })

    /**
     * @description 创建一个证书,dns即domain names,默认证书根文件夹为项目根目录,
     * 默认pem文件存放路径为own/cert/self_signed_certificate.pem
     * validity为有效时间
     * 具体请转到CreateSelfSignCertificateParam1声明处查看
     * @example
     * createSelfSignedCertificate({
     *     subject: "/CN=MyCommonName;/L=Paris",
     *     startDate: new Date(),
     *     dns: [],
     *     validity: 365 * 5, // five year
     *     applicationUri: "Put you application URI here ",
     *     outputFile: certificateFile,
     * })
     * @param params
     */
    export async function createCertificate(params: CreateSelfSignCertificateParam1) {
        try {
            await certificate.createSelfSignedCertificate({...params})
            Log.info(new ClientInfo(Sources.paramValidator, Infos.certCreated))
        } catch (e: any) {
            throw new ClientError(Sources.certService, Errors.errorCreatCert, e.message)
        }
    }

    export async function trustServerCertificate(serverCertificate: Certificate) {
        try {
            await certificate.trustCertificate(serverCertificate)
        } catch (e: any) {
            throw new ClientError(Sources.certService, Errors.errorTrustCert, e.message)
        }
    }

    export async function rejectServerCertificate(serverCertificate: Certificate) {
        try {
            await certificate.rejectCertificate(serverCertificate)
        } catch (e: any) {
            throw new ClientError(Sources.certService, Errors.errorRejectCert, e.message)
        }
    }

    /**
     * @description 返回server证书的信任状态
     * @param serverCertificate
     */
    export async function getTrustStatus(serverCertificate: Certificate): Promise<StatusCode> {
        try {
            return await certificate.getTrustStatus(serverCertificate)
        } catch (e: any) {
            throw new ClientError(Sources.certService, Errors.errorGetTrust, e.message)
        }
    }
}

