import Koa = require("koa")
import {koaBody} from 'koa-body'
import {Config} from '../config/config.default'
import {ClientRouter} from './routers/client.router'
import {SessionRouter} from './routers/session.router'
import {SubscriptRouter} from './routers/subscript.router'
import {CertificateRouter} from './routers/certificate.router'
import {DbRouter} from './routers/db.router'

export module Server {
    export const app = new Koa()
    app.use(koaBody({
        multipart: true
    }))
    app.use(ClientRouter.router.routes())
    app.use(SessionRouter.router.routes())
    app.use(SubscriptRouter.router.routes())
    app.use(CertificateRouter.router.routes())
    app.use(DbRouter.router.routes())
    app.listen(Config.port, () => {
        app.emit('serverCreated', Config.port)
    })
}