"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
const ua_enums_1 = require("../../common/ua.enums");
/**
 * @description 用来统一response的格式,默认成功
 */
class ResponseModel {
    /**
     * @description message和code默认为success和200
     * @param data
     * @param message
     * @param code
     */
    constructor(data, message = ua_enums_1.ServerMessage.success, code = ua_enums_1.ServerStatusCodes.success) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
exports.ResponseModel = ResponseModel;
