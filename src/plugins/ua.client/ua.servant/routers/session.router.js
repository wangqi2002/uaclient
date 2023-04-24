import Router from 'koa-router';
import { SessionController } from '../controllers/session.controller';
import { AgentMiddleware } from '../middlewares/agent.middleware';
export var SessionRouter;
(function (SessionRouter) {
    SessionRouter.router = new Router({ prefix: '/session' });
    SessionRouter.router.use(AgentMiddleware.sessionValidator);
    SessionRouter.router.post('/init', SessionController.init);
    SessionRouter.router.post('/change_identity', SessionController.changeIdentity);
    SessionRouter.router.post('/write', SessionController.write);
    SessionRouter.router.post('/read', SessionController.readById);
    SessionRouter.router.post('/browse', SessionController.browse);
    SessionRouter.router.post('/history', SessionController.history);
    SessionRouter.router.post('/history/value', SessionController.historyValue);
    SessionRouter.router.get('/id', SessionController.getIdByName);
    SessionRouter.router.get('/browse/root', SessionController.browseRoot);
    SessionRouter.router.get('/server_cert', SessionController.serverCert);
    SessionRouter.router.post('/close', SessionController.close);
})(SessionRouter || (SessionRouter = {}));
