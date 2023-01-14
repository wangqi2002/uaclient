import Router = require("koa-router")
import {SubscriptController} from '../controllers/subscript.controller'

export module SubscriptRouter{
    export let router=new Router({
        prefix:'/subscript'
    })

    router.post('/',SubscriptController.init)
    router.post('/modify',SubscriptController.modify)
    router.post('/add_many',SubscriptController.addItemGroup)
    router.post('/add_one',SubscriptController.addItem)
    router.delete('/delete_items',SubscriptController.deleteItems)
    router.get('/terminate',SubscriptController.terminate)
}