import { DataModel } from '../models/data.model'
import { TableCreateModes } from '../../common/enums'

export class Message {
    public static insertOne(data: DataModel): boolean {
        return true
    }

    public static insertMany(data: DataModel[]): boolean {
        return true
    }

    public static createTable(mode: TableCreateModes, tableName?: string, fieldNames?: string[]): boolean {
        return true
    }
}