import Router = require("koa-router")

import {ClientController} from '../controllers/client.controller'

export module ClientRouter {
    export let router = new Router({
        prefix: '/client'
    })
    router.post('/', ClientController.init)
    router.post('/connect', ClientController.connect)
    router.get('/endpoints', ClientController.getEndpoints)
    router.get('/privateKey', ClientController.getPrivateKey)
    router.get('/certificate', ClientController.getCertificate)
    router.get('/servers', ClientController.getServers)
    router.delete('/disconnect', ClientController.disconnect)
}