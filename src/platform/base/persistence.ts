import {FindOptions, ModelAttributes, ModelCtor, Options, Sequelize} from 'sequelize'
import path from 'path'
import {ClientConfig, ConfigNames} from './config'
import {is} from 'typia'

export module Persistence {

    export let sequelize: Sequelize
    export let currentModel: ModelCtor<any>

    export async function init(tableName: string, attributes: ModelAttributes) {
        try {
            let options = ClientConfig.get(ConfigNames.persistence)
            if (is<Options>(options)) {
                sequelize = new Sequelize(options)
            } else {
                sequelize = new Sequelize({
                    dialect: 'sqlite',
                    storage: path.join(__dirname, '..', '..', '/databases/data.db'),
                    logging: false
                })
            }
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

    export async function read(options: FindOptions) {
        return currentModel.findAll(options)
    }

    export function configureDb(conf: Options) {
        try {
            sequelize = new Sequelize(conf)
            ClientConfig.set(ConfigNames.persistence, conf)
        } catch (e: any) {
            throw e
        }
    }

    //todo crud,备份/配置

}
