import "koa-body/lib/index";
import { is } from "typia";
import { UaErrors, UaInfos, UaSources } from "../../common/ua.enums";
import { ClientError, ClientInfo, Log } from "../../../../platform/base/log/log";
import { CertUtils, DbUtils } from "../utils/util";
export var AgentMiddleware;
(function (AgentMiddleware) {
    async function clientValidator(ctx, next) {
        switch (ctx.request.path) {
            case "/client/init": {
                ctx.request.body;
                if ((input => {
                    const $io0 = input => (undefined === input.requestedSessionTimeout || "number" === typeof input.requestedSessionTimeout) && (undefined === input.endpoint_must_exist || "boolean" === typeof input.endpoint_must_exist) && (undefined === input.endpointMustExist || "boolean" === typeof input.endpointMustExist) && (undefined === input.connectionStrategy || "object" === typeof input.connectionStrategy && null !== input.connectionStrategy && false === Array.isArray(input.connectionStrategy) && $io1(input.connectionStrategy)) && (undefined === input.serverCertificate || input.serverCertificate instanceof Buffer) && (undefined === input.defaultSecureTokenLifetime || "number" === typeof input.defaultSecureTokenLifetime) && (undefined === input.securityMode || 0 === input.securityMode || 1 === input.securityMode || 2 === input.securityMode || 3 === input.securityMode || "string" === typeof input.securityMode) && (undefined === input.securityPolicy || "string" === typeof input.securityPolicy) && (undefined === input.keepSessionAlive || "boolean" === typeof input.keepSessionAlive) && (undefined === input.certificateFile || "string" === typeof input.certificateFile) && (undefined === input.privateKeyFile || "string" === typeof input.privateKeyFile) && (undefined === input.clientName || "string" === typeof input.clientName) && (undefined === input.applicationName || "string" === typeof input.applicationName) && (undefined === input.applicationUri || "string" === typeof input.applicationUri) && (undefined === input.tokenRenewalInterval || "number" === typeof input.tokenRenewalInterval) && (undefined === input.keepPendingSessionsOnDisconnect || "boolean" === typeof input.keepPendingSessionsOnDisconnect) && (undefined === input.clientCertificateManager || "object" === typeof input.clientCertificateManager && null !== input.clientCertificateManager && $io2(input.clientCertificateManager)) && (undefined === input.discoveryUrl || "string" === typeof input.discoveryUrl) && (undefined === input.transportSettings || "object" === typeof input.transportSettings && null !== input.transportSettings && false === Array.isArray(input.transportSettings) && $io3(input.transportSettings));
                    const $io1 = input => (undefined === input.maxRetry || "number" === typeof input.maxRetry) && (undefined === input.initialDelay || "number" === typeof input.initialDelay) && (undefined === input.maxDelay || "number" === typeof input.maxDelay) && (undefined === input.randomisationFactor || "number" === typeof input.randomisationFactor);
                    const $io2 = input => "number" === typeof input.referenceCounter && "boolean" === typeof input.automaticallyAcceptUnknownCertificate && "boolean" === typeof input.untrustUnknownCertificate && (0 === input.state || 1 === input.state || 2 === input.state || 3 === input.state || 4 === input.state) && "number" === typeof input.folderPoolingInterval;
                    const $io3 = input => (undefined === input.maxChunkCount || "number" === typeof input.maxChunkCount) && (undefined === input.maxMessageSize || "number" === typeof input.maxMessageSize) && (undefined === input.sendBufferSize || "number" === typeof input.sendBufferSize) && (undefined === input.receiveBufferSize || "number" === typeof input.receiveBufferSize);
                    return undefined === input || "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.clientService, UaInfos.clientCreated, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("OPCUAClientOptions | undefined");
                }
                break;
            }
            case "/client/connect": {
                if ((input => {
                    const $io0 = input => "string" === typeof input.endpointUrl;
                    return "object" === typeof input && null !== input && "string" === typeof input.endpointUrl;
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.clientService, UaInfos.connectionCreated, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("{ endpointUrl: string }");
                }
                break;
            }
            case "/client/endpoints": {
                if ((input => {
                    const $io0 = input => (undefined === input.reduce || "boolean" === typeof input.reduce) && (undefined === input.clientExist || "boolean" === typeof input.clientExist) && (undefined === input.endpoint || "string" === typeof input.endpoint);
                    return undefined === input || "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.clientService, UaInfos.connectionCreated, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("{ endpointUrl: string }");
                }
                break;
            }
            case "/client/disconnect": {
                if ((input => {
                    const $io0 = input => "boolean" === typeof input.deleteSubscription;
                    return undefined === input || "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.clientService, UaInfos.sessionClosed));
                    Log.info(new ClientInfo(UaSources.clientService, UaInfos.clientDisconnect));
                    await next();
                }
                else {
                    throw validateError("{ deleteSubscription: boolean } | {}");
                }
                break;
            }
            case "/client/private_key": {
                Log.info(new ClientInfo(UaSources.clientService, UaInfos.getPrivateKey));
                break;
            }
            case "client/cert": {
                Log.info(new ClientInfo(UaSources.clientService, UaInfos.getCertificate));
                break;
            }
            default:
                await next();
        }
    }
    AgentMiddleware.clientValidator = clientValidator;
    async function sessionValidator(ctx, next) {
        switch (ctx.request.body) {
            case "/session/init": {
                if ((input => {
                    const $io0 = input => 0 === input.type;
                    const $io1 = input => 2 === input.type && input.certificateData instanceof Buffer && "string" === typeof input.privateKey && (null === input.policyId || undefined === input.policyId || "string" === typeof input.policyId);
                    const $io2 = input => 1 === input.type && "string" === typeof input.userName && "string" === typeof input.password;
                    const $iu0 = input => (() => {
                        if (0 === input.type)
                            return $io0(input);
                        if (2 === input.type)
                            return $io1(input);
                        if (1 === input.type)
                            return $io2(input);
                        return false;
                    })();
                    return undefined === input || "object" === typeof input && null !== input && $iu0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.sessionService, UaInfos.sessionCreated));
                    await next();
                }
                else {
                    throw validateError("UserIdentityInfo | undefined");
                }
                break;
            }
            case "/session/change_identity": {
                if ((input => {
                    const $io0 = input => 0 === input.type;
                    const $io1 = input => 2 === input.type && input.certificateData instanceof Buffer && "string" === typeof input.privateKey && (null === input.policyId || undefined === input.policyId || "string" === typeof input.policyId);
                    const $io2 = input => 1 === input.type && "string" === typeof input.userName && "string" === typeof input.password;
                    const $iu0 = input => (() => {
                        if (0 === input.type)
                            return $io0(input);
                        if (2 === input.type)
                            return $io1(input);
                        if (1 === input.type)
                            return $io2(input);
                        return false;
                    })();
                    return "object" === typeof input && null !== input && $iu0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("UserIdentityInfo");
                }
                break;
            }
            case "/session/close": {
                if ((input => {
                    const $io0 = input => "boolean" === typeof input.deleteSubscription;
                    return undefined === input || "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("{ deleteSubscription: boolean } | undefined");
                }
                break;
            }
            case "/session/read": {
                if ((input => {
                    const $io0 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io1(input.nodeId)) && (undefined === input.attributeId || "number" === typeof input.attributeId) && (undefined === input.indexRange || "object" === typeof input.indexRange && null !== input.indexRange && $io2(input.indexRange)) && (null === input.dataEncoding || undefined === input.dataEncoding || "string" === typeof input.dataEncoding || "object" === typeof input.dataEncoding && null !== input.dataEncoding && false === Array.isArray(input.dataEncoding) && $io3(input.dataEncoding));
                    const $io1 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io2 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io3 = input => (undefined === input.namespaceIndex || "number" === typeof input.namespaceIndex) && (null === input.name || undefined === input.name || "string" === typeof input.name);
                    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("ReadValueIdOptions");
                }
                break;
            }
            case "/session/id": {
                if ((input => {
                    const $io0 = input => "string" === typeof input.path;
                    return "object" === typeof input && null !== input && "string" === typeof input.path;
                })(ctx.query)) {
                    Log.info(new ClientInfo(UaSources.sessionService, UaInfos.getIdByName, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("{ path: string }");
                }
                break;
            }
            case "/session/write": {
                if ((input => {
                    const $io0 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io1(input.nodeId)) && (undefined === input.attributeId || "number" === typeof input.attributeId) && (undefined === input.indexRange || "object" === typeof input.indexRange && null !== input.indexRange && $io2(input.indexRange)) && (null === input.value || undefined === input.value || "object" === typeof input.value && null !== input.value && false === Array.isArray(input.value) && $iu0(input.value));
                    const $io1 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io2 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io3 = input => "object" === typeof input.value && null !== input.value && $io4(input.value) && ("object" === typeof input.statusCode && null !== input.statusCode && true) && (undefined !== input.sourceTimestamp && (null === input.sourceTimestamp || input.sourceTimestamp instanceof Date || "object" === typeof input.sourceTimestamp && null !== input.sourceTimestamp && $io6(input.sourceTimestamp))) && "number" === typeof input.sourcePicoseconds && (undefined !== input.serverTimestamp && (null === input.serverTimestamp || input.serverTimestamp instanceof Date || "object" === typeof input.serverTimestamp && null !== input.serverTimestamp && $io6(input.serverTimestamp))) && "number" === typeof input.serverPicoseconds;
                    const $io4 = input => (0 === input.dataType || 1 === input.dataType || 2 === input.dataType || 3 === input.dataType || 4 === input.dataType || 5 === input.dataType || 6 === input.dataType || 7 === input.dataType || 8 === input.dataType || 9 === input.dataType || 10 === input.dataType || 11 === input.dataType || 12 === input.dataType || 13 === input.dataType || 14 === input.dataType || 15 === input.dataType || 16 === input.dataType || 17 === input.dataType || 18 === input.dataType || 19 === input.dataType || 20 === input.dataType || 21 === input.dataType || 22 === input.dataType || 23 === input.dataType || 24 === input.dataType || 25 === input.dataType) && (0 === input.arrayType || 1 === input.arrayType || 2 === input.arrayType) && true && (null === input.dimensions || Array.isArray(input.dimensions) && input.dimensions.every(elem => "number" === typeof elem));
                    const $io5 = input => true;
                    const $io6 = input => "number" === typeof input.picoseconds && (Array.isArray(input.high_low) && (input.high_low.length === 2 && "number" === typeof input.high_low[0] && "number" === typeof input.high_low[1]));
                    const $io7 = input => (undefined === input.value || "object" === typeof input.value && null !== input.value && false === Array.isArray(input.value) && $io8(input.value)) && (undefined === input.statusCode || "object" === typeof input.statusCode && null !== input.statusCode && false === Array.isArray(input.statusCode) && $io5(input.statusCode)) && (null === input.sourceTimestamp || undefined === input.sourceTimestamp || input.sourceTimestamp instanceof Date || "object" === typeof input.sourceTimestamp && null !== input.sourceTimestamp && $io6(input.sourceTimestamp)) && (undefined === input.sourcePicoseconds || "number" === typeof input.sourcePicoseconds) && (null === input.serverTimestamp || undefined === input.serverTimestamp || input.serverTimestamp instanceof Date || "object" === typeof input.serverTimestamp && null !== input.serverTimestamp && $io6(input.serverTimestamp)) && (undefined === input.serverPicoseconds || "number" === typeof input.serverPicoseconds);
                    const $io8 = input => (undefined === input.dataType || 0 === input.dataType || 1 === input.dataType || 2 === input.dataType || 3 === input.dataType || 4 === input.dataType || 5 === input.dataType || 6 === input.dataType || 7 === input.dataType || 8 === input.dataType || 9 === input.dataType || 10 === input.dataType || 11 === input.dataType || 12 === input.dataType || 13 === input.dataType || 14 === input.dataType || 15 === input.dataType || 16 === input.dataType || 17 === input.dataType || 18 === input.dataType || 19 === input.dataType || 20 === input.dataType || 21 === input.dataType || 22 === input.dataType || 23 === input.dataType || 24 === input.dataType || 25 === input.dataType || "string" === typeof input.dataType) && (undefined === input.arrayType || 0 === input.arrayType || 1 === input.arrayType || 2 === input.arrayType || "string" === typeof input.arrayType) && true && (null === input.dimensions || undefined === input.dimensions || Array.isArray(input.dimensions) && input.dimensions.every(elem => "number" === typeof elem));
                    const $iu0 = input => (() => {
                        if ($io3(input))
                            return $io3(input);
                        if ($io7(input))
                            return $io7(input);
                        return false;
                    })();
                    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("WriteValueOptions");
                }
                break;
            }
            case "/session/browse": {
                if ((input => {
                    const $io0 = input => null !== input.node && undefined !== input.node && ("string" === typeof input.node || "object" === typeof input.node && null !== input.node && false === Array.isArray(input.node) && $io1(input.node)) && "boolean" === typeof input.browseNext;
                    const $io1 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io2(input.nodeId)) && (undefined === input.browseDirection || 0 === input.browseDirection || 1 === input.browseDirection || 2 === input.browseDirection || 3 === input.browseDirection) && (null === input.referenceTypeId || undefined === input.referenceTypeId || "string" === typeof input.referenceTypeId || "number" === typeof input.referenceTypeId || "object" === typeof input.referenceTypeId && null !== input.referenceTypeId && $io2(input.referenceTypeId)) && (undefined === input.includeSubtypes || "boolean" === typeof input.includeSubtypes) && (undefined === input.nodeClassMask || "number" === typeof input.nodeClassMask) && (undefined === input.resultMask || "number" === typeof input.resultMask);
                    const $io2 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("{ nodes: BrowseDescriptionLike, browseNext: boolean }");
                }
                break;
            }
            case "/session/history": {
                if ((input => {
                    const $io0 = input => "object" === typeof input.requestHeader && null !== input.requestHeader && $io1(input.requestHeader) && (null === input.historyReadDetails || "object" === typeof input.historyReadDetails && null !== input.historyReadDetails && false === Array.isArray(input.historyReadDetails) && $io4(input.historyReadDetails)) && (0 === input.timestampsToReturn || 1 === input.timestampsToReturn || 2 === input.timestampsToReturn || 3 === input.timestampsToReturn || 4 === input.timestampsToReturn) && "boolean" === typeof input.releaseContinuationPoints && (null === input.nodesToRead || Array.isArray(input.nodesToRead) && input.nodesToRead.every(elem => "object" === typeof elem && null !== elem && $io5(elem)));
                    const $io1 = input => "object" === typeof input.authenticationToken && null !== input.authenticationToken && $io2(input.authenticationToken) && (undefined !== input.timestamp && (null === input.timestamp || input.timestamp instanceof Date || "object" === typeof input.timestamp && null !== input.timestamp && $io3(input.timestamp))) && "number" === typeof input.requestHandle && "number" === typeof input.returnDiagnostics && (null === input.auditEntryId || "string" === typeof input.auditEntryId) && "number" === typeof input.timeoutHint && (null === input.additionalHeader || "object" === typeof input.additionalHeader && null !== input.additionalHeader && false === Array.isArray(input.additionalHeader) && $io4(input.additionalHeader));
                    const $io2 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io3 = input => "number" === typeof input.picoseconds && (Array.isArray(input.high_low) && (input.high_low.length === 2 && "number" === typeof input.high_low[0] && "number" === typeof input.high_low[1]));
                    const $io4 = input => true;
                    const $io5 = input => "object" === typeof input.nodeId && null !== input.nodeId && $io2(input.nodeId) && ("object" === typeof input.indexRange && null !== input.indexRange && $io6(input.indexRange)) && ("object" === typeof input.dataEncoding && null !== input.dataEncoding && $io7(input.dataEncoding)) && input.continuationPoint instanceof Buffer;
                    const $io6 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io7 = input => "number" === typeof input.namespaceIndex && (null === input.name || "string" === typeof input.name);
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("HistoryReadRequest");
                }
                break;
            }
            case "/session/history/value": {
                if ((input => {
                    const $io0 = input => null !== input.nodeToRead && undefined !== input.nodeToRead && ("string" === typeof input.nodeToRead || "number" === typeof input.nodeToRead || "object" === typeof input.nodeToRead && null !== input.nodeToRead && $iu0(input.nodeToRead)) && (undefined !== input.start && (null === input.start || input.start instanceof Date || "object" === typeof input.start && null !== input.start && $io5(input.start))) && (undefined !== input.end && (null === input.end || input.end instanceof Date || "object" === typeof input.end && null !== input.end && $io5(input.end))) && (undefined === input.options || "object" === typeof input.options && null !== input.options && false === Array.isArray(input.options) && $io6(input.options));
                    const $io1 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io2 = input => null !== input.nodeId && undefined !== input.nodeId && ("string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io1(input.nodeId)) && (undefined === input.indexRange || "object" === typeof input.indexRange && null !== input.indexRange && $io3(input.indexRange)) && (null === input.dataEncoding || undefined === input.dataEncoding || "string" === typeof input.dataEncoding || "object" === typeof input.dataEncoding && null !== input.dataEncoding && false === Array.isArray(input.dataEncoding) && $io4(input.dataEncoding)) && (undefined === input.continuationPoint || input.continuationPoint instanceof Buffer);
                    const $io3 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io4 = input => (undefined === input.namespaceIndex || "number" === typeof input.namespaceIndex) && (null === input.name || undefined === input.name || "string" === typeof input.name);
                    const $io5 = input => "number" === typeof input.picoseconds && (Array.isArray(input.high_low) && (input.high_low.length === 2 && "number" === typeof input.high_low[0] && "number" === typeof input.high_low[1]));
                    const $io6 = input => (undefined === input.numValuesPerNode || "number" === typeof input.numValuesPerNode) && (undefined === input.returnBounds || "boolean" === typeof input.returnBounds) && (undefined === input.isReadModified || "boolean" === typeof input.isReadModified) && (undefined === input.timestampsToReturn || 0 === input.timestampsToReturn || 1 === input.timestampsToReturn || 2 === input.timestampsToReturn || 3 === input.timestampsToReturn || 4 === input.timestampsToReturn);
                    const $iu0 = input => (() => {
                        if (undefined !== input.identifierType)
                            return $io1(input);
                        if (undefined !== input.nodeId)
                            return $io2(input);
                        return false;
                    })();
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("HistoryValueParam");
                }
                break;
            }
            default:
                await next();
        }
    }
    AgentMiddleware.sessionValidator = sessionValidator;
    async function subscriptValidator(ctx, next) {
        switch (ctx.request.path) {
            case "/subscript/init": {
                if ((input => {
                    const $io0 = input => (undefined === input.requestedPublishingInterval || "number" === typeof input.requestedPublishingInterval) && (undefined === input.requestedLifetimeCount || "number" === typeof input.requestedLifetimeCount) && (undefined === input.requestedMaxKeepAliveCount || "number" === typeof input.requestedMaxKeepAliveCount) && (undefined === input.maxNotificationsPerPublish || "number" === typeof input.maxNotificationsPerPublish) && (undefined === input.publishingEnabled || "boolean" === typeof input.publishingEnabled) && (undefined === input.priority || "number" === typeof input.priority);
                    return undefined === input || "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.installedSub));
                    await next();
                }
                else {
                    throw validateError("ClientSubscriptionOptions");
                }
                break;
            }
            case "/subscript/modify": {
                if ((input => {
                    const $io0 = input => (undefined === input.requestedPublishingInterval || "number" === typeof input.requestedPublishingInterval) && (undefined === input.requestedLifetimeCount || "number" === typeof input.requestedLifetimeCount) && (undefined === input.requestedMaxKeepAliveCount || "number" === typeof input.requestedMaxKeepAliveCount) && (undefined === input.maxNotificationsPerPublish || "number" === typeof input.maxNotificationsPerPublish) && (undefined === input.priority || "number" === typeof input.priority);
                    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.modifySubscription, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("ModifySubscriptionOptions");
                }
                break;
            }
            case "/subscript/item/group": {
                if ((input => {
                    const $io0 = input => Array.isArray(input.itemsToMonitor) && input.itemsToMonitor.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io1(elem)) && (Array.isArray(input.displayNames) && input.displayNames.every(elem => "string" === typeof elem)) && (undefined === input.timeStampToReturn || 0 === input.timeStampToReturn || 1 === input.timeStampToReturn || 2 === input.timeStampToReturn || 3 === input.timeStampToReturn || 4 === input.timeStampToReturn) && (undefined === input.parameters || "object" === typeof input.parameters && null !== input.parameters && false === Array.isArray(input.parameters) && $io5(input.parameters));
                    const $io1 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io2(input.nodeId)) && (undefined === input.attributeId || "number" === typeof input.attributeId) && (undefined === input.indexRange || "object" === typeof input.indexRange && null !== input.indexRange && $io3(input.indexRange)) && (null === input.dataEncoding || undefined === input.dataEncoding || "string" === typeof input.dataEncoding || "object" === typeof input.dataEncoding && null !== input.dataEncoding && false === Array.isArray(input.dataEncoding) && $io4(input.dataEncoding));
                    const $io2 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io3 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io4 = input => (undefined === input.namespaceIndex || "number" === typeof input.namespaceIndex) && (null === input.name || undefined === input.name || "string" === typeof input.name);
                    const $io5 = input => (undefined === input.clientHandle || "number" === typeof input.clientHandle) && (undefined === input.samplingInterval || "number" === typeof input.samplingInterval) && (null === input.filter || undefined === input.filter || "object" === typeof input.filter && null !== input.filter && false === Array.isArray(input.filter) && $io6(input.filter)) && (undefined === input.queueSize || "number" === typeof input.queueSize) && (undefined === input.discardOldest || "boolean" === typeof input.discardOldest);
                    const $io6 = input => true;
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.monitoredItemInit, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("SubscriptGroupParam");
                }
                break;
            }
            case "/subscript/item/single": {
                if ((input => {
                    const $io0 = input => "object" === typeof input.itemToMonitor && null !== input.itemToMonitor && false === Array.isArray(input.itemToMonitor) && $io1(input.itemToMonitor) && "string" === typeof input.displayName && (undefined === input.timeStampToReturn || 0 === input.timeStampToReturn || 1 === input.timeStampToReturn || 2 === input.timeStampToReturn || 3 === input.timeStampToReturn || 4 === input.timeStampToReturn) && (undefined === input.parameters || "object" === typeof input.parameters && null !== input.parameters && false === Array.isArray(input.parameters) && $io5(input.parameters));
                    const $io1 = input => (null === input.nodeId || undefined === input.nodeId || "string" === typeof input.nodeId || "number" === typeof input.nodeId || "object" === typeof input.nodeId && null !== input.nodeId && $io2(input.nodeId)) && (undefined === input.attributeId || "number" === typeof input.attributeId) && (undefined === input.indexRange || "object" === typeof input.indexRange && null !== input.indexRange && $io3(input.indexRange)) && (null === input.dataEncoding || undefined === input.dataEncoding || "string" === typeof input.dataEncoding || "object" === typeof input.dataEncoding && null !== input.dataEncoding && false === Array.isArray(input.dataEncoding) && $io4(input.dataEncoding));
                    const $io2 = input => (1 === input.identifierType || 2 === input.identifierType || 3 === input.identifierType || 4 === input.identifierType) && (null !== input.value && undefined !== input.value && ("string" === typeof input.value || "number" === typeof input.value || input.value instanceof Buffer)) && "number" === typeof input.namespace;
                    const $io3 = input => (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "number" === typeof input.value || Array.isArray(input.value) && (() => {
                        if (0 === input.value.length)
                            return true;
                        const tupleList = [[top => "number" === typeof top, top => top.every(elem => "number" === typeof elem)], [top => Array.isArray(top) && top.every(elem => "number" === typeof elem), top => top.every(elem => Array.isArray(elem) && elem.every(elem => "number" === typeof elem))]];
                        const front = input.value[0];
                        const filtered = tupleList.filter(tuple => true === tuple[0](front));
                        if (1 === filtered.length)
                            return filtered[0][1](input.value);
                        const array = input.value;
                        if (1 < filtered.length)
                            for (const tuple of filtered)
                                if (array.every(value => true === tuple[0](value)))
                                    return tuple[1](array);
                        return false;
                    })()));
                    const $io4 = input => (undefined === input.namespaceIndex || "number" === typeof input.namespaceIndex) && (null === input.name || undefined === input.name || "string" === typeof input.name);
                    const $io5 = input => (undefined === input.clientHandle || "number" === typeof input.clientHandle) && (undefined === input.samplingInterval || "number" === typeof input.samplingInterval) && (null === input.filter || undefined === input.filter || "object" === typeof input.filter && null !== input.filter && false === Array.isArray(input.filter) && $io6(input.filter)) && (undefined === input.queueSize || "number" === typeof input.queueSize) && (undefined === input.discardOldest || "boolean" === typeof input.discardOldest);
                    const $io6 = input => true;
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.monitoredItemInit, { ...ctx.request.body }));
                    await next();
                }
                else {
                    throw validateError("SubscriptSingleParam");
                }
                break;
            }
            case "/subscript/item/delete": {
                if ((input => {
                    return Array.isArray(input) && input.every(elem => "string" === typeof elem);
                })(ctx.request.body)) {
                    Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.monitoredItemTerminate, {
                        ...ctx.request.body,
                    }));
                    await next();
                }
                else {
                    throw validateError("NodeID[]");
                }
                break;
            }
            case "/subscript/terminate": {
                Log.info(new ClientInfo(UaSources.subscriptService, UaInfos.terminateSub));
                await next();
                break;
            }
            default:
                await next();
        }
    }
    AgentMiddleware.subscriptValidator = subscriptValidator;
    async function certValidator(ctx, next) {
        switch (ctx.request.body) {
            case "/cert/create": {
                if ((input => {
                    const $io0 = input => (undefined === input.outputFile || "string" === typeof input.outputFile) && (null !== input.subject && undefined !== input.subject && ("string" === typeof input.subject || "object" === typeof input.subject && null !== input.subject && false === Array.isArray(input.subject) && $io1(input.subject))) && "string" === typeof input.applicationUri && Array.isArray(input.dns) && input.startDate instanceof Date && "number" === typeof input.validity && (undefined === input.ip || Array.isArray(input.ip) && input.ip.every(elem => "string" === typeof elem)) && (undefined === input.endDate || input.endDate instanceof Date);
                    const $io1 = input => (undefined === input.commonName || "string" === typeof input.commonName) && (undefined === input.organization || "string" === typeof input.organization) && (undefined === input.organizationalUnit || "string" === typeof input.organizationalUnit) && (undefined === input.locality || "string" === typeof input.locality) && (undefined === input.state || "string" === typeof input.state) && (undefined === input.country || "string" === typeof input.country) && (undefined === input.domainComponent || "string" === typeof input.domainComponent);
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    if (CertUtils.validateCertOptions(ctx.request.body)) {
                        Log.info(new ClientInfo(UaSources.paramValidator, UaInfos.certCreated));
                        await next();
                    }
                    else {
                        throw new ClientError(UaSources.paramValidator, UaErrors.errorCertOptions, "country too long");
                    }
                }
                else {
                    throw validateError("CreateSelfSignCertificateParam1");
                }
                break;
            }
            case "/cert/trust_status" || "/cert/trust" || "/cert/reject": {
                if ((input => {
                    return input instanceof Buffer;
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("Buffer");
                }
                break;
            }
            default:
                await next();
        }
    }
    AgentMiddleware.certValidator = certValidator;
    async function dbValidator(ctx, next) {
        switch (ctx.request.body) {
            /**
             * @description 此处绑定了pipe的事件,并且当
             */
            case "/db/init": {
                if ((input => {
                    const $io0 = input => (0 === input.createMode || 1 === input.createMode || 2 === input.createMode || 3 === input.createMode || 4 === input.createMode || 5 === input.createMode || 6 === input.createMode || 7 === input.createMode) && (undefined === input.tableName || "string" === typeof input.tableName) && (undefined === input.fields || "object" === typeof input.fields && null !== input.fields && $io1(input.fields));
                    const $io1 = input => "string" === typeof input.serverF && "string" === typeof input.nodeIdF && "string" === typeof input.displayNameF && "string" === typeof input.statusCodeF && "string" === typeof input.sourceTimestampF && "string" === typeof input.serverTimestampF && "string" === typeof input.valueF && "string" === typeof input.dataTypeF;
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    DbUtils.validateDbName(ctx.request.body["tableName"]);
                    await next();
                }
                else {
                    throw validateError("{createMode:TableCreateModes, tableName?:string, fields:IFieldNames}");
                }
                break;
            }
            case "/db/insert": {
                if ((input => {
                    const $io0 = input => "string" === typeof input.server && "string" === typeof input.nodeId && "string" === typeof input.displayName && "string" === typeof input.value && "string" === typeof input.dataType && "string" === typeof input.sourceTimestamp && "string" === typeof input.serverTimestamp && "string" === typeof input.statusCode;
                    return "object" === typeof input && null !== input && $io0(input);
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("IDbData");
                }
                break;
            }
            case "/db/insert_many": {
                if ((input => {
                    const $io0 = input => "string" === typeof input.server && "string" === typeof input.nodeId && "string" === typeof input.displayName && "string" === typeof input.value && "string" === typeof input.dataType && "string" === typeof input.sourceTimestamp && "string" === typeof input.serverTimestamp && "string" === typeof input.statusCode;
                    return Array.isArray(input) && input.every(elem => "object" === typeof elem && null !== elem && $io0(elem));
                })(ctx.request.body)) {
                    await next();
                }
                else {
                    throw validateError("IDbData[]");
                }
                break;
            }
            case "/db/create_table": {
                if ((input => {
                    const $io0 = input => (undefined === input.tableName || "string" === typeof input.tableName) && (undefined === input.fieldNames || "object" === typeof input.fieldNames && null !== input.fieldNames && $io1(input.fieldNames));
                    const $io1 = input => "string" === typeof input.serverF && "string" === typeof input.nodeIdF && "string" === typeof input.displayNameF && "string" === typeof input.statusCodeF && "string" === typeof input.sourceTimestampF && "string" === typeof input.serverTimestampF && "string" === typeof input.valueF && "string" === typeof input.dataTypeF;
                    return undefined === input || "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                })(ctx.request.body)) {
                    if (ctx.request.body) {
                        if ("tableName" in ctx.request.body) {
                            if (!DbUtils.validateDbName(ctx.request.body["tableName"])) {
                                throw new ClientError(UaSources.paramValidator, UaErrors.unFormatDbName, "It cannot start with a number. The name can only contain: " +
                                    "Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters");
                            }
                        }
                        if ("fieldNames" in ctx.request.body && ctx.request.body["fieldNames"]) {
                            let key;
                            for (key in ctx.request.body["fieldNames"]) {
                                if (!DbUtils.validateDbName(ctx.request.body["fieldNames"][key])) {
                                    throw new ClientError(UaSources.paramValidator, UaErrors.unFormatDbName, "It cannot start with a number. The name can only contain: " +
                                        "Chinese characters, numbers, lowercase letters, underscores, and the length is within 2-15 characters");
                                }
                            }
                        }
                    }
                    await next();
                }
                else {
                    throw validateError("{ tableName?: string, fieldNames?: IFieldNames } | undefined");
                }
                break;
            }
            default:
                await next();
        }
    }
    AgentMiddleware.dbValidator = dbValidator;
    function validateError(paramType) {
        return new ClientError(UaSources.paramValidator, UaErrors.errorValidateParam, `Supposed to be ${paramType}`);
    }
})(AgentMiddleware || (AgentMiddleware = {}));
