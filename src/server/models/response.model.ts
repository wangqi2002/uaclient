import {ServerStatusCodes} from '../../common/enums'

/**
 * @description 用来统一response的格式
 */
export class ResponseModel {
    code: ServerStatusCodes
    message: string
    data?: any

    constructor(message: string, data?: any, code?: number) {
        this.code = code
            ? code
            : 200
        this.message = message
        this.data = data
    }
}