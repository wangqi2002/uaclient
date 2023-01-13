/**
 * @description 接受server传过来的数据并存入数据库而定义的model
 * @author hhj
 */
export class MessageModel {
    private _server: string
    private _nodeId: string
    private _displayName: string
    private _value: string
    private _dataType: string
    private _sourceTimeStamp: string
    private _serverTimeStamp: string
    private _statusCode: string

    constructor(server: string, nodeId: string, displayName: string, value: string, dataType: string,
                sourceTimeStamp: string, serverTimeStamp: string, statusCode: string) {
        this._server = server
        this._nodeId = nodeId
        this._displayName = displayName
        this._value = value
        this._dataType = dataType
        this._sourceTimeStamp = sourceTimeStamp
        this._serverTimeStamp = serverTimeStamp
        this._statusCode = statusCode
    }

    get server(): string {
        return this._server
    }

    set server(value: string) {
        this._server = value
    }

    get nodeId(): string {
        return this._nodeId
    }

    set nodeId(value: string) {
        this._nodeId = value
    }

    get displayName(): string {
        return this._displayName
    }

    set displayName(value: string) {
        this._displayName = value
    }

    get value(): string {
        return this._value
    }

    set value(value: string) {
        this._value = value
    }

    get dataType(): string {
        return this._dataType
    }

    set dataType(value: string) {
        this._dataType = value
    }

    get sourceTimeStamp(): string {
        return this._sourceTimeStamp
    }

    set sourceTimeStamp(value: string) {
        this._sourceTimeStamp = value
    }

    get serverTimeStamp(): string {
        return this._serverTimeStamp
    }

    set serverTimeStamp(value: string) {
        this._serverTimeStamp = value
    }

    get statusCode(): string {
        return this._statusCode
    }

    set statusCode(value: string) {
        this._statusCode = value
    }
}