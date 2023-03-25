"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateRouter = void 0;
const Router = require("koa-router");
const certificate_controller_1 = require("../controllers/certificate.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var CertificateRouter;
(function (CertificateRouter) {
    CertificateRouter.router = new Router({
        prefix: '/cert'
    });
    CertificateRouter.router.use(agent_middleware_1.AgentMiddleware.certValidator);
    CertificateRouter.router.post('/create', certificate_controller_1.CertificateController.create);
    CertificateRouter.router.post('/trust', certificate_controller_1.CertificateController.trust);
    CertificateRouter.router.post('/reject', certificate_controller_1.CertificateController.reject);
    CertificateRouter.router.post('/trust_status', certificate_controller_1.CertificateController.getTrustStatus);
})(CertificateRouter = exports.CertificateRouter || (exports.CertificateRouter = {}));
