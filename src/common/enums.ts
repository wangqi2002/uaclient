/**
 * @description 数据库创建表格模式
 */
export enum TableCreateModes {
    default = 0,
    customField = 1,
    customTableName = 2,
    customBoth = 3,
}

export enum ClientWarns{

}

export enum ServerStatusCodes{
    success=200,
    unableToFindTheRequestedResource=400,
    notFound=404,
    internalError=500,
}

export enum SourceModules {
    addressSpace='AddressSpace',
    dataAccess='DataAccess',
}