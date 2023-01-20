import {IRouterParamContext} from 'koa-router'
import {Next, ParameterizedContext} from 'koa'
import {DbService} from '../services/db.service'
import {DbData} from '../models/data.model'
import {ResponseModel} from '../models/response.model'
import {ServerMessage, TableCreateModes} from '../../common/enums'
import 'koa-body/lib/index'

export module DbController {
    export async function init(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let {createMode, tableName, fields} = ctx.request.body
        DbService.init(createMode, tableName, fields)
        ctx.body = new ResponseModel(ServerMessage.success, TableCreateModes[createMode])
    }

    export async function insert(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let data: DbData = ctx.request.body
        DbService.insert(data)
    }

    export async function insertMany(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let dataList: DbData[] = ctx.request.body
        DbService.insertMany(dataList)
    }

    export async function createTable(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        DbService.createTable()
    }

    export async function closeDb(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        DbService.closeDb()
    }

    export async function backUp(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let fileName = ''
        await DbService.backUp(fileName)
    }

    export async function config(
        ctx: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
        next: Next
    ) {
        let {fileName, options} = ctx.request.body
        DbService.configDb(fileName, options)
    }
}