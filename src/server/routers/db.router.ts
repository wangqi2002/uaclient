import Router = require("koa-router")
import {DbController} from '../controllers/db.controller'

export module DbRouter {
    export let router = new Router({
        prefix: '/db'
    })

    router.post('/init', DbController.init)
    router.post('/insert', DbController.insert)
    router.post('/insertMany', DbController.insertMany)
    router.post('/createTable', DbController.createTable)
    router.post('/close', DbController.closeDb)
    router.post('/backup', DbController.backUp)
    router.post('/config', DbController.config)
}