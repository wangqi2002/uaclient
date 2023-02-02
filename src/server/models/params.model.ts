import {MonitoringParametersOptions, ReadValueIdOptions, TimestampsToReturn} from 'node-opcua'

export interface AddOneParam {
    itemToMonitor: ReadValueIdOptions,
    displayName: string,
    timeStampToReturn?: TimestampsToReturn,
    parameters?: MonitoringParametersOptions,
}

export interface AddManyParam {
    itemsToMonitor: ReadValueIdOptions[],
    displayNames: string[],
    timeStampToReturn?: TimestampsToReturn,
    parameters?: MonitoringParametersOptions,
}