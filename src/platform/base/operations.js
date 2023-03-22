"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.Operations = void 0;
const log_1 = require("./log");
//todo electron应用安装时执行create pki命令
var Operations;
(function (Operations) {
    /**
     * @description 安装时必须执行此函数==>创建PKI文件夹并使用certificate
     */
    function createPKI() {
        let exec = require('child_process').exec;
        exec('npx node-opcua-pki createPKI');
    }
    Operations.createPKI = createPKI;
    function initByConfig() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }

    Operations.initByConfig = initByConfig;

    function configureLog(conf, filepath, nodeToModify) {
        return __awaiter(this, void 0, void 0, function* () {
            log_1.Log.configureLog(conf, filepath, nodeToModify);
        });
    }

    Operations.configureLog = configureLog;
    // export function configureMQ(pipeName:string,length: number) {
    //     Broker.changeMaxLength(pipeName,length)
    // }
    //
    // export async function close() {
    //     MessageQueue.closeMq().forEach(() => {
    //         DbService.insertMany()
    //     })
    //     await SessionService.closeSession(true)
    //     // DbService.closeDb()
    // }
})(Operations = exports.Operations || (exports.Operations = {}));
