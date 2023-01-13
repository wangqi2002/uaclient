import { MessageModel } from '../models/message.model'
import { TableCreateModes } from '../../common/enums'

export class Message {
    public static insertOne(data: MessageModel): boolean {
        return true
    }

    public static insertMany(data: MessageModel[]): boolean {
        return true
    }

    public static createTable(mode: TableCreateModes, tableName?: string, fieldNames?: string[]): boolean {
        return true
    }
}