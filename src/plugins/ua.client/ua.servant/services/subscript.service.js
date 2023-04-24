import { ClientMonitoredItem, ClientSubscription, TimestampsToReturn, } from 'node-opcua';
import { SessionService } from './session.service';
import { UaErrors, UaSources, UaWarns } from '../../common/ua.enums';
import { Broker } from '../../../../platform/base/broker/broker';
import { UaMessage } from '../models/message.model';
import { Config } from '../../config/config.default';
import { ClientError, ClientWarn } from '../../../../platform/base/log/log';
export var SubscriptService;
(function (SubscriptService) {
    let monitoredItems = new Map();
    let subscriptionOption = Config.defaultSubscript;
    let pipe = Broker.getPipe(Config.defaultPipeName);
    function bindingAndPush(monitoredItem, displayName, itemId) {
        try {
            itemId = itemId.toString();
            monitoredItem
                .on('changed', async (data) => {
                let item = monitoredItems.get(itemId);
                if (item) {
                    // Broker.receive(
                    //     Config.defaultPipeName,
                    //     monitoredItem.itemToMonitor.nodeId.toString(),
                    //     new UaMessage(data, monitoredItem.itemToMonitor.nodeId.toString(), item.displayName),
                    // )
                    await pipe.inPipe(monitoredItem.itemToMonitor.nodeId.toString(), new UaMessage(data, monitoredItem.itemToMonitor.nodeId.toString(), item.displayName));
                }
            })
                .on('err', (err) => {
                throw new ClientError(UaSources.subscriptService, UaErrors.errorMonitoringItem, err);
            });
            monitoredItems.set(itemId, { monitoredItem: monitoredItem, displayName: displayName });
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.errorBinding, e.message, e.stack);
        }
    }
    function createSubscription(subOptions = subscriptionOption) {
        try {
            SubscriptService.subscription = ClientSubscription.create(SessionService.session, subOptions);
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.errorCreatingSub, e.message, e.stack);
        }
    }
    SubscriptService.createSubscription = createSubscription;
    async function modifySubscription(subOptions) {
        try {
            await SubscriptService.subscription.modify(subOptions);
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.errorModifySub, e.message, e.stack);
        }
    }
    SubscriptService.modifySubscription = modifySubscription;
    async function terminateSubscription() {
        if (SubscriptService.subscription) {
            await SubscriptService.subscription.terminate();
        }
    }
    SubscriptService.terminateSubscription = terminateSubscription;
    /**
     * @description 用来同时添加多个monitored item
     * @param param
     */
    function addMonitoredItems(param) {
        try {
            param.parameters = param.parameters || { samplingInterval: 100, discardOldest: true, queueSize: 10 };
            param.timeStampToReturn = param.timeStampToReturn || TimestampsToReturn.Both;
            if (SubscriptService.subscription) {
                for (let i = 0; i < param.itemsToMonitor.length; i++) {
                    let monitoredItem = ClientMonitoredItem.create(SubscriptService.subscription, param.itemsToMonitor[i], param.parameters, param.timeStampToReturn);
                    bindingAndPush(monitoredItem, param.displayNames[i], param.itemsToMonitor[i].nodeId);
                }
            }
            else {
                throw new ClientWarn(UaSources.subscriptService, UaWarns.noSubscription);
            }
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.errorAddMonitoredItem, e.message, e.stack);
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
            param.timeStampToReturn = param.timeStampToReturn || TimestampsToReturn.Both;
            let monitoredItem = ClientMonitoredItem.create(SubscriptService.subscription, param.itemToMonitor, param.parameters, param.timeStampToReturn);
            bindingAndPush(monitoredItem, param.displayName, param.itemToMonitor.nodeId);
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.errorAddMonitoredItem, e.message, e.stack);
        }
    }
    SubscriptService.addMonitoredItem = addMonitoredItem;
    async function getMonitoredItems() {
        if (SubscriptService.subscription) {
            return await SubscriptService.subscription.getMonitoredItems();
        }
    }
    SubscriptService.getMonitoredItems = getMonitoredItems;
    /**
     * @description monitored items 队列使用map作为存储结构,以nodeId的string作为键
     * @param nodeIds
     */
    async function deleteMonitoredItems(nodeIds) {
        try {
            for (let nodeId of nodeIds) {
                let item = monitoredItems.get(nodeId);
                if (item) {
                    await item.monitoredItem.terminate();
                    monitoredItems.delete(nodeId);
                }
                else {
                    throw new ClientWarn(UaSources.subscriptService, UaWarns.nonExistentItem, nodeId);
                }
            }
        }
        catch (e) {
            throw new ClientError(UaSources.subscriptService, UaErrors.wrongIndexOfArray, e.message, e.stack);
        }
    }
    SubscriptService.deleteMonitoredItems = deleteMonitoredItems;
})(SubscriptService || (SubscriptService = {}));
