import {ServerStatusCodes} from '../../common/enums'

/**
 * @description 用来统一response的格式
 */
export class ResponseModel {
    code:ServerStatusCodes
    message:string
    data:any

    constructor(code: number, message: string, data: any) {
        this.code = code
        this.message = message
        this.data = data
    }
}