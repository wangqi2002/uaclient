"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ErrorHandler = void 0;

class ErrorHandler {
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

exports.ErrorHandler = ErrorHandler;
