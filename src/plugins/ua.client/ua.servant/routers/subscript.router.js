import Router from 'koa-router';
import { SubscriptController } from '../controllers/subscript.controller';
import { AgentMiddleware } from '../middlewares/agent.middleware';
export var SubscriptRouter;
(function (SubscriptRouter) {
    SubscriptRouter.router = new Router({
        prefix: '/subscript',
    });
    SubscriptRouter.router.use(AgentMiddleware.subscriptValidator);
    SubscriptRouter.router.post('/init', SubscriptController.init);
    SubscriptRouter.router.post('/modify', SubscriptController.modify);
    SubscriptRouter.router.post('/item/group', SubscriptController.addItemGroup);
    SubscriptRouter.router.post('/item/single', SubscriptController.addItem);
    SubscriptRouter.router.post('/item/delete', SubscriptController.deleteItems);
    SubscriptRouter.router.get('/terminate', SubscriptController.terminate);
})(SubscriptRouter || (SubscriptRouter = {}));
