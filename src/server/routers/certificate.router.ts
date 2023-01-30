import Router = require("koa-router")
import {CertificateController} from '../controllers/certificate.controller'

export module CertificateRouter {
    export let router = new Router({
        prefix: '/cert'
    })

    router.post('/create', CertificateController.create)
    router.post('/trust', CertificateController.trust)
    router.post('/reject', CertificateController.reject)
    router.post('/trust_status', CertificateController.getTrustStatus)
}