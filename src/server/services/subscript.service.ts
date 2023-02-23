import {
    ClientMonitoredItem,
    ClientSubscription,
    ClientSubscriptionOptions,
    ModifySubscriptionOptions,
    TimestampsToReturn
} from 'node-opcua'
import {SessionService} from './session.service'
import {Errors, Sources, Warns} from '../../common/enums'
import {MessageQueue} from '../../common/mq'
import {MessageModel} from '../models/message.model'
import {SubscriptGroupParam, SubscriptSingleParam} from '../models/params.model'
import {ClientError, ClientWarn} from '../models/infos.model'

interface ItemAndName {
    displayName: string
    monitoredItem: ClientMonitoredItem
}

export module SubscriptService {
    export let subscription!: ClientSubscription
    let monitoredItems: Map<string, ItemAndName> = new Map()

    export function createSubscription(
        subOptions: ClientSubscriptionOptions = {
            requestedLifetimeCount: 60,
            requestedPublishingInterval: 100,
            requestedMaxKeepAliveCount: 10,
            publishingEnabled: true,
            maxNotificationsPerPublish: 100,
            priority: 1,
        },
    ) {
        subscription = ClientSubscription.create(SessionService.session, subOptions)
    }

    export async function modifySubscription(subOptions: ModifySubscriptionOptions) {
        try {
            await subscription.modify(subOptions)
        } catch (e: any) {
            throw new ClientError(Sources.subscriptService, Errors.errorModifySub, e.message)
        }
    }

    export async function terminateSubscription() {
        if (subscription) {
            await subscription.terminate()
        }
    }

    /**
     * @description 用来同时添加多个monitored item
     * @param param
     */
    export function addMonitoredItems(param: SubscriptGroupParam) {
        param.parameters = param.parameters || {samplingInterval: 100, discardOldest: true, queueSize: 10,}
        param.timeStampToReturn = param.timeStampToReturn || TimestampsToReturn.Both
        if (subscription) {
            for (let i = 0; i < param.itemsToMonitor.length; i++) {
                let monitoredItem = ClientMonitoredItem.create(
                    subscription,
                    param.itemsToMonitor[i],
                    param.parameters,
                    param.timeStampToReturn
                )
                bindingAndPush(monitoredItem, param.displayNames[i], param.itemsToMonitor[i].nodeId)
            }
        } else {
            throw new ClientError(Sources.subscriptService, Errors.noSubscription)
        }
    }

    /**
     * @description 创建一个监控节点并且加入到本类的节点数组之中
     * @param param
     */
    export function addMonitoredItem(param: SubscriptSingleParam) {
        try {
            param.parameters = param.parameters || {samplingInterval: 100, discardOldest: true, queueSize: 10,}
            param.timeStampToReturn = param.timeStampToReturn || TimestampsToReturn.Both
            let monitoredItem = ClientMonitoredItem.create(
                subscription,
                param.itemToMonitor,
                param.parameters,
                param.timeStampToReturn,
            )
            bindingAndPush(monitoredItem, param.displayName, param.itemToMonitor.nodeId)
        } catch (e: any) {
            throw new ClientError(Sources.subscriptService, Errors.errorAddMonitoredItem, e.message)
        }
    }


    export async function getMonitoredItems() {
        if (subscription) {
            return await subscription.getMonitoredItems()
        }
    }

    /**
     * @description monitored items 队列使用map作为存储结构,以nodeId的string作为键
     * @param nodeIds
     */
    export async function deleteMonitoredItems(nodeIds: string[]) {
        try {
            for (let nodeId of nodeIds) {
                let item = monitoredItems.get(nodeId)
                if (item) {
                    await item.monitoredItem.terminate()
                    monitoredItems.delete(nodeId)
                } else {
                    throw new ClientWarn(Sources.subscriptService, Warns.nonExistentItem, nodeId)
                }
            }
        } catch (e: any) {
            throw new ClientError(Sources.subscriptService, Errors.wrongIndexOfArray, e.message)
        }
    }

    function bindingAndPush(monitoredItem: ClientMonitoredItem, displayName: string, itemId: any) {
        itemId = itemId.toString()
        monitoredItem
            .on('changed', (data) => {
                let item = monitoredItems.get(itemId)
                if (item) {
                    MessageQueue.enqueue(
                        new MessageModel(data, monitoredItem.itemToMonitor.nodeId.toString(), item.displayName),
                    )
                }
            })
            .on('err', (err) => {
                throw new ClientError(Sources.subscriptService, Errors.errorMonitoringItem, err)
            })
        monitoredItems.set(itemId, {monitoredItem: monitoredItem, displayName: displayName})
    }
}