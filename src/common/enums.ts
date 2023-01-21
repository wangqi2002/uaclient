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
    server = 'Server',
    dataAccess = 'DataAccess',
    clientService = 'ClientService',
    subscription = 'SessionSubscription',
    sessionService = 'ClientSession',
    paramValidator = 'ParamValidator',
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
    errorTerminatingItemGroup = 'An exception occurred terminating item',
    errorGetEndpoints = 'An exception occurred getting endpoints',
    noSubscription = 'Subscription does not exist',
    wrongIndexOfArray = 'You input the wrong index of array',
    internalError = 'An exception occurred in server',
    errorGetServers = 'An exception occurred while getting servers on network',
    errorCreateClient = 'An exception occurred while creating client',
    errorGetNodeByName = 'An exception occurred while getting node id by browse name',
    errorBrowsing = 'An exception occurred while browsing',
    errorReading = 'An exception occurred while reading',
    errorChangeIdentity = 'An exception occurred while changing identity of session',
    errorCreateSession = 'An exception occurred while creating session',
    errorValidateParam = 'Wrong param',
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
    modifySubscription = 'Modify subscription',
}