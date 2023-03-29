export module ErrorHandler {
    export interface ErrorListenerCallback {
        (error: any): void
    }
    export let errorHandler: (error: any) => void
    export let listeners: ErrorListenerCallback[] = []

    export function addListener(listener: ErrorListenerCallback) {
        listeners.push(listener)
    }
    export function setUnexpectedErrorHandler(newHandler: (e: any) => void) {
        errorHandler = newHandler
        process.on("uncaughtException", (error) => {
            errorHandler(error)
        })
    }
}
