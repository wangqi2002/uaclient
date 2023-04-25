"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.DbController = void 0;
const db_service_1 = require("../services/db.service");
const response_model_1 = require("../models/response.model");
const ua_enums_1 = require("../../common/ua.enums");
require("koa-body/lib/index");
var DbController;
(function (DbController) {
    async function init(ctx, next) {
        try {
            let {createMode, tableName, fields} = ctx.request.body;
            db_service_1.DbService.init(createMode, tableName, fields);
            ctx.body = new response_model_1.ResponseModel(ua_enums_1.TableCreateModes[createMode]);
        } catch (e) {
            throw e;
        }
    }

    DbController.init = init;

    async function insert(ctx, next) {
        try {
            db_service_1.DbService.insert(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    DbController.insert = insert;

    async function insertMany(ctx, next) {
        try {
            db_service_1.DbService.insertMany(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    DbController.insertMany = insertMany;

    async function createTable(ctx, next) {
        try {
            db_service_1.DbService.createTable(ctx.request.body['tableName'], ctx.request.body['fieldNames']);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    DbController.createTable = createTable;
})(DbController = exports.DbController || (exports.DbController = {}));
