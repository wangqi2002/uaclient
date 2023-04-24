import { DbService } from '../services/db.service';
import { ResponseModel } from '../models/response.model';
import { TableCreateModes } from '../../common/ua.enums';
import 'koa-body/lib/index';
export var DbController;
(function (DbController) {
    async function init(ctx, next) {
        try {
            let { createMode, tableName, fields } = ctx.request.body;
            DbService.init(createMode, tableName, fields);
            ctx.body = new ResponseModel(TableCreateModes[createMode]);
        }
        catch (e) {
            throw e;
        }
    }
    DbController.init = init;
    async function insert(ctx, next) {
        try {
            DbService.insert(ctx.request.body);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    DbController.insert = insert;
    async function insertMany(ctx, next) {
        try {
            DbService.insertMany(ctx.request.body);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    DbController.insertMany = insertMany;
    async function createTable(ctx, next) {
        try {
            DbService.createTable(ctx.request.body['tableName'], ctx.request.body['fieldNames']);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    DbController.createTable = createTable;
})(DbController || (DbController = {}));
