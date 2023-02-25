import {OPCUACertificateManager} from 'node-opcua'
import {CreateSelfSignCertificateParam1} from 'node-opcua-pki'
import {Certificate} from 'node-opcua-crypto'
import {Errors, Sources} from '../../common/enums'
import {ClientError} from '../models/infos.model'
import path from 'path'

const cry = require("node-opcua-pki")


export module CertificateService {
    let path = require('path')
    export let certificate = new OPCUACertificateManager({
        rootFolder: path.join(__dirname, '..', '..', '..', 'certificates', 'PKI'),
        name: 'pki',
        automaticallyAcceptUnknownCertificate: false
    })

    /**
     * @description 创建一个证书,dns即domain names,默认证书根文件夹为项目根目录,
     * 默认pem文件存放路径为certificatees/PKI/own/cert/client_cert.pem
     * validity为有效时间
     * 具体请转到CreateSelfSignCertificateParam1声明处查看
     * @example
     * {
     *    "outputFile": path.join(__dirname, '..', '..', '..','certificates/PKI/own/certs/client_cert.pem'),
     *    "subject": {
     *       "commonName": "UaExpert@WIN-4D29EPFU0V6",
     *       "organization": "uaclient",
     *       "organizationalUnit": "uaclient",
     *       "locality": "mas",
     *       "state": "ah",
     *       "country": "cn",
     *       "domainComponent": "cn"
     *    },
     *    "applicationUri": "uaclient",
     *    "dns": ["WIN-4D29EPFU0V6"],
     *    "startDate": new Date(),
     *    "validity": 10
     * }
     * @param params
     */
    export async function createCertificate(params: CreateSelfSignCertificateParam1) {
        try {
            await certificate.createSelfSignedCertificate({...params})
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
    export async function getTrustStatus(serverCertificate: Certificate) {
        try {
            return await certificate.getTrustStatus(serverCertificate)
        } catch (e: any) {
            throw new ClientError(Sources.certService, Errors.errorGetTrust, e.message)
        }
    }
}

async function f() {
    try {
        await CertificateService.createCertificate({
            "outputFile": path.join(__dirname, '..', '..', '..', 'certificates/PKI/own/certs/client_cert.pem'),
            "subject": {
                "commonName": "UaExpert@WIN-4D29EPFU0V6",
                "organization": "uaclient",
                "organizationalUnit": "uaclient",
                "locality": "mas",
                "state": "ah",
                "country": "cn",
                "domainComponent": "cn"
            },
            "applicationUri": "uaclient",
            "dns": ["WIN-4D29EPFU0V6"],
            "startDate": new Date(),
            "validity": 10
        })
    } catch (e) {
        console.log(e)
    }
}

// f()