/**
 * @description 数据库创建表格模式
 */
export var TableCreateModes;
(function (TableCreateModes) {
    TableCreateModes[TableCreateModes["default"] = 0] = "default";
    TableCreateModes[TableCreateModes["customField"] = 1] = "customField";
    TableCreateModes[TableCreateModes["customTableName"] = 2] = "customTableName";
    TableCreateModes[TableCreateModes["customBoth"] = 3] = "customBoth";
    TableCreateModes[TableCreateModes["createPerYear"] = 4] = "createPerYear";
    TableCreateModes[TableCreateModes["createPerMonth"] = 5] = "createPerMonth";
    TableCreateModes[TableCreateModes["createPerWeek"] = 6] = "createPerWeek";
    TableCreateModes[TableCreateModes["createPerDay"] = 7] = "createPerDay";
})(TableCreateModes || (TableCreateModes = {}));
export var ServerStatusCodes;
(function (ServerStatusCodes) {
    ServerStatusCodes[ServerStatusCodes["success"] = 200] = "success";
    ServerStatusCodes[ServerStatusCodes["unableToFindTheRequestedResource"] = 400] = "unableToFindTheRequestedResource";
    ServerStatusCodes[ServerStatusCodes["notFound"] = 404] = "notFound";
    ServerStatusCodes[ServerStatusCodes["internalError"] = 500] = "internalError";
})(ServerStatusCodes || (ServerStatusCodes = {}));
export var ServerMessage;
(function (ServerMessage) {
    ServerMessage["success"] = "success";
    ServerMessage["warn"] = "warn";
    ServerMessage["error"] = "internal error";
})(ServerMessage || (ServerMessage = {}));
export var UaSources;
(function (UaSources) {
    UaSources["server"] = "Server";
    UaSources["clientService"] = "ClientService";
    UaSources["subscriptService"] = "SessionSubscription";
    UaSources["sessionService"] = "ClientSession";
    UaSources["paramValidator"] = "ParamValidator";
    UaSources["certService"] = "CertificateService";
    UaSources["dbService"] = "DBService";
})(UaSources || (UaSources = {}));
export var UaWarns;
(function (UaWarns) {
    UaWarns["endPointsNotExist"] = "Endpoints does not exist";
    UaWarns["serversNotExist"] = "There is no server on this network";
    UaWarns["emptyRootFolder"] = "Empty root folder";
    UaWarns["nonExistentItem"] = "This item do not exist";
    UaWarns["noSubscription"] = "Subscription does not exist";
    UaWarns["pathNotExist"] = "The path do not exist";
})(UaWarns || (UaWarns = {}));
export var UaErrors;
(function (UaErrors) {
    //client errors
    UaErrors["errorConnecting"] = "Exception connecting server";
    UaErrors["errorGetEndpoints"] = "Exception getting endpoints";
    UaErrors["errorGetServers"] = "Exception getting servers on network";
    UaErrors["errorCreateClient"] = "Exception creating client";
    //session errors
    UaErrors["errorClosingSession"] = "Exception closing session";
    UaErrors["errorWriting"] = "Exception writing to server";
    UaErrors["errorGetNodeByName"] = "Exception getting node id by browse name";
    UaErrors["errorBrowsing"] = "Exception browsing";
    UaErrors["errorReading"] = "Exception reading";
    UaErrors["errorChangeIdentity"] = "Exception changing identity of session";
    UaErrors["errorCreateSession"] = "Exception creating session";
    UaErrors["errorReadHistory"] = "Exception reading history value";
    UaErrors["errorHistoryRead"] = "Exception getting history read";
    //subscript errors
    UaErrors["errorCreatingSub"] = "Exception creating subscription";
    UaErrors["errorMonitoringItem"] = "Exception monitoring item";
    UaErrors["wrongIndexOfArray"] = "Wrong index of array";
    UaErrors["errorAddMonitoredItem"] = "Exception adding monitored item";
    UaErrors["errorModifySub"] = "Exception modifying subscription";
    UaErrors["errorBinding"] = "Exception binding to monitored item";
    //cert errors
    UaErrors["errorCreatCert"] = "Exception creating certificate";
    UaErrors["errorTrustCert"] = "Exception trusting certificate of server";
    UaErrors["errorRejectCert"] = "Exception rejecting certificate of server";
    UaErrors["errorGetTrust"] = "Exception getting trust status";
    UaErrors["errorCertOptions"] = "Wrong options to create Certificate";
    //db errors
    UaErrors["errorTableMode"] = "Wrong table create mode";
    UaErrors["errorInitStmt"] = "Exception occurred init sqlite";
    UaErrors["errorCloseDb"] = "Exception closing database";
    UaErrors["errorBackUp"] = "Exception backup database";
    UaErrors["errorCreatTable"] = "Exception creating table";
    UaErrors["errorInsert"] = "Exception inserting into table";
    UaErrors["errorConfigDb"] = "Exception configuring database";
    UaErrors["errorInitDb"] = "Exception init database";
    //other errors
    UaErrors["internalError"] = "Exception occurred in server";
    UaErrors["errorValidateParam"] = "Wrong Param";
    UaErrors["unFormatDbName"] = "Wrong format database name input";
    UaErrors["wrongJsonScheme"] = "Wrong Json scheme ,check the request body";
})(UaErrors || (UaErrors = {}));
export var UaInfos;
(function (UaInfos) {
    UaInfos["clientDisconnect"] = "Client disconnected";
    UaInfos["clientCreated"] = "Client created";
    UaInfos["connectionCreated"] = "Established connection";
    UaInfos["sessionClosed"] = "Session closed";
    UaInfos["sessionCreated"] = "Session created";
    UaInfos["getPrivateKey"] = "Getting private key";
    UaInfos["getCertificate"] = "Getting certificate";
    UaInfos["installedSub"] = "Installed subscription on session";
    UaInfos["terminateSub"] = "Terminated subscription";
    UaInfos["getIdByName"] = "Get NodeId by browseName";
    UaInfos["monitoredItemInit"] = "Monitored item initialized";
    UaInfos["monitoredItemTerminate"] = "Monitored item terminated";
    UaInfos["monitoredItemGroupInit"] = "Monitored item group initialized";
    UaInfos["monitoredItemGroupTerminate"] = "Monitored item group terminated";
    UaInfos["modifySubscription"] = "Modify subscription";
    UaInfos["certCreated"] = "Certificate created";
})(UaInfos || (UaInfos = {}));
