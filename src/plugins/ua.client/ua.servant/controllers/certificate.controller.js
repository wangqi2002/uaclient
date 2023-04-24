import { CertificateService } from '../services/certificate.service';
import { ResponseModel } from '../models/response.model';
export var CertificateController;
(function (CertificateController) {
    async function create(ctx, next) {
        try {
            let cert = ctx.request.body;
            await CertificateService.createCertificate(cert);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    CertificateController.create = create;
    async function trust(ctx, next) {
        try {
            let cert = ctx.request.body;
            await CertificateService.trustServerCertificate(cert);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    CertificateController.trust = trust;
    async function reject(ctx, next) {
        try {
            let cert = ctx.request.body;
            await CertificateService.rejectServerCertificate(cert);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    CertificateController.reject = reject;
    async function getTrustStatus(ctx, next) {
        try {
            let cert = ctx.request.body;
            ctx.body = CertificateService.getTrustStatus(cert);
        }
        catch (e) {
            throw e;
        }
    }
    CertificateController.getTrustStatus = getTrustStatus;
})(CertificateController || (CertificateController = {}));
