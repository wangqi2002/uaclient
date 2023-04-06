import {FindOptions, ModelAttributes, ModelCtor, Options, Sequelize} from "sequelize"
import {ClientStore, ConfigNames} from "../../../client/store/store"

export class Persistence {
    private static sequelize: Sequelize
    private static currentModel: ModelCtor<any>

    constructor(storage: string, tableName: string, attributes: ModelAttributes, options?: Options) {
        try {
            // let options = ClientConfig.get(ConfigNames.persistence)
            if (options) {
                Persistence.sequelize = new Sequelize(options)
            } else {
                Persistence.sequelize = new Sequelize({
                    dialect: "sqlite",
                    storage: storage,
                    logging: false,
                })
            }
            Persistence.initDataModel(tableName, attributes)
        } catch (e: any) {
            throw e
        }
    }

    static async insert(record: any) {
        try {
            await Persistence.currentModel.create({ ...record })
        } catch (e: any) {
            throw e
        }
    }

    static async insertMany(records: any[]) {
        try {
            await Persistence.currentModel.bulkCreate(records)
        } catch (e: any) {
            throw e
        }
    }

    static async read(options: FindOptions) {
        return Persistence.currentModel.findAll(options)
    }

    static async configureDb(tableName?: string, attributes?: ModelAttributes, conf?: Options) {
        try {
            if (conf) {
                Persistence.sequelize = new Sequelize(conf)
                ClientStore.set("config", ConfigNames.persistence, conf)
            }
            if (tableName && attributes) {
                Persistence.initDataModel(tableName, attributes)
            }
        } catch (e: any) {
            throw e
        }
    }

    static async initDataModel(tableName: string, attributes: ModelAttributes) {
        try {
            await Persistence.sequelize.authenticate()
            Persistence.currentModel = await Persistence.sequelize.define(tableName, attributes, { timestamps: false })
            await Persistence.currentModel.sync()
        } catch (e: any) {
            throw e
        }
    }

    //todo crud,备份/配置
}
