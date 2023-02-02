import Router = require('koa-router')
import {SessionController} from '../controllers/session.controller'

export module SessionRouter {
    export let router = new Router({prefix: '/session'})

    router.post('/', SessionController.init)
    router.post('/change_identity', SessionController.changeIdentity)
    router.post('/write', SessionController.writeMany)
    router.post('/read', SessionController.readManyByIds)
    router.post('/browse', SessionController.browse)

    router.get('/id', SessionController.getIdByName)
    router.get('/browse/root', SessionController.browseRoot)
    router.get('/server_cert', SessionController.serverCert)

    router.post('/close', SessionController.close)
}