"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.SessionRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const session_controller_1 = require("../controllers/session.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var SessionRouter;
(function (SessionRouter) {
    SessionRouter.router = new koa_router_1.default({prefix: '/session'});
    SessionRouter.router.use(agent_middleware_1.AgentMiddleware.sessionValidator);
    SessionRouter.router.post('/init', session_controller_1.SessionController.init);
    SessionRouter.router.post('/change_identity', session_controller_1.SessionController.changeIdentity);
    SessionRouter.router.post('/write', session_controller_1.SessionController.write);
    SessionRouter.router.post('/read', session_controller_1.SessionController.readById);
    SessionRouter.router.post('/browse', session_controller_1.SessionController.browse);
    SessionRouter.router.post('/history', session_controller_1.SessionController.history);
    SessionRouter.router.post('/history/value', session_controller_1.SessionController.historyValue);
    SessionRouter.router.get('/id', session_controller_1.SessionController.getIdByName);
    SessionRouter.router.get('/browse/root', session_controller_1.SessionController.browseRoot);
    SessionRouter.router.get('/server_cert', session_controller_1.SessionController.serverCert);
    SessionRouter.router.post('/close', session_controller_1.SessionController.close);
})(SessionRouter = exports.SessionRouter || (exports.SessionRouter = {}));
