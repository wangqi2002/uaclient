"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
var ErrorHandler;
(function (ErrorHandler) {
    ErrorHandler.listeners = [];
    function addListener(listener) {
        ErrorHandler.listeners.push(listener);
    }
    ErrorHandler.addListener = addListener;
    function setUnexpectedErrorHandler(newHandler) {
        ErrorHandler.errorHandler = newHandler;
        process.on("uncaughtException", (error) => {
            ErrorHandler.errorHandler(error);
        });
    }
    ErrorHandler.setUnexpectedErrorHandler = setUnexpectedErrorHandler;
})(ErrorHandler = exports.ErrorHandler || (exports.ErrorHandler = {}));
