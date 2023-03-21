import {ModelAttributes, ModelCtor, Sequelize} from 'sequelize'
import path from 'path'

export module Persistence {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', '..', '/databases/data.db'),
        logging: false
    })
    export let currentModel: ModelCtor<any>

    export async function init(tableName: string, attributes: ModelAttributes) {
        try {
            await sequelize.authenticate()
            currentModel = await sequelize.define(tableName, attributes, {timestamps: false})
            await Persistence.currentModel.sync()
        } catch (e: any) {
            throw e
        }
    }

    export async function insert(record: any) {
        try {
            await currentModel.create({...record})
        } catch (e: any) {
            throw e
        }
    }

    export async function insertMany(records: any[]) {
        try {
            await currentModel.bulkCreate(records)
        } catch (e: any) {
            throw e
        }
    }

    //todo crud,备份/配置

}
