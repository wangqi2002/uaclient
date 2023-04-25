"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ErrorMiddleware = void 0;
const ua_enums_1 = require("../../common/ua.enums");
const response_model_1 = require("../models/response.model");
const log_1 = require("../../../../platform/base/log/log");
var ErrorMiddleware;
(function (ErrorMiddleware) {
    async function handleError(ctx, next) {
        try {
            await next();
        } catch (e) {
            if (e instanceof log_1.ClientWarn) {
                log_1.Log.warn(e);
                ctx.body = new response_model_1.ResponseModel(e, ua_enums_1.ServerMessage.warn, ua_enums_1.ServerStatusCodes.success);
            } else if (e instanceof log_1.ClientError) {
                log_1.Log.error(e);
                ctx.body = new response_model_1.ResponseModel(e, ua_enums_1.ServerMessage.error, ua_enums_1.ServerStatusCodes.internalError);
            } else {
                let err = new log_1.ClientError(ua_enums_1.UaSources.server, ua_enums_1.UaErrors.internalError, e.message);
                log_1.Log.error(err);
                ctx.body = new response_model_1.ResponseModel(err, ua_enums_1.ServerMessage.error, ua_enums_1.ServerStatusCodes.internalError);
            }
        }
    }

    ErrorMiddleware.handleError = handleError;
})(ErrorMiddleware = exports.ErrorMiddleware || (exports.ErrorMiddleware = {}));
