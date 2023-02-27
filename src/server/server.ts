import Koa = require("koa")
import {koaBody} from 'koa-body'
import {Config} from '../config/config.default'
import {ClientRouter} from './routers/client.router'
import {SessionRouter} from './routers/session.router'
import {SubscriptRouter} from './routers/subscript.router'
import {CertificateRouter} from './routers/certificate.router'
import {DbRouter} from './routers/db.router'
import {ErrorMiddleware} from './middlewares/error.middleware'

require('v8-compile-cache')
//todo 性能调优/v8-compile-cache缓存与配置文件
export module Server {
    export const app = new Koa()

    export function activateServer() {
        app.use(koaBody())
        app.use(ErrorMiddleware.handleError)

        app.use(ClientRouter.router.routes())
        app.use(SessionRouter.router.routes())
        app.use(SubscriptRouter.router.routes())
        app.use(CertificateRouter.router.routes())
        app.use(DbRouter.router.routes())

        app.listen(Config.port, () => {
            console.log('complete')
            app.emit('serverCreated', Config.port)
        })
    }
}
Server.activateServer()