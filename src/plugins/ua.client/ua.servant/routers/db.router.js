"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.DbRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const db_controller_1 = require("../controllers/db.controller");
const agent_middleware_1 = require("../middlewares/agent.middleware");
var DbRouter;
(function (DbRouter) {
    DbRouter.router = new koa_router_1.default({
        prefix: '/db',
    });
    DbRouter.router.use(agent_middleware_1.AgentMiddleware.dbValidator);
    DbRouter.router.post('/init', db_controller_1.DbController.init);
    DbRouter.router.post('/insert', db_controller_1.DbController.insert);
    DbRouter.router.post('/insert_many', db_controller_1.DbController.insertMany);
    DbRouter.router.post('/create_table', db_controller_1.DbController.createTable);
    // router.post('/backup', DbController.backUp)
    // router.post('/config', DbController.config)
    //
    // router.get('/close', DbController.closeDb)
})(DbRouter = exports.DbRouter || (exports.DbRouter = {}));
