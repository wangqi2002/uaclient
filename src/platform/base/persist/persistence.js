"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persistence = void 0;
const utils_1 = require("./../utils/utils");
const sequelize_1 = require("sequelize");
const store_1 = require("../../../client/store/store");
class Persistence {
    constructor(options, storage) {
        try {
            // let options = ClientConfig.get(ConfigNames.persistence)
            if (options) {
                Persistence.sequelize = new sequelize_1.Sequelize(options);
            }
            else {
                if (storage) {
                    Persistence.sequelize = new sequelize_1.Sequelize({
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
    static insert(record) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Persistence.currentModel.create(Object.assign({}, record));
            }
            catch (e) {
                throw e;
            }
        });
    }
    static insertMany(records) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Persistence.currentModel.bulkCreate(records);
            }
            catch (e) {
                throw e;
            }
        });
    }
    static read(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Persistence.currentModel.findAll(options);
        });
    }
    static configureDb(tableName, attributes, conf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (conf) {
                    Persistence.sequelize = new sequelize_1.Sequelize(conf);
                    store_1.ClientStore.set('config', store_1.ConfigNames.persistence, conf);
                }
                if (tableName && attributes) {
                    Persistence.initDataModel(attributes, tableName);
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    static initDataModel(attributes, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                tableName = tableName ? tableName : utils_1.Utils.formatDateYMW(new Date());
                yield Persistence.sequelize.authenticate();
                Persistence.currentModel = yield Persistence.sequelize.define(tableName, attributes, { timestamps: false });
                yield Persistence.currentModel.sync();
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.Persistence = Persistence;
