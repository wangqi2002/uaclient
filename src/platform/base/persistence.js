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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persistence = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
var Persistence;
(function (Persistence) {
    const sequelize = new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: path_1.default.join(__dirname, '..', '..', '/databases/data.db'),
        logging: false
    });
    function init(tableName, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sequelize.authenticate();
                Persistence.currentModel = yield sequelize.define(tableName, attributes, { timestamps: false });
                yield Persistence.currentModel.sync();
            }
            catch (e) {
                throw e;
            }
        });
    }
    Persistence.init = init;
    function insert(record) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Persistence.currentModel.create(Object.assign({}, record));
            }
            catch (e) {
                throw e;
            }
        });
    }
    Persistence.insert = insert;
    function insertMany(records) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Persistence.currentModel.bulkCreate(records);
            }
            catch (e) {
                throw e;
            }
        });
    }
    Persistence.insertMany = insertMany;
    //todo crud,备份/配置
})(Persistence = exports.Persistence || (exports.Persistence = {}));
