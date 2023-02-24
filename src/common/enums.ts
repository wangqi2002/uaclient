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
    warn = 'warn',
    error = 'internal error',
}

export enum Sources {
    server = 'Server',
    clientService = 'ClientService',
    subscriptService = 'SessionSubscription',
    sessionService = 'ClientSession',
    paramValidator = 'ParamValidator',
    certService = 'CertificateService',
    dbService = 'DBService',
}

export enum Warns {
    endPointsNotExist = 'Endpoints does not exist',
    serversNotExist = 'There is no server on this network',
    emptyRootFolder = 'Empty root folder',
    nonExistentItem = 'This item do not exist',
}

export enum Errors {
    //client errors
    errorConnecting = 'Exception connecting server',
    errorGetEndpoints = 'Exception getting endpoints',
    errorGetServers = 'Exception getting servers on network',
    errorCreateClient = 'Exception creating client',

    //session errors
    errorClosingSession = 'Exception closing session',
    errorWriting = 'Exception writing to server',
    errorGetNodeByName = 'Exception getting node id by browse name',
    errorBrowsing = 'Exception browsing',
    errorReading = 'Exception reading',
    errorChangeIdentity = 'Exception changing identity of session',
    errorCreateSession = 'Exception creating session',

    //subscript errors
    errorCreatingSub = 'Exception creating subscription',
    errorMonitoringItem = 'Exception monitoring item',
    noSubscription = 'Subscription does not exist',
    wrongIndexOfArray = 'Wrong index of array',
    errorAddMonitoredItem = 'Exception adding monitored item',
    errorModifySub = 'Exception modifying subscription',

    //cert errors
    errorCreatCert = 'Exception creating certificate',
    errorTrustCert = 'Exception trusting certificate of server',
    errorRejectCert = 'Exception rejecting certificate of server',
    errorGetTrust = 'Exception getting trust status',

    //db errors
    errorTableMode = 'Wrong table create mode',
    errorSqlite = 'Exception occurred in sqlite',
    errorCloseDb = 'Exception closing database',
    errorBackUp = 'Exception backup database',

    //other errors
    internalError = 'Exception occurred in server',
    errorValidateParam = 'Wrong Param',
    unFormatDbName = 'Wrong format database name input',
    wrongJsonScheme = 'Wrong Json scheme ,check the request body',
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
    certCreated = 'Certificate created',
}