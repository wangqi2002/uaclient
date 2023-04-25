"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.SubscriptRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const subscript_controller_1 = require("../controllers/subscript.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var SubscriptRouter;
(function (SubscriptRouter) {
    SubscriptRouter.router = new koa_router_1.default({
        prefix: '/subscript',
    });
    SubscriptRouter.router.use(agent_middleware_1.AgentMiddleware.subscriptValidator);
    SubscriptRouter.router.post('/init', subscript_controller_1.SubscriptController.init);
    SubscriptRouter.router.post('/modify', subscript_controller_1.SubscriptController.modify);
    SubscriptRouter.router.post('/item/group', subscript_controller_1.SubscriptController.addItemGroup);
    SubscriptRouter.router.post('/item/single', subscript_controller_1.SubscriptController.addItem);
    SubscriptRouter.router.post('/item/delete', subscript_controller_1.SubscriptController.deleteItems);
    SubscriptRouter.router.get('/terminate', subscript_controller_1.SubscriptController.terminate);
})(SubscriptRouter = exports.SubscriptRouter || (exports.SubscriptRouter = {}));
