import {EventEmitter} from 'events'
import {AttributeIds, DataValue, MessageSecurityMode, SecurityPolicy} from 'node-opcua'
import {ClientService} from './client.service'
import {SessionService} from './session.service'
import {SubscriptService} from './subscript.service'

export module DbService{
    let events=new EventEmitter()
    let connection=''

    export async function insert(){
    }

    export async function emit(){

    }

    export async function createTable(){

    }
}

async function a() {
    ClientService.createClient({
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 1,
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
    })
    await ClientService.connectToServer('opc.tcp://WIN-4D29EPFU0V6:53530/OPCUA/SimulationServer')
    await SessionService.createSession()
    await SubscriptService.createSubscription()
    await SubscriptService.addMonitoredItem({ nodeId: 'ns=3;i=1003', attributeId: AttributeIds.Value })
}
a()

// DataValue {
//     statusCode: ConstantStatusCode {
//         _value: 0,
//             _description: 'The operation succeeded.',
//             _name: 'Good'
//     },
//     sourceTimestamp: 2023-01-14T08:22:19.000Z {
//         high_low: [ 31008753, 1365258112 ],
//             picoseconds: 0
//     },
//     sourcePicoseconds: 0,
//     serverTimestamp: 2023-01-14T08:22:19.001Z {
//     high_low: [ 31008753, 1365268112 ],
//             picoseconds: 0
//     },
//     serverPicoseconds: 0,
//     value: Variant { dataType: 11, arrayType: 0, value: -0.4, dimensions: null }
// }


