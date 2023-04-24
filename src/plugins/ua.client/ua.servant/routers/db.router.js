import Router from 'koa-router';
import { DbController } from '../controllers/db.controller';
import { AgentMiddleware } from '../middlewares/agent.middleware';
export var DbRouter;
(function (DbRouter) {
    DbRouter.router = new Router({
        prefix: '/db',
    });
    DbRouter.router.use(AgentMiddleware.dbValidator);
    DbRouter.router.post('/init', DbController.init);
    DbRouter.router.post('/insert', DbController.insert);
    DbRouter.router.post('/insert_many', DbController.insertMany);
    DbRouter.router.post('/create_table', DbController.createTable);
    // router.post('/backup', DbController.backUp)
    // router.post('/config', DbController.config)
    //
    // router.get('/close', DbController.closeDb)
})(DbRouter || (DbRouter = {}));
