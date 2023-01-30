import {IRouterParamContext} from 'koa-router'
import {Next, ParameterizedContext} from 'koa'
import {DbService} from '../services/db.service'
import {DbData} from '../models/data.model'
import {ResponseModel} from '../models/response.model'
import {TableCreateModes} from '../../common/enums'
import 'koa-body/lib/index'

export module DbController {
    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let {createMode, tableName, fields} = ctx.request.body
            DbService.init(createMode, tableName, fields)
            ctx.body = new ResponseModel(TableCreateModes[createMode])
        } catch (e: any) {
            throw e
        }
    }

    export async function insert(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let data: DbData = ctx.request.body
            DbService.insert(data)
        } catch (e: any) {
            throw e
        }
    }

    export async function insertMany(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let dataList: DbData[] = ctx.request.body
            DbService.insertMany(dataList)
        } catch (e: any) {
            throw e
        }
    }

    export async function createTable(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let {tableName, fieldNames} = ctx.request.body
            DbService.createTable(tableName, fieldNames)
        } catch (e: any) {
            throw e
        }
    }

    export async function closeDb(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            DbService.closeDb()
        } catch (e: any) {
            throw e
        }
    }

    export async function backUp(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let fileName = ctx.request.body
            await DbService.backUp(fileName)
        } catch (e: any) {
            throw e
        }
    }

    export async function config(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        try {
            let {fileName, options} = ctx.request.body
            DbService.configDb(fileName, options)
        } catch (e: any) {
            throw e
        }
    }
}