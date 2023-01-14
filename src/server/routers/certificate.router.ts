import Router = require("koa-router")

export module CertificateRouter{
    export let router=new Router({
        prefix:'/certificate'
    })

    router.get('/')
}