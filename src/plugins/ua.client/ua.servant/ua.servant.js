"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Koa = require("koa");
const koa_body_1 = require("koa-body");
const config_default_1 = require("../config/config.default");
const client_router_1 = require("./routers/client.router");
const session_router_1 = require("./routers/session.router");
const subscript_router_1 = require("./routers/subscript.router");
const certificate_router_1 = require("./routers/certificate.router");
const db_router_1 = require("./routers/db.router");
const error_middleware_1 = require("./middlewares/error.middleware");
// require('v8-compile-cache')
//todo 性能调优/v8-compile-cache缓存,实现插件系统,模仿vscode的架构设计
var Server;
(function (Server) {
    Server.app = new Koa();
    let routers = [
        client_router_1.ClientRouter.router,
        session_router_1.SessionRouter.router,
        subscript_router_1.SubscriptRouter.router,
        certificate_router_1.CertificateRouter.router,
        db_router_1.DbRouter.router,
    ];
    function activateServer() {
        Server.app.use((0, koa_body_1.koaBody)());
        Server.app.use(error_middleware_1.ErrorMiddleware.handleError);
        routers.forEach((router) => {
            Server.app.use(router.routes());
        });
        try {
            Server.app.listen(config_default_1.Config.port, () => {
                console.log("complete");
                Server.app.emit("serverCreated", config_default_1.Config.port);
            });
        }
        catch (e) {
        }
    }
    Server.activateServer = activateServer;
})(Server = exports.Server || (exports.Server = {}));
Server.activateServer();
