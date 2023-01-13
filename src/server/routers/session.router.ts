import Router = require('koa-router')
import {SessionController} from '../controllers/session.controller'
export module SessionRouter{
    export let router=new Router({prefix:'/session'})

    router.post('/',SessionController.init)
    router.post('/change_identity',SessionController.changeIdentity)
    router.post('/write',SessionController.writeMany)
    router.get('/close',SessionController.close)
    router.get('/read',SessionController.readManyByIds)
    router.get('/ids',SessionController.getIdByName)
    router.get('/root',SessionController.browseRoot)
}