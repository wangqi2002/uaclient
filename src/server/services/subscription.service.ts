import {
    ClientMonitoredItem,
    ClientMonitoredItemGroup,
    ClientSubscription,
    ClientSubscriptionOptions,
    ModifySubscriptionOptions,
    MonitoredItemData,
    MonitoringParametersOptions,
    ReadValueIdOptions,
    TimestampsToReturn
} from 'node-opcua'
import {SessionService} from './session.service'
import {Log} from '../../common/log'
import {ClientError, ClientInfo} from '../../common/informations'
import {Errors, Infos, Sources} from '../../common/enums'
import {UaMessageQueue} from '../../common/mq'

export module SubscriptionService {
    export let subscription!: ClientSubscription
    export let monitoredItemGroup!: ClientMonitoredItemGroup
    export let monitoredItems!: ClientMonitoredItem[]

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
     * @param itemsToMonitor
     * @param parameters
     * @param timeStampToReturn
     */
    export function createMonitoredItemGroup(
        itemsToMonitor: ReadValueIdOptions[],
        parameters: MonitoringParametersOptions = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10,
        },
        timeStampToReturn: TimestampsToReturn = TimestampsToReturn.Both,
    ) {
        if (subscription) {
            monitoredItemGroup = ClientMonitoredItemGroup.create(
                subscription,
                itemsToMonitor,
                parameters,
                timeStampToReturn,
            )
            monitoredItemGroup
                .on('changed', function itemGroupChangedHandler(data, data2) {
                    UaMessageQueue.enqueue(data2)
                })
                .on('initialized', function itemGroupInitializedHandler() {
                    Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemGroupInit))
                })
                .on('terminated', function itemGroupTerminatedHandler(err) {
                    if (err) Log.error(new ClientError(Sources.subscription, Errors.errorTerminatingItemGroup, {Error: err.message}))
                    Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemGroupTerminate))
                })
                .on('err', function itemGroupErrHandler() {
                    console.log('err')
                })
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
     * @param itemToMonitor
     * @param parameters
     */
    export function addMonitoredItem(
        itemToMonitor: ReadValueIdOptions,
        parameters: MonitoringParametersOptions = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10,
        },
    ) {
        let monitoredItem = ClientMonitoredItem.create(
            subscription,
            itemToMonitor,
            parameters,
            TimestampsToReturn.Both,
        )
        monitoredItem
            .on('changed', function itemGroupChangedHandler(data) {
                UaMessageQueue.enqueue(data)
            })
            .on('initialized', function itemGroupInitializedHandler() {
                Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemInit, {Index: monitoredItems.length}))
            })
            .on('terminated', function itemGroupTerminatedHandler() {
                Log.info(new ClientInfo(Sources.subscription, Infos.monitoredItemTerminate))
            })
            .on('err', function itemGroupErrHandler(err) {
                Log.error(new ClientError(Sources.subscription, Errors.errorMonitoringItem, {Error: err}))
            })
        monitoredItems.push(monitoredItem)
    }

    export async function getMonitoredItems(): Promise<MonitoredItemData> {
        return await subscription.getMonitoredItems()
    }

    /**
     * @description 注意删除该monitoredItem之后并不会改变其他Item在数组当中的index,本index的元素只是被置为empty
     * @param index
     */
    export function deleteMonitoredItem(index: number) {
        try {
            delete monitoredItems[index]
        } catch (e: any) {
            throw new ClientError(Sources.subscription, Errors.wrongIndexOfArray, {Error: e.message})
        }
    }
}