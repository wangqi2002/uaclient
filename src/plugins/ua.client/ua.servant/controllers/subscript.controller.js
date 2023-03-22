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
exports.SubscriptController = void 0;
const subscript_service_1 = require("../services/subscript.service");
const response_model_1 = require("../models/response.model");
require("koa-body/lib/index");
const events_1 = require("events");
var SubscriptController;
(function (SubscriptController) {
    SubscriptController.events = new events_1.EventEmitter();
    function init(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                subscript_service_1.SubscriptService.createSubscription(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
                SubscriptController.events.emit('init', ctx.request.body);
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.init = init;
    function modify(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield subscript_service_1.SubscriptService.modifySubscription(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
                SubscriptController.events.emit('modify', ctx.request.body);
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.modify = modify;
    function addItemGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                subscript_service_1.SubscriptService.addMonitoredItems(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
                SubscriptController.events.emit('add_many', ctx.request.body);
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.addItemGroup = addItemGroup;
    function addItem(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                subscript_service_1.SubscriptService.addMonitoredItem(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.addItem = addItem;
    function getItems(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let items = yield subscript_service_1.SubscriptService.getMonitoredItems();
                ctx.body = new response_model_1.ResponseModel(items);
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.getItems = getItems;
    function deleteItems(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield subscript_service_1.SubscriptService.deleteMonitoredItems(ctx.request.body);
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.deleteItems = deleteItems;
    function terminate(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield subscript_service_1.SubscriptService.terminateSubscription();
                ctx.body = new response_model_1.ResponseModel();
            } catch (e) {
                throw e;
            }
        });
    }
    SubscriptController.terminate = terminate;
})(SubscriptController = exports.SubscriptController || (exports.SubscriptController = {}));
