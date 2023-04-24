import { SubscriptService } from '../services/subscript.service';
import { ResponseModel } from '../models/response.model';
import 'koa-body/lib/index';
import { EventEmitter } from 'events';
export var SubscriptController;
(function (SubscriptController) {
    SubscriptController.events = new EventEmitter();
    async function init(ctx, next) {
        try {
            SubscriptService.createSubscription(ctx.request.body);
            ctx.body = new ResponseModel();
            SubscriptController.events.emit('init', ctx.request.body);
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.init = init;
    async function modify(ctx, next) {
        try {
            await SubscriptService.modifySubscription(ctx.request.body);
            ctx.body = new ResponseModel();
            SubscriptController.events.emit('modify', ctx.request.body);
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.modify = modify;
    async function addItemGroup(ctx, next) {
        try {
            SubscriptService.addMonitoredItems(ctx.request.body);
            ctx.body = new ResponseModel();
            SubscriptController.events.emit('add_many', ctx.request.body);
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.addItemGroup = addItemGroup;
    async function addItem(ctx, next) {
        try {
            SubscriptService.addMonitoredItem(ctx.request.body);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.addItem = addItem;
    async function getItems(ctx, next) {
        try {
            let items = await SubscriptService.getMonitoredItems();
            ctx.body = new ResponseModel(items);
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.getItems = getItems;
    async function deleteItems(ctx, next) {
        try {
            await SubscriptService.deleteMonitoredItems(ctx.request.body);
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.deleteItems = deleteItems;
    async function terminate(ctx, next) {
        try {
            await SubscriptService.terminateSubscription();
            ctx.body = new ResponseModel();
        }
        catch (e) {
            throw e;
        }
    }
    SubscriptController.terminate = terminate;
})(SubscriptController || (SubscriptController = {}));
