/**
 * @description 数据库创建表格模式
 */
export enum TableCreateModes {
    default = 0,
    customField = 1,
    customTableName = 2,
    customBoth = 3,
    createPerYear = 4,
    createPerMonth = 5,
    createPerWeek = 6,
    createPerDay = 7
}

export enum ServerStatusCodes {
    success = 200,
    unableToFindTheRequestedResource = 400,
    notFound = 404,
    internalError = 500,
}

export enum ServerMessage {
    success = 'success',
}

export enum Sources {
    addressSpace = 'AddressSpace',
    dataAccess = 'DataAccess',
    clientService = 'ClientService',
    subscription = 'SessionSubscription',
    clientSession = 'ClientSession'
}

export enum Warns {
    endPointsNotExist = 'Endpoints does not exist',
    serversNotExist = 'There is no server on this network',
    emptyRootFolder = 'Empty root folder',

}

export enum Errors {
    errorClosingSession = 'An exception occurred while closing the session',
    errorConnecting = 'An exception occurred while closing the session maybe the endpoint url not exist',
    errorCreatingSub = 'An exception occurred while creating the subscription',
    errorWriting = 'An exception occurred while writing to the server',
    errorMonitoringItem = 'An exception occurred monitoring item',
    errorTerminatingItemGroup='An exception occurred terminating item',
    noSubscription = 'Subscription does not exist',
    wrongIndexOfArray='You input the wrong index of array',
}

export enum Infos {
    clientDisconnect = 'Client disconnected',
    clientCreated = 'Client created',
    connectionCreated = 'Established connection',
    sessionClosed = 'Session closed',
    sessionCreated = 'Session created',
    getPrivateKey = 'Getting private key',
    getCertificate = 'Getting certificate',
    installedSub = 'Installed subscription on session',
    terminateSub = 'Terminated subscription',
    getIdByName = 'Get NodeId by browseName',
    monitoredItemInit = 'Monitored item initialized',
    monitoredItemTerminate = 'Monitored item terminated',
    monitoredItemGroupInit = 'Monitored item group initialized',
    monitoredItemGroupTerminate = 'Monitored item group terminated',
    modifySubscription='Modify subscription',
}