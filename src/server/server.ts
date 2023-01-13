import {ClientRouter} from './routers/client.router'
import Koa = require("koa");
import {koaBody} from 'koa-body'
import {Config} from '../config/config.default'

export module Server{
    export const app = new Koa()
    app.use(koaBody())
    app.use(ClientRouter.router.routes())
    app.listen(Config.port, () => {
        app.emit('serverCreated',Config.port)
    })
}