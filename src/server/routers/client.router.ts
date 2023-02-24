import Router = require("koa-router")

import {ClientController} from '../controllers/client.controller'
import {ValidatorMiddleware} from '../middlewares/validator.middleware'

export module ClientRouter {
    export let router = new Router({
        prefix: '/client'
    })
    router.use(ValidatorMiddleware.clientValidator)

    router.post('/init', ClientController.init)
    router.post('/connect', ClientController.connect)
    router.post('/disconnect', ClientController.disconnect)
    router.post('/endpoints', ClientController.getEndpoints)

    router.get('/private_key', ClientController.getPrivateKey)
    router.get('/cert', ClientController.getCertificate)
    router.get('/servers', ClientController.getServers)

}