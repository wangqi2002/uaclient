"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.CertificateService = void 0;
const node_opcua_1 = require("node-opcua");
const ua_enums_1 = require("../../common/ua.enums");
const config_default_1 = require("../../config/config.default");
const log_1 = require("../../../../platform/base/log");
// const cry = require("node-opcua-pki")
var CertificateService;
(function (CertificateService) {
    CertificateService.certificate = new node_opcua_1.OPCUACertificateManager({
        rootFolder: config_default_1.Config.certRoot,
        name: 'pki',
        automaticallyAcceptUnknownCertificate: false
    });
    //todo node-opcua-pki命令测试
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
    function createCertificate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CertificateService.certificate.createSelfSignedCertificate(Object.assign({}, params));
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.certService, ua_enums_1.UaErrors.errorCreatCert, e.message, e.stack);
            }
        });
    }
    CertificateService.createCertificate = createCertificate;
    function trustServerCertificate(serverCertificate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CertificateService.certificate.trustCertificate(serverCertificate);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.certService, ua_enums_1.UaErrors.errorTrustCert, e.message, e.stack);
            }
        });
    }
    CertificateService.trustServerCertificate = trustServerCertificate;
    function rejectServerCertificate(serverCertificate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CertificateService.certificate.rejectCertificate(serverCertificate);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.certService, ua_enums_1.UaErrors.errorRejectCert, e.message, e.stack);
            }
        });
    }
    CertificateService.rejectServerCertificate = rejectServerCertificate;
    /**
     * @description 返回server证书的信任状态
     * @param serverCertificate
     */
    function getTrustStatus(serverCertificate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield CertificateService.certificate.getTrustStatus(serverCertificate);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.certService, ua_enums_1.UaErrors.errorGetTrust, e.message, e.stack);
            }
        });
    }
    CertificateService.getTrustStatus = getTrustStatus;
})(CertificateService = exports.CertificateService || (exports.CertificateService = {}));
// async function f() {
//     try {
//         await CertificateService.createCertificate({
//             "outputFile": path.join(__dirname, '..', '..', '..', 'certificates/PKI/own/certs/client_cert.pem'),
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
