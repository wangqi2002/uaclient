export class ErrorHandler {
    static errorHandler;
    static listeners = [];
    static addListener(listener) {
        ErrorHandler.listeners.push(listener);
    }
    static setUnexpectedErrorHandler(newHandler) {
        ErrorHandler.errorHandler = newHandler;
        process.on('uncaughtException', (error) => {
            ErrorHandler.errorHandler(error);
        });
    }
}
