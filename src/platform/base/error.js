"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
var ErrorHandler;
(function (ErrorHandler) {
    let errorHandler;
    let listeners = [];
    function addListener(listener) {
        listeners.push(listener);
    }
    ErrorHandler.addListener = addListener;
    function setUnexpectedErrorHandler(newHandler) {
        errorHandler = newHandler;
    }
    ErrorHandler.setUnexpectedErrorHandler = setUnexpectedErrorHandler;
    process.on("uncaughtException", (error) => {
        errorHandler(error);
    });
})(ErrorHandler = exports.ErrorHandler || (exports.ErrorHandler = {}));
