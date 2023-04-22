"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptService = void 0;
const node_opcua_1 = require("node-opcua");
const session_service_1 = require("./session.service");
const ua_enums_1 = require("../../common/ua.enums");
const broker_1 = require("../../../../platform/base/broker/broker");
const message_model_1 = require("../models/message.model");
const config_default_1 = require("../../config/config.default");
const log_1 = require("../../../../platform/base/log/log");
var SubscriptService;
(function (SubscriptService) {
    let monitoredItems = new Map();
    let subscriptionOption = config_default_1.Config.defaultSubscript;
    let pipe = broker_1.Broker.getPipe(config_default_1.Config.defaultPipeName);
    function bindingAndPush(monitoredItem, displayName, itemId) {
        try {
            itemId = itemId.toString();
            monitoredItem
                .on('changed', (data) => __awaiter(this, void 0, void 0, function* () {
                let item = monitoredItems.get(itemId);
                if (item) {
                    // Broker.receive(
                    //     Config.defaultPipeName,
                    //     monitoredItem.itemToMonitor.nodeId.toString(),
                    //     new UaMessage(data, monitoredItem.itemToMonitor.nodeId.toString(), item.displayName),
                    // )
                    yield pipe.inPipe(monitoredItem.itemToMonitor.nodeId.toString(), new message_model_1.UaMessage(data, monitoredItem.itemToMonitor.nodeId.toString(), item.displayName));
                }
            }))
                .on('err', (err) => {
                throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorMonitoringItem, err);
            });
            monitoredItems.set(itemId, { monitoredItem: monitoredItem, displayName: displayName });
        }
        catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorBinding, e.message, e.stack);
        }
    }
    function createSubscription(subOptions = subscriptionOption) {
        try {
            SubscriptService.subscription = node_opcua_1.ClientSubscription.create(session_service_1.SessionService.session, subOptions);
        }
        catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorCreatingSub, e.message, e.stack);
        }
    }
    SubscriptService.createSubscription = createSubscription;
    function modifySubscription(subOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SubscriptService.subscription.modify(subOptions);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorModifySub, e.message, e.stack);
            }
        });
    }
    SubscriptService.modifySubscription = modifySubscription;
    function terminateSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            if (SubscriptService.subscription) {
                yield SubscriptService.subscription.terminate();
            }
        });
    }
    SubscriptService.terminateSubscription = terminateSubscription;
    /**
     * @description 用来同时添加多个monitored item
     * @param param
     */
    function addMonitoredItems(param) {
        try {
            param.parameters = param.parameters || { samplingInterval: 100, discardOldest: true, queueSize: 10 };
            param.timeStampToReturn = param.timeStampToReturn || node_opcua_1.TimestampsToReturn.Both;
            if (SubscriptService.subscription) {
                for (let i = 0; i < param.itemsToMonitor.length; i++) {
                    let monitoredItem = node_opcua_1.ClientMonitoredItem.create(SubscriptService.subscription, param.itemsToMonitor[i], param.parameters, param.timeStampToReturn);
                    bindingAndPush(monitoredItem, param.displayNames[i], param.itemsToMonitor[i].nodeId);
                }
            }
            else {
                throw new log_1.ClientWarn(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaWarns.noSubscription);
            }
        }
        catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorAddMonitoredItem, e.message, e.stack);
        }
    }
    SubscriptService.addMonitoredItems = addMonitoredItems;
    /**
     * @description 创建一个监控节点并且加入到本类的节点数组之中
     * @param param
     */
    function addMonitoredItem(param) {
        try {
            param.parameters = param.parameters || { samplingInterval: 100, discardOldest: true, queueSize: 10 };
            param.timeStampToReturn = param.timeStampToReturn || node_opcua_1.TimestampsToReturn.Both;
            let monitoredItem = node_opcua_1.ClientMonitoredItem.create(SubscriptService.subscription, param.itemToMonitor, param.parameters, param.timeStampToReturn);
            bindingAndPush(monitoredItem, param.displayName, param.itemToMonitor.nodeId);
        }
        catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorAddMonitoredItem, e.message, e.stack);
        }
    }
    SubscriptService.addMonitoredItem = addMonitoredItem;
    function getMonitoredItems() {
        return __awaiter(this, void 0, void 0, function* () {
            if (SubscriptService.subscription) {
                return yield SubscriptService.subscription.getMonitoredItems();
            }
        });
    }
    SubscriptService.getMonitoredItems = getMonitoredItems;
    /**
     * @description monitored items 队列使用map作为存储结构,以nodeId的string作为键
     * @param nodeIds
     */
    function deleteMonitoredItems(nodeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let nodeId of nodeIds) {
                    let item = monitoredItems.get(nodeId);
                    if (item) {
                        yield item.monitoredItem.terminate();
                        monitoredItems.delete(nodeId);
                    }
                    else {
                        throw new log_1.ClientWarn(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaWarns.nonExistentItem, nodeId);
                    }
                }
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.wrongIndexOfArray, e.message, e.stack);
            }
        });
    }
    SubscriptService.deleteMonitoredItems = deleteMonitoredItems;
})(SubscriptService = exports.SubscriptService || (exports.SubscriptService = {}));
