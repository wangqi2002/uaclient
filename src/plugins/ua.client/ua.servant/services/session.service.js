"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const node_opcua_1 = require("node-opcua");
const ua_enums_1 = require("../../common/ua.enums");
const client_service_1 = require("./client.service");
const typia_1 = require("typia");
const log_1 = require("../../../../platform/base/log/log");
var SessionService;
(function (SessionService) {
    SessionService.userIdentity = { type: node_opcua_1.UserTokenType.Anonymous };
    function createSession(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userInfo)
                    SessionService.userIdentity = userInfo;
                SessionService.session = yield client_service_1.ClientService.client.createSession(SessionService.userIdentity);
                if (client_service_1.ClientService.client.endpoint) {
                    client_service_1.ClientService.currentServer = client_service_1.ClientService.client.endpoint.server.applicationName.text
                        ? client_service_1.ClientService.client.endpoint.server.applicationName.text.toString()
                        : 'Default Server';
                }
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorCreateSession, e.message, e.stack);
            }
        });
    }
    SessionService.createSession = createSession;
    function changeIdentity(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SessionService.session.changeUser(userInfo);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorChangeIdentity, e.message, e.stack);
            }
        });
    }
    SessionService.changeIdentity = changeIdentity;
    function closeSession(deleteSubscription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (SessionService.session) {
                try {
                    yield SessionService.session.close(deleteSubscription);
                }
                catch (e) {
                    throw new log_1.ClientError(ua_enums_1.UaSources.subscriptService, ua_enums_1.UaErrors.errorClosingSession, e.message, e.stack);
                }
            }
        });
    }
    SessionService.closeSession = closeSession;
    function readByNodeId(nodeToRead, maxAge) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (maxAge)
                    return yield SessionService.session.read(nodeToRead, maxAge);
                return yield SessionService.session.read(nodeToRead);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorReading, e.message, e.stack);
            }
        });
    }
    SessionService.readByNodeId = readByNodeId;
    function browseRootFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let browseResult = yield SessionService.session.browse('RootFolder');
                let resultList = [];
                if (browseResult.references) {
                    resultList = browseResult.references;
                }
                else {
                    throw new log_1.ClientWarn(ua_enums_1.UaSources.sessionService, ua_enums_1.UaWarns.emptyRootFolder);
                }
                return resultList;
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorBrowsing, e.message, e.stack);
            }
        });
    }
    SessionService.browseRootFolder = browseRootFolder;
    function getNodeIdByBrowseName(relativePathBNF, rootNode = 'RootFolder') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                relativePathBNF = '/' + relativePathBNF;
                let browsePath = (0, node_opcua_1.makeBrowsePath)(rootNode, relativePathBNF);
                return yield SessionService.session.translateBrowsePath(browsePath);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorGetNodeByName, e.message, e.stack);
            }
        });
    }
    SessionService.getNodeIdByBrowseName = getNodeIdByBrowseName;
    function writeToServer(nodesToWrite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SessionService.session.write(nodesToWrite);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorWriting, e.message, e.stack);
            }
        });
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
    function browse(nodeToBrowse, browseNext) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((input => {
                    const $io0 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io1(input.nodeId)) && (undefined === input.browseDirection || 0 === input.browseDirection || 1 === input.browseDirection || 2 === input.browseDirection || 3 === input.browseDirection) && (null === input.referenceTypeId || undefined === input.referenceTypeId || "string" === typeof input.referenceTypeId || "number" === typeof input.referenceTypeId || "object" === typeof input.referenceTypeId && null !== input.referenceTypeId && $io1(input.referenceTypeId)) && (undefined === input.includeSubtypes || "boolean" === typeof input.includeSubtypes) && (undefined === input.nodeClassMask || "number" === typeof input.nodeClassMask) && (undefined === input.resultMask || "number" === typeof input.resultMask);
                    const $io1 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(nodeToBrowse) && 'resultMask' in nodeToBrowse) {
                    nodeToBrowse.resultMask = (0, node_opcua_1.makeResultMask)('ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition');
                }
                let result = yield SessionService.session.browse(nodeToBrowse);
                if (browseNext && result.continuationPoint) {
                    return yield SessionService.session.browseNext(result.continuationPoint, true);
                }
                return result;
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorBrowsing, e.message, e.stack);
            }
        });
    }
    SessionService.browse = browse;
    function serverCert() {
        return SessionService.session.serverCertificate.toString();
    }
    SessionService.serverCert = serverCert;
    //todo 是否可用?
    function historyRead(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SessionService.session.historyRead(request);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorHistoryRead, e.message, e.stack);
            }
        });
    }
    SessionService.historyRead = historyRead;
    function readHistoryValue(param) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { nodeToRead, start, end, options } = param;
                if (options)
                    return yield SessionService.session.readHistoryValue(nodeToRead, start, end, options);
                return yield SessionService.session.readHistoryValue(nodeToRead, start, end);
            }
            catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.sessionService, ua_enums_1.UaErrors.errorReadHistory, e.message, e.stack);
            }
        });
    }
    SessionService.readHistoryValue = readHistoryValue;
})(SessionService = exports.SessionService || (exports.SessionService = {}));
