export namespace rendererEvents {
    export enum mainEvents {
        minimize = "main:mini",
        maximize = "main:max",
        close = "main:close",
        quit = "main:quit",
    }

    export enum extensionEvents {
        install = "extension:install",
        uninstall = "extension:uninstall",
    }

    export enum workspaceEvents {
        create = "workspace:create",
    }

    export enum persistEvents {
        init = "persist:init",
    }

    export enum viewEvents {
        closeAll = "view:closeAll",
    }

    export enum logEvents {
        info = "log:info",
        error = "log:error",
        warn = "log:warn",
    }
}

export namespace MainEvents {
    export enum logEmitEvents {
        error = "log:emit.error",
        info = "log:emit.info",
        warn = "log:emit.warn",
    }
}
