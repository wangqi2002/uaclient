import {MonitoringParametersOptions, ReadValueIdOptions, TimestampsToReturn} from 'node-opcua'

export interface AddOneParam {
    itemToMonitor: ReadValueIdOptions,
    displayName: string,
    parameters?: MonitoringParametersOptions,
    timeStampToReturn: TimestampsToReturn
}

export interface AddManyParam {
    itemsToMonitor: ReadValueIdOptions[],
    displayNames: string[],
    parameters?: MonitoringParametersOptions,
    timeStampToReturn: TimestampsToReturn
}