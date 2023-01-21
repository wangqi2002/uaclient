import {
    BrowseDescriptionLike,
    ClientSession,
    DataValue,
    makeBrowsePath,
    ReadValueIdOptions,
    ReferenceDescription,
    StatusCode,
    UserIdentityInfo,
    UserTokenType,
    WriteValueOptions
} from 'node-opcua'
import {Log} from '../../common/log'
import {ClientError, ClientInfo, ClientWarn} from '../../common/informations'
import {Errors, Infos, Sources, Warns} from '../../common/enums'
import {ClientService} from './client.service'

export module SessionService {
    export let session!: ClientSession
    // let uaSubscriptions!: UaSubscription//ClientSubscription[]
    export let userIdentity: UserIdentityInfo = {type: UserTokenType.Anonymous}

    export async function createSession(userInfo?: UserIdentityInfo) {
        try {
            if (userInfo) userIdentity = userInfo
            session = await ClientService.client.createSession(userIdentity)
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

    export async function readByNodeIds(nodesToRead: ReadValueIdOptions[], maxAge?: number): Promise<DataValue[]> {
        try {
            return await session.read(nodesToRead, maxAge)
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

    export async function writeToServer(nodesToWrite: WriteValueOptions[]): Promise<StatusCode[]> {
        try {
            return await session.write(nodesToWrite)
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorWriting, e.message)
        }
    }

    export async function browse(nodeToBrowse: BrowseDescriptionLike) {
        try {
            let result = await session.browse(nodeToBrowse)
            //the problem is the result mask refer to https://github.com/node-opcua/node-opcua/issues/114
            return result.references
        } catch (e: any) {
            throw new ClientError(Sources.sessionService, Errors.errorBrowsing, e.message)
        }
    }
}