"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Persistence = void 0;
const utils_js_1 = require("./../utils/utils.js");
const sequelize_1 = require("sequelize");
const store_js_1 = require("../../../client/store/store.js");

class Persistence {
    static sequelize;
    static currentModel;

    constructor(options, storage) {
        try {
            // let options = ClientConfig.get(ConfigNames.persistence)
            if (options) {
                Persistence.sequelize = new sequelize_1.Sequelize(options);
            } else {
                if (storage) {
                    Persistence.sequelize = new sequelize_1.Sequelize({
                        dialect: 'sqlite',
                        storage: storage,
                        logging: false,
                    });
                }
            }
            // Persistence.initDataModel(tableName, attributes)
        } catch (e) {
            throw e;
        }
    }

    static async insert(record) {
        try {
            await Persistence.currentModel.create({...record});
        } catch (e) {
            throw e;
        }
    }

    static async insertMany(records) {
        try {
            await Persistence.currentModel.bulkCreate(records);
        } catch (e) {
            throw e;
        }
    }

    static async read(options) {
        return Persistence.currentModel.findAll(options);
    }

    static async configureDb(tableName, attributes, conf) {
        try {
            if (conf) {
                Persistence.sequelize = new sequelize_1.Sequelize(conf);
                store_js_1.ClientStore.set('config', store_js_1.ConfigNames.persistence, conf);
            }
            if (tableName && attributes) {
                Persistence.initDataModel(attributes, tableName);
            }
        } catch (e) {
            throw e;
        }
    }

    static async initDataModel(attributes, tableName) {
        try {
            tableName = tableName ? tableName : utils_js_1.Utils.formatDateYMW(new Date());
            await Persistence.sequelize.authenticate();
            Persistence.currentModel = await Persistence.sequelize.define(tableName, attributes, {timestamps: false});
            await Persistence.currentModel.sync();
        } catch (e) {
            throw e;
        }
    }
}

exports.Persistence = Persistence;
