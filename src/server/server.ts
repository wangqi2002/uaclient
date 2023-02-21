import Koa = require("koa")
import {koaBody} from 'koa-body'
import {Config} from '../config/config.default'
import {ClientRouter} from './routers/client.router'
import {SessionRouter} from './routers/session.router'
import {SubscriptRouter} from './routers/subscript.router'
import {CertificateRouter} from './routers/certificate.router'
import {DbRouter} from './routers/db.router'
import {ErrorMiddleware} from './middlewares/error.middleware'
import {ValidatorMiddleware} from './middlewares/validator.middleware'

export module Server {

    export const app = new Koa()
    app.use(koaBody())
    app.use(ErrorMiddleware.handleError)
    // app.use(TransferMiddleware.bodyTransfer)
    app.use(ValidatorMiddleware.paramValidator)

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