import {DataTypes, ModelAttributes, ModelCtor, Sequelize} from 'sequelize'
import path from 'path'

export module DataService {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', '..', '/databases/data.db')
    })
    export let currentModel: ModelCtor<any>

    export async function init(tableName: string, attributes: ModelAttributes) {
        try {
            await sequelize.authenticate()
            currentModel = await sequelize.define(tableName, attributes, {timestamps: false})
            await DataService.currentModel.sync()
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

}

async function f() {
    await DataService.init('nice', {name: {type: DataTypes.STRING}})
    DataService.insert({name: 'okok'})
}

// f()
