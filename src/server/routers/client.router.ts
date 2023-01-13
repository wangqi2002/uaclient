import Router = require("koa-router")

import {ClientController} from '../controllers/client.controller'

export module ClientRouter{
    export let router=new Router({
        prefix:'/client'
    })
    router.post('/',ClientController.init)
    router.get('/connect',ClientController.connect)
    router.get('/endpoints',ClientController.getEndpoints)
    router.get('/disconnect',ClientController.disconnect)
}