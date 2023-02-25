import {MessageSecurityMode, SecurityPolicy} from 'node-opcua'
import {DateFormatter} from '../server/utils/util'

const dotenv = require('dotenv')
let Path = require('path')
export module Config {
    dotenv.config({
        path: Path.join(__dirname, "..", "..", ".env").toString()
    })

    export let port = process.env.APP_PORT
        ? process.env.APP_PORT
        : 3030

    export let mqLength = process.env.MQ_LENGTH
        ? process.env.MQ_LENGTH
        : 200

    export let dbPath = Path.join(__dirname, "..", "..", process.env.DB_PATH)
        ? Path.join(__dirname, "..", "..", process.env.DB_PATH).toString()
        : Path.join(__dirname, "..", '..', "/db/data.db").toString()
    export let defaultTable = DateFormatter.formatDateYMW(new Date())
    export let defaultFieldNames = {
        serverF: 'Server',
        nodeIdF: 'NodeId',
        displayNameF: 'DisplayName',
        valueF: 'Value',
        dataTypeF: 'DataType',
        sourceTimestampF: 'SourceTimestamp',
        serverTimestampF: 'ServerTimestamp',
        statusCodeF: 'StatusCode',
    }

    export let defaultClient = {
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 10,
        },
        keepSessionAlive: true,
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
        requestedSessionTimeout: 3600,
    }

    export let defaultSubscript = {
        requestedLifetimeCount: 60,
        requestedPublishingInterval: 100,
        requestedMaxKeepAliveCount: 10,
        publishingEnabled: true,
        maxNotificationsPerPublish: 100,
        priority: 1,
    }


}