"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.DbController = void 0;
const db_service_1 = require("../services/db.service");
const response_model_1 = require("../models/response.model");
const ua_enums_1 = require("../../common/ua.enums");
require("koa-body/lib/index");
var DbController;
(function (DbController) {
    function init(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let {createMode, tableName, fields} = ctx.request.body;
                db_service_1.DbService.init(createMode, tableName, fields);
                ctx.body = new response_model_1.ResponseModel(ua_enums_1.TableCreateModes[createMode]);
            } catch (e) {
                throw e;
            }
        });
    }

    DbController.init = init;

    function insert(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                db_service_1.DbService.insert(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }

    DbController.insert = insert;

    function insertMany(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                db_service_1.DbService.insertMany(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }

    DbController.insertMany = insertMany;

    function createTable(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                db_service_1.DbService.createTable(ctx.request.body['tableName'], ctx.request.body['fieldNames']);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }

    DbController.createTable = createTable;
})(DbController = exports.DbController || (exports.DbController = {}));
