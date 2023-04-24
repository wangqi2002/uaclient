import Router from 'koa-router';
import { CertificateController } from '../controllers/certificate.controller';
import { AgentMiddleware } from '../middlewares/agent.middleware';
export var CertificateRouter;
(function (CertificateRouter) {
    CertificateRouter.router = new Router({
        prefix: '/cert',
    });
    CertificateRouter.router.use(AgentMiddleware.certValidator);
    CertificateRouter.router.post('/create', CertificateController.create);
    CertificateRouter.router.post('/trust', CertificateController.trust);
    CertificateRouter.router.post('/reject', CertificateController.reject);
    CertificateRouter.router.post('/trust_status', CertificateController.getTrustStatus);
})(CertificateRouter || (CertificateRouter = {}));
