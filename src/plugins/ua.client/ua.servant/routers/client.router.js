import Router from 'koa-router';
import { ClientController } from '../controllers/client.controller';
import { AgentMiddleware } from '../middlewares/agent.middleware';
export var ClientRouter;
(function (ClientRouter) {
    ClientRouter.router = new Router({
        prefix: '/client',
    });
    ClientRouter.router.use(AgentMiddleware.clientValidator);
    ClientRouter.router.post('/init', ClientController.init);
    ClientRouter.router.post('/connect', ClientController.connect);
    ClientRouter.router.post('/disconnect', ClientController.disconnect);
    ClientRouter.router.post('/endpoints', ClientController.getEndpoints);
    ClientRouter.router.get('/private_key', ClientController.getPrivateKey);
    ClientRouter.router.get('/cert', ClientController.getCertificate);
    ClientRouter.router.get('/servers', ClientController.getServers);
})(ClientRouter || (ClientRouter = {}));
