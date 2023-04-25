"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.SubscriptController = void 0;
const subscript_service_1 = require("../services/subscript.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
const events_1 = require("events");
var SubscriptController;
(function (SubscriptController) {
    SubscriptController.events = new events_1.EventEmitter();

    async function init(ctx, next) {
        try {
            subscript_service_1.SubscriptService.createSubscription(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
            SubscriptController.events.emit('init', ctx.request.body);
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.init = init;

    async function modify(ctx, next) {
        try {
            await subscript_service_1.SubscriptService.modifySubscription(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
            SubscriptController.events.emit('modify', ctx.request.body);
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.modify = modify;

    async function addItemGroup(ctx, next) {
        try {
            subscript_service_1.SubscriptService.addMonitoredItems(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
            SubscriptController.events.emit('add_many', ctx.request.body);
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.addItemGroup = addItemGroup;

    async function addItem(ctx, next) {
        try {
            subscript_service_1.SubscriptService.addMonitoredItem(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.addItem = addItem;

    async function getItems(ctx, next) {
        try {
            let items = await subscript_service_1.SubscriptService.getMonitoredItems();
            ctx.body = new response_model_1.ResponseModel(items);
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.getItems = getItems;

    async function deleteItems(ctx, next) {
        try {
            await subscript_service_1.SubscriptService.deleteMonitoredItems(ctx.request.body);
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.deleteItems = deleteItems;

    async function terminate(ctx, next) {
        try {
            await subscript_service_1.SubscriptService.terminateSubscription();
            ctx.body = new response_model_1.ResponseModel();
        } catch (e) {
            throw e;
        }
    }

    SubscriptController.terminate = terminate;
})(SubscriptController = exports.SubscriptController || (exports.SubscriptController = {}));
