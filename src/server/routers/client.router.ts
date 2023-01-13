import Router = require("koa-router");

import {ClientController} from '../controllers/client.controller'

export module ClientRouter{
    export let router=new Router({
        prefix:'/client'
    })
    router.post('/',ClientController.postClientOptions)
    router.get('/connect',ClientController.connect)
    router.get('/endpoints',ClientController.getEndpoints)

}