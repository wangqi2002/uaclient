import { ServerMessage, ServerStatusCodes, UaErrors, UaSources } from '../../common/ua.enums';
import { ResponseModel } from '../models/response.model';
import { ClientError, ClientWarn, Log } from '../../../../platform/base/log/log';
export var ErrorMiddleware;
(function (ErrorMiddleware) {
    async function handleError(ctx, next) {
        try {
            await next();
        }
        catch (e) {
            if (e instanceof ClientWarn) {
                Log.warn(e);
                ctx.body = new ResponseModel(e, ServerMessage.warn, ServerStatusCodes.success);
            }
            else if (e instanceof ClientError) {
                Log.error(e);
                ctx.body = new ResponseModel(e, ServerMessage.error, ServerStatusCodes.internalError);
            }
            else {
                let err = new ClientError(UaSources.server, UaErrors.internalError, e.message);
                Log.error(err);
                ctx.body = new ResponseModel(err, ServerMessage.error, ServerStatusCodes.internalError);
            }
        }
    }
    ErrorMiddleware.handleError = handleError;
})(ErrorMiddleware || (ErrorMiddleware = {}));
