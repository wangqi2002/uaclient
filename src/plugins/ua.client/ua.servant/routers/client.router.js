"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRouter = void 0;
const Router = require("koa-router");
const client_controller_1 = require("../controllers/client.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var ClientRouter;
(function (ClientRouter) {
    ClientRouter.router = new Router({
        prefix: '/client'
    });
    ClientRouter.router.use(agent_middleware_1.AgentMiddleware.clientValidator);
    ClientRouter.router.post('/init', client_controller_1.ClientController.init);
    ClientRouter.router.post('/connect', client_controller_1.ClientController.connect);
    ClientRouter.router.post('/disconnect', client_controller_1.ClientController.disconnect);
    ClientRouter.router.post('/endpoints', client_controller_1.ClientController.getEndpoints);
    ClientRouter.router.get('/private_key', client_controller_1.ClientController.getPrivateKey);
    ClientRouter.router.get('/cert', client_controller_1.ClientController.getCertificate);
    ClientRouter.router.get('/servers', client_controller_1.ClientController.getServers);
})(ClientRouter = exports.ClientRouter || (exports.ClientRouter = {}));
