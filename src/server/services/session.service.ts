import {
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
    export let userIdentity: UserIdentityInfo

    export async function createSession(userInfo: UserIdentityInfo = {type: UserTokenType.Anonymous}) {
        userIdentity = userInfo
        session = await ClientService.client.createSession(userIdentity)
        Log.info(new ClientInfo(Sources.clientService, Infos.sessionCreated))
    }

    export async function changeIdentity(userInfo: UserIdentityInfo = {type: UserTokenType.Anonymous}) {
        await session.changeUser(userInfo)
    }

    export async function closeSession(deleteSubscription?: boolean) {
        if (session) {
            try {
                await session.close(deleteSubscription)
            } catch (e: any) {
                throw new ClientError(Sources.subscription, Errors.errorClosingSession, {Error: e.message})
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
        return await session.read(nodesToRead, maxAge)
    }

    export async function browseRootFolder(): Promise<ReferenceDescription[]> {
        let browseResult = await session.browse('RootFolder')
        let resultList: ReferenceDescription[] = []
        if (browseResult.references) {
            resultList = browseResult.references
        } else {
            Log.warn(new ClientWarn(Sources.clientSession, Warns.emptyRootFolder))
        }
        return resultList
    }

    export async function getNodeIdByBrowseName(relativePathBNF: string, rootNode: string = 'RootFolder'): Promise<string> {
        let browsePath = makeBrowsePath(rootNode, relativePathBNF)
        let result = await session.translateBrowsePath(browsePath)
        Log.info(new ClientInfo(Sources.clientSession, Infos.getIdByName, {Path: browsePath}))
        if (result.targets) return result.targets[0].targetId.toString()
        return ''
    }

    export async function writeToServer(nodesToWrite: WriteValueOptions[]): Promise<StatusCode[]> {
        let codes = await session.write(nodesToWrite)
        if (!codes) throw new ClientError(Sources.clientSession, Errors.errorWriting)
        return codes
    }
}