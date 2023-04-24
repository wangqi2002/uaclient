import { OPCUACertificateManager } from 'node-opcua';
import { UaErrors, UaSources } from '../../common/ua.enums';
import { Config } from '../../config/config.default';
import { ClientError } from '../../../../platform/base/log/log';
// const cry = require("node-opcua-pki")
export var CertificateService;
(function (CertificateService) {
    CertificateService.certificate = new OPCUACertificateManager({
        rootFolder: Config.certRoot,
        name: 'pki',
        automaticallyAcceptUnknownCertificate: false,
    });
    //todo node-opcua-pki命令测试
    /**
     * @description 创建一个证书,dns即domain names,默认证书根文件夹为项目根目录,
     * 默认pem文件存放路径为certificatees/PKI/own/cert/client_cert.pem
     * validity为有效时间
     * 具体请转到CreateSelfSignCertificateParam1声明处查看
     * @example
     * {
     *    "outputFile": path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..','certificates/PKI/own/certs/client_cert.pem'),
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
    async function createCertificate(params) {
        try {
            await CertificateService.certificate.createSelfSignedCertificate({ ...params });
        }
        catch (e) {
            throw new ClientError(UaSources.certService, UaErrors.errorCreatCert, e.message, e.stack);
        }
    }
    CertificateService.createCertificate = createCertificate;
    async function trustServerCertificate(serverCertificate) {
        try {
            await CertificateService.certificate.trustCertificate(serverCertificate);
        }
        catch (e) {
            throw new ClientError(UaSources.certService, UaErrors.errorTrustCert, e.message, e.stack);
        }
    }
    CertificateService.trustServerCertificate = trustServerCertificate;
    async function rejectServerCertificate(serverCertificate) {
        try {
            await CertificateService.certificate.rejectCertificate(serverCertificate);
        }
        catch (e) {
            throw new ClientError(UaSources.certService, UaErrors.errorRejectCert, e.message, e.stack);
        }
    }
    CertificateService.rejectServerCertificate = rejectServerCertificate;
    /**
     * @description 返回server证书的信任状态
     * @param serverCertificate
     */
    async function getTrustStatus(serverCertificate) {
        try {
            return await CertificateService.certificate.getTrustStatus(serverCertificate);
        }
        catch (e) {
            throw new ClientError(UaSources.certService, UaErrors.errorGetTrust, e.message, e.stack);
        }
    }
    CertificateService.getTrustStatus = getTrustStatus;
})(CertificateService || (CertificateService = {}));
// async function f() {
//     try {
//         await CertificateService.createCertificate({
//             "outputFile": path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', 'certificates/PKI/own/certs/client_cert.pem'),
//             "subject": {
//                 "commonName": "UaExpert@WIN-4D29EPFU0V6",
//                 "organization": "uaclient",
//                 "organizationalUnit": "uaclient",
//                 "locality": "mas",
//                 "state": "ah",
//                 "country": "cn",
//                 "domainComponent": "cn"
//             },
//             "applicationUri": "uaclient",
//             "dns": ["WIN-4D29EPFU0V6"],
//             "startDate": new Date(),
//             "validity": 10
//         })
//     } catch (e) {
//         console.log(e)
//     }
// }
// f()
