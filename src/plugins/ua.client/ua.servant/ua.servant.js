import Koa from 'koa';
import { koaBody } from 'koa-body';
import { Config } from '../config/config.default';
import { ClientRouter } from './routers/client.router';
import { SessionRouter } from './routers/session.router';
import { SubscriptRouter } from './routers/subscript.router';
import { CertificateRouter } from './routers/certificate.router';
import { DbRouter } from './routers/db.router';
import { ErrorMiddleware } from './middlewares/error.middleware';
// require('v8-compile-cache')
//todo 性能调优/v8-compile-cache缓存,实现插件系统,模仿vscode的架构设计
export var Server;
(function (Server) {
    Server.app = new Koa();
    let routers = [
        ClientRouter.router,
        SessionRouter.router,
        SubscriptRouter.router,
        CertificateRouter.router,
        DbRouter.router,
    ];
    function activateServer() {
        Server.app.use(koaBody());
        Server.app.use(ErrorMiddleware.handleError);
        routers.forEach((router) => {
            Server.app.use(router.routes());
        });
        try {
            Server.app.listen(Config.port, () => {
                console.log('complete');
                Server.app.emit('serverCreated', Config.port);
            });
        }
        catch (e) { }
    }
    Server.activateServer = activateServer;
})(Server || (Server = {}));
Server.activateServer();
