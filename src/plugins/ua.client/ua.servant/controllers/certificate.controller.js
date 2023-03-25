"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const certificate_service_1 = require("../services/certificate.service");
const response_model_1 = require("../models/response.model");
var CertificateController;
(function (CertificateController) {
    function create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cert = ctx.request.body;
                yield certificate_service_1.CertificateService.createCertificate(cert);
                ctx.body = new response_model_1.ResponseModel();
            }
            catch (e) {
                throw e;
            }
        });
    }
    CertificateController.create = create;
    function trust(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cert = ctx.request.body;
                yield certificate_service_1.CertificateService.trustServerCertificate(cert);
                ctx.body = new response_model_1.ResponseModel();
            }
            catch (e) {
                throw e;
            }
        });
    }
    CertificateController.trust = trust;
    function reject(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cert = ctx.request.body;
                yield certificate_service_1.CertificateService.rejectServerCertificate(cert);
                ctx.body = new response_model_1.ResponseModel();
            }
            catch (e) {
                throw e;
            }
        });
    }
    CertificateController.reject = reject;
    function getTrustStatus(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cert = ctx.request.body;
                ctx.body = certificate_service_1.CertificateService.getTrustStatus(cert);
            }
            catch (e) {
                throw e;
            }
        });
    }
    CertificateController.getTrustStatus = getTrustStatus;
})(CertificateController = exports.CertificateController || (exports.CertificateController = {}));
