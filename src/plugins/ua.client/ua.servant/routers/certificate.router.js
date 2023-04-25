"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.CertificateRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const certificate_controller_1 = require("../controllers/certificate.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var CertificateRouter;
(function (CertificateRouter) {
    CertificateRouter.router = new koa_router_1.default({
        prefix: '/cert',
    });
    CertificateRouter.router.use(agent_middleware_1.AgentMiddleware.certValidator);
    CertificateRouter.router.post('/create', certificate_controller_1.CertificateController.create);
    CertificateRouter.router.post('/trust', certificate_controller_1.CertificateController.trust);
    CertificateRouter.router.post('/reject', certificate_controller_1.CertificateController.reject);
    CertificateRouter.router.post('/trust_status', certificate_controller_1.CertificateController.getTrustStatus);
})(CertificateRouter = exports.CertificateRouter || (exports.CertificateRouter = {}));
