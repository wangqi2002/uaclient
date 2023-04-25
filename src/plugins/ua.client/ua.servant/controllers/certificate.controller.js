"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.CertificateController = void 0;
const certificate_service_1 = require("../services/certificate.service");
const response_model_1 = require("../models/response.model");
var CertificateController;
(function (CertificateController) {
    async function create(ctx, next) {
        try {
            let cert = ctx.request.body;
            await certificate_service_1.CertificateService.createCertificate(cert);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    CertificateController.create = create;

    async function trust(ctx, next) {
        try {
            let cert = ctx.request.body;
            await certificate_service_1.CertificateService.trustServerCertificate(cert);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    CertificateController.trust = trust;

    async function reject(ctx, next) {
        try {
            let cert = ctx.request.body;
            await certificate_service_1.CertificateService.rejectServerCertificate(cert);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    CertificateController.reject = reject;

    async function getTrustStatus(ctx, next) {
        try {
            let cert = ctx.request.body;
            ctx.body = certificate_service_1.CertificateService.getTrustStatus(cert);
        } catch (e) {
            throw e;
        }
    }

    CertificateController.getTrustStatus = getTrustStatus;
})(CertificateController = exports.CertificateController || (exports.CertificateController = {}));
