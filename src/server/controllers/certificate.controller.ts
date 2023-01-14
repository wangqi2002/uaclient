import {IRouterParamContext} from 'koa-router'
import {Next, ParameterizedContext} from 'koa'
import {CertificateService} from '../services/certificate.service'

export module CertificateController{
    export async function create(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next:Next
    ){
        // let params={}
        // await CertificateService.createCertificate(params)
    }

    export async function trust(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next:Next
    ){
        // CertificateService.trustServerCertificate()
    }

    export async function reject(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next:Next
    ){
        // CertificateService.rejectServerCertificate()
    }

    export async function getTrustStatus(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next:Next
    ){
        // CertificateService.getTrustStatus()
    }
}