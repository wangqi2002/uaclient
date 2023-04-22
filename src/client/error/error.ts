type ErrorListenerCallback = {
    (error: any): void
}

export class ErrorHandler {
    static errorHandler: (error: any) => void
    static listeners: ErrorListenerCallback[] = []

    static addListener(listener: ErrorListenerCallback) {
        ErrorHandler.listeners.push(listener)
    }
    static setUnexpectedErrorHandler(newHandler: (e: any) => void) {
        ErrorHandler.errorHandler = newHandler
        process.on('uncaughtException', (error) => {
            ErrorHandler.errorHandler(error)
        })
    }
}
