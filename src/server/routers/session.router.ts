import Router = require('koa-router')
import {SessionController} from '../controllers/session.controller'

export module SessionRouter {
    export let router = new Router({prefix: '/session'})

    router.post('/', SessionController.init)
    router.post('/change_identity', SessionController.changeIdentity)
    router.post('/write', SessionController.writeMany)
    router.delete('/close', SessionController.close)
    router.post('/read', SessionController.readManyByIds)
    router.get('/node_ids', SessionController.getIdByName)
    router.get('/browse/root', SessionController.browseRoot)
}