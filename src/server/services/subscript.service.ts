import {
    ClientMonitoredItem,
    ClientSubscription,
    ClientSubscriptionOptions,
    ModifySubscriptionOptions,
    MonitoredItemData,
    TimestampsToReturn
} from 'node-opcua'
import {SessionService} from './session.service'
import {Log} from '../../common/log'
import {ClientError, ClientInfo} from '../../common/informations'
import {Errors, Infos, Sources} from '../../common/enums'
import {UaMessageQueue} from '../../common/mq'
import {MessageModel} from '../models/message.model'
import {AddManyParam, AddOneParam} from '../models/params.model'

interface ItemAndName {
    displayName: string
    monitoredItem: ClientMonitoredItem
}

export module SubscriptService {
    export let subscription!: ClientSubscription
    // export let monitoredItemGroups!: ClientMonitoredItemGroup[]
    // export let monitoredItems!: ClientMonitoredItem[]
    export let monitoredItems: Map<string, ItemAndName> = new Map()

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
        subscription
            .on('started', () => {
                Log.info(new ClientInfo(Sources.subscription, Infos.installedSub))
            })
            .on('keepalive', () => {
            })
            .on('terminated', () => {
                Log.info(new ClientInfo(Sources.subscription, Infos.terminateSub))
            })
    }

    export async function modifySubscription(subOptions: ModifySubscriptionOptions) {
        await subscription.modify(subOptions)
        Log.info(new ClientInfo(Sources.subscription, Infos.modifySubscription, {...subOptions}))
    }

    export async function terminateSubscription() {
        if (subscription) {
            await subscription.terminate()
        } else {
            throw new ClientError(Sources.subscription, Errors.noSubscription)
        }
    }


    /**
     * @description 用来创建一个MonitoredItemGroup
     * @param param
     */
    export function addMonitoredItemGroup(param: AddManyParam) {
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
            // let itemGroup = ClientMonitoredItemGroup.create(
            //     subscription,
            //     itemsToMonitor,
            //     parameters,
            //     timeStampToReturn,
            // )
            //
            // itemGroup
            //     .on('changed', function itemGroupChangedHandler(data, data2) {
            //         UaMessageQueue.enqueue(data2, data.itemToMonitor)
            //     })
            //     .on('initialized', function itemGroupInitializedHandler() {
            //         Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemGroupInit))
            //     })
            //     .on('terminated', function itemGroupTerminatedHandler(err) {
            //         if (err) Log.error(new ClientError(Sources.subscription, Errors.errorTerminatingItemGroup, {Error: err.message}))
            //         Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemGroupTerminate))
            //     })
            //     .on('err', function itemGroupErrHandler() {
            //         console.log('err')
            //     })
            // monitoredItemGroups.push(itemGroup)
        } else {
            throw new ClientError(Sources.subscription, Errors.noSubscription)
        }
        // let a:ReadValueIdOptions={
        //     nodeId:'nice',
        //     attributeId:AttributeIds.Value
        // }
    }

    /**
     * @description 创建一个监控节点并且加入到本类的节点数组之中,与group分开
     * @param param
     */
    export function addMonitoredItem(param: AddOneParam) {
        param.parameters = param.parameters || {samplingInterval: 100, discardOldest: true, queueSize: 10,}
        param.timeStampToReturn = param.timeStampToReturn || TimestampsToReturn.Both
        let monitoredItem = ClientMonitoredItem.create(
            subscription,
            param.itemToMonitor,
            param.parameters,
            param.timeStampToReturn,
        )
        bindingAndPush(monitoredItem, param.displayName, param.itemToMonitor.nodeId)
    }


    export async function getMonitoredItems(): Promise<MonitoredItemData> {
        return await subscription.getMonitoredItems()
    }

    /**
     * @description 注意删除该monitoredItem之后并不会改变其他Item在数组当中的index,本index的元素只是被置为empty
     * @param nodeIds
     */
    export async function deleteMonitoredItems(nodeIds: string[]) {
        try {
            for (let i of nodeIds) {
                let item = monitoredItems.get(i)
                if (item) {
                    await item.monitoredItem.terminate()
                    monitoredItems.delete(i)
                }
            }
        } catch (e: any) {
            throw new ClientError(Sources.subscription, Errors.wrongIndexOfArray, e.message)
        }
    }

    // export function deleteMonitoredItemGroups(indexes: number[]) {
    //     try {
    //         for (let i of indexes) {
    //             delete monitoredItemGroups[i]
    //         }
    //     } catch (e: any) {
    //         throw new ClientError(Sources.subscription, Errors.wrongIndexOfArray, {Error: e.message})
    //     }
    // }

    function bindingAndPush(monitoredItem: ClientMonitoredItem, displayName: string, itemId: any) {
        itemId = itemId.toString()
        monitoredItem
            .on('changed', (data) => {
                // UaMessageQueue.enqueue(data, monitoredItem.itemToMonitor, monitoredItems[itemId].displayName)
                let item = monitoredItems.get(itemId)
                if (item) {
                    UaMessageQueue.enqueue(
                        new MessageModel(data, monitoredItem.itemToMonitor.nodeId.toString()),
                        item.displayName
                    )
                }
            })
            .on('initialized', () => {
                Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemInit, {NodeId: itemId}))
            })
            .on('terminated', () => {
                Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemTerminate))
            })
            .on('err', function itemErrHandler(err) {
                Log.error(new ClientError(Sources.subscription, Errors.errorMonitoringItem, err))
            })
        monitoredItems.set(itemId, {monitoredItem: monitoredItem, displayName: displayName})
    }
}