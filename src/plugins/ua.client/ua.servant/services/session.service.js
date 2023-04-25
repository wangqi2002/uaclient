"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.SessionService = void 0;
const node_opcua_1 = require("node-opcua");
const ua_enums_1 = require("../../common/ua.enums");
const client_service_1 = require("./client.service");
const typia_1 = require("typia");
const log_1 = require("../../../../platform/base/log/log");
var SessionService;
(function (SessionService) {
    SessionService.userIdentity = {type: node_opcua_1.UserTokenType.Anonymous};

    async function createSession(userInfo) {
        try {
            if (userInfo)
                SessionService.userIdentity = userInfo;
            SessionService.session = await client_service_1.ClientService.client.createSession(SessionService.userIdentity);
            if (client_service_1.ClientService.client.endpoint) {
                client_service_1.ClientService.currentServer = client_service_1.ClientService.client.endpoint.server.applicationName.text
                    ? client_service_1.ClientService.client.endpoint.server.applicationName.text.toString()
                    : 'Default Server';
            }
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorCreateSession, e.message, e.stack);
        }
    }

    SessionService.createSession = createSession;

    async function changeIdentity(userInfo) {
        try {
            await SessionService.session.changeUser(userInfo);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorChangeIdentity, e.message, e.stack);
        }
    }

    SessionService.changeIdentity = changeIdentity;

    async function closeSession(deleteSubscription) {
        if (SessionService.session) {
            try {
                await SessionService.session.close(deleteSubscription);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorClosingSession, e.message, e.stack);
            }
        }
    }

    SessionService.closeSession = closeSession;

    async function readByNodeId(nodeToRead, maxAge) {
        try {
            if (maxAge)
                return await SessionService.session.read(nodeToRead, maxAge);
            return await SessionService.session.read(nodeToRead);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorReading, e.message, e.stack);
        }
    }

    SessionService.readByNodeId = readByNodeId;

    async function browseRootFolder() {
        try {
            let browseResult = await SessionService.session.browse('RootFolder');
            let resultList = [];
            if (browseResult.references) {
                resultList = browseResult.references;
            } else {
                throw new log_1.ClientWarn(ua_enums_1.UaSources.sessionService, ua_enums_1.UaWarns.emptyRootFolder);
            }
            return resultList;
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorBrowsing, e.message, e.stack);
        }
    }

    SessionService.browseRootFolder = browseRootFolder;

    async function getNodeIdByBrowseName(relativePathBNF, rootNode = 'RootFolder') {
        try {
            relativePathBNF = '/' + relativePathBNF;
            let browsePath = (0, node_opcua_1.makeBrowsePath)(rootNode, relativePathBNF);
            return await SessionService.session.translateBrowsePath(browsePath);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorGetNodeByName, e.message, e.stack);
        }
    }

    SessionService.getNodeIdByBrowseName = getNodeIdByBrowseName;

    async function writeToServer(nodesToWrite) {
        try {
            return await SessionService.session.write(nodesToWrite);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorWriting, e.message, e.stack);
        }
    }

    SessionService.writeToServer = writeToServer;

    /**
     * @description
     * 返回browseResult,包含references和statusCode和continuation point,
     * 如果使用browseNext,那么应当确定该node具有continuation point
     * @example
     * SessionService.browse({nodeId: 'i=2253',resultMask:rs},true)
     * @param nodeToBrowse
     * @param browseNext
     */
    async function browse(nodeToBrowse, browseNext) {
        try {
            if ((input => {
                const $io0 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io1(input.nodeId)) && (undefined === input.browseDirection || 0 === input.browseDirection || 1 === input.browseDirection || 2 === input.browseDirection || 3 === input.browseDirection) && (null === input.referenceTypeId || undefined === input.referenceTypeId || "string" === typeof input.referenceTypeId || "number" === typeof input.referenceTypeId || "object" === typeof input.referenceTypeId && null !== input.referenceTypeId && $io1(input.referenceTypeId)) && (undefined === input.includeSubtypes || "boolean" === typeof input.includeSubtypes) && (undefined === input.nodeClassMask || "number" === typeof input.nodeClassMask) && (undefined === input.resultMask || "number" === typeof input.resultMask);
                const $io1 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
            })(nodeToBrowse) && 'resultMask' in nodeToBrowse) {
                nodeToBrowse.resultMask = (0, node_opcua_1.makeResultMask)('ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition');
            }
            let result = await SessionService.session.browse(nodeToBrowse);
            if (browseNext && result.continuationPoint) {
                return await SessionService.session.browseNext(result.continuationPoint, true);
            }
            return result;
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorBrowsing, e.message, e.stack);
        }
    }

    SessionService.browse = browse;

    function serverCert() {
        return SessionService.session.serverCertificate.toString();
    }

    SessionService.serverCert = serverCert;

    //todo 是否可用?
    async function historyRead(request) {
        try {
            return await SessionService.session.historyRead(request);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorHistoryRead, e.message, e.stack);
        }
    }

    SessionService.historyRead = historyRead;

    async function readHistoryValue(param) {
        try {
            let {nodeToRead, start, end, options} = param;
            if (options)
                return await SessionService.session.readHistoryValue(nodeToRead, start, end, options);
            return await SessionService.session.readHistoryValue(nodeToRead, start, end);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorReadHistory, e.message, e.stack);
        }
    }

    SessionService.readHistoryValue = readHistoryValue;
})(SessionService = exports.SessionService || (exports.SessionService = {}));
