import {ClientMonitoredItem, MonitoringParametersOptions, ReadValueIdOptions, TimestampsToReturn} from 'node-opcua'

export interface SubscriptSingleParam {
    itemToMonitor: ReadValueIdOptions,
    displayName: string,
    timeStampToReturn?: TimestampsToReturn,
    parameters?: MonitoringParametersOptions,
}

export interface SubscriptGroupParam {
    itemsToMonitor: ReadValueIdOptions[],
    displayNames: string[],
    timeStampToReturn?: TimestampsToReturn,
    parameters?: MonitoringParametersOptions,
}

export interface ItemAndName {
    displayName: string
    monitoredItem: ClientMonitoredItem
}

export type NodeID = string