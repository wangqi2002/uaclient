import {OPCUACertificateManager, StatusCode} from 'node-opcua'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'

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

    export async function getTrustStatus(serverCertificate: Certificate): Promise<StatusCode> {
        return await certificate.getTrustStatus(serverCertificate)
    }
}