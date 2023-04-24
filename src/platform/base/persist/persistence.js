import { Utils } from './../utils/utils.js';
import { Sequelize } from 'sequelize';
import { ClientStore, ConfigNames } from '../../../client/store/store.js';
export class Persistence {
    static sequelize;
    static currentModel;
    constructor(options, storage) {
        try {
            // let options = ClientConfig.get(ConfigNames.persistence)
            if (options) {
                Persistence.sequelize = new Sequelize(options);
            }
            else {
                if (storage) {
                    Persistence.sequelize = new Sequelize({
                        dialect: 'sqlite',
                        storage: storage,
                        logging: false,
                    });
                }
            }
            // Persistence.initDataModel(tableName, attributes)
        }
        catch (e) {
            throw e;
        }
    }
    static async insert(record) {
        try {
            await Persistence.currentModel.create({ ...record });
        }
        catch (e) {
            throw e;
        }
    }
    static async insertMany(records) {
        try {
            await Persistence.currentModel.bulkCreate(records);
        }
        catch (e) {
            throw e;
        }
    }
    static async read(options) {
        return Persistence.currentModel.findAll(options);
    }
    static async configureDb(tableName, attributes, conf) {
        try {
            if (conf) {
                Persistence.sequelize = new Sequelize(conf);
                ClientStore.set('config', ConfigNames.persistence, conf);
            }
            if (tableName && attributes) {
                Persistence.initDataModel(attributes, tableName);
            }
        }
        catch (e) {
            throw e;
        }
    }
    static async initDataModel(attributes, tableName) {
        try {
            tableName = tableName ? tableName : Utils.formatDateYMW(new Date());
            await Persistence.sequelize.authenticate();
            Persistence.currentModel = await Persistence.sequelize.define(tableName, attributes, { timestamps: false });
            await Persistence.currentModel.sync();
        }
        catch (e) {
            throw e;
        }
    }
}
