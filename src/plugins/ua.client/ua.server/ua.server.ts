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
//todo 性能调优/v8-compile-cache缓存,所有error添加stack
export module Server {
    export const app = new Koa()
    let routers = [
        ClientRouter.router,
        SessionRouter.router,
        SubscriptRouter.router,
        CertificateRouter.router,
        DbRouter.router
    ]

    export function activateServer() {
        app.use(koaBody())
        app.use(ErrorMiddleware.handleError)
        routers.forEach((router) => {
            app.use(router.routes())
        })
        app.listen(Config.port, () => {
            console.log('complete')
            app.emit('serverCreated', Config.port)
        })
    }
}
Server.activateServer()