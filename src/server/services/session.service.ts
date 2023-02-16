import {
    BrowseDescriptionLike,
    BrowseDescriptionOptions,
    ClientSession,
    DataValue,
    DateTime,
    HistoryReadRequest,
    makeBrowsePath,
    makeResultMask,
    NodeIdLike,
    ReadValueIdOptions,
    ReferenceDescription,
    UserIdentityInfo,
    UserTokenType,
    WriteValueOptions
} from 'node-opcua'
import {Log} from '../../common/log'
import {Errors, Infos, Sources, Warns} from '../../common/enums'
import {ClientService} from './client.service'
import {is} from 'typia'
import {ClientError, ClientInfo, ClientWarn} from '../models/infos.model'

export module SessionService {
    export let session!: ClientSession
    export let userIdentity: UserIdentityInfo = {type: UserTokenType.Anonymous}

    export async function createSession(userInfo?: UserIdentityInfo) {
        try {
            if (userInfo) userIdentity = userInfo
            console.log(ClientService.currentServer)
            session = await ClientService.client.createSession(userIdentity)
            if (ClientService.client.endpoint) {
                ClientService.currentServer = ClientService.client.endpoint.server.applicationName.text
                    ? ClientService.client.endpoint.server.applicationName.text.toString()
                    : 'Default Server'
            }
            console.log(ClientService.currentServer)
            Log.info(new ClientInfo(Sources.sessionService, Infos.sessionCreated))
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorCreateSession, e.message)
        }
    }

    export async function changeIdentity(userInfo: UserIdentityInfo) {
        try {
            await session.changeUser(userInfo)
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorChangeIdentity, e.message)
        }
    }

    export async function closeSession(deleteSubscription?: boolean) {
        if (session) {
            try {
                await session.close(deleteSubscription)
            } catch (e: any) {
                throw new ClientError(Sources.subscription, Errors.errorClosingSession, e.message)
            }
        }
    }

    // export function addSubscription(subOptions?: Object) {
    //     try {
    //         uaSubscriptions = new UaSubscription(this.session, subOptions)
    //     } catch (e: any) {
    //         throw new ClientError(Sources.clientSession, Errors.errorCreatingSub, {Error: e.message})
    //     }
    // }

    export async function readByNodeId(nodeToRead: ReadValueIdOptions, maxAge?: number): Promise<DataValue> {
        try {
            if (maxAge) return await session.read(nodeToRead, maxAge)
            return await session.read(nodeToRead)
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorReading, e.message)
        }
    }

    export async function browseRootFolder(): Promise<ReferenceDescription[]> {
        try {
            let browseResult = await session.browse('RootFolder')
            let resultList: ReferenceDescription[] = []
            if (browseResult.references) {
                resultList = browseResult.references
            } else {
                Log.warn(new ClientWarn(Sources.sessionService, Warns.emptyRootFolder))
            }
            return resultList
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorBrowsing, e.message)
        }
    }

    export async function getNodeIdByBrowseName(relativePathBNF: string, rootNode: string = 'RootFolder') {
        try {
            let browsePath = makeBrowsePath(rootNode, relativePathBNF)
            let result = await session.translateBrowsePath(browsePath)
            Log.info(new ClientInfo(Sources.sessionService, Infos.getIdByName, {Path: browsePath}))
            return result
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorGetNodeByName, e.message)
        }
    }

    export async function writeToServer(nodesToWrite: WriteValueOptions[]) {
        try {
            return await session.write(nodesToWrite)
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorWriting, e.message)
        }
    }

    /**
     * @description
     * 返回browseResult,包含references和statusCode和continuation point,
     * 如果使用browseNext,那么应当确定该node具有continuation point
     * @example
     * SessionService.browse({nodeId: 'i=2253',resultMask:rs},true)
     * @param nodeToBrowse
     * @param browseNext
     */
    export async function browse(nodeToBrowse: BrowseDescriptionLike, browseNext?: boolean) {
        try {
            if (is<BrowseDescriptionOptions>(nodeToBrowse) && 'resultMask' in nodeToBrowse) {
                nodeToBrowse.resultMask = makeResultMask(
                    'ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition')
            }
            let result = await session.browse(nodeToBrowse)
            if (browseNext && result.continuationPoint) {
                return await session.browseNext(result.continuationPoint, true)
            }
            return result
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorBrowsing, e.message)
        }
    }

    export function serverCert() {
        return session.serverCertificate.toString('utf8')
    }

    export async function historyRead(request: HistoryReadRequest) {
        return await session.historyRead(request)
    }

    export async function readHistoryValue(nodesToRead: NodeIdLike, start: DateTime, end: DateTime) {
        await session.readHistoryValue(nodesToRead, start, end)
    }
}