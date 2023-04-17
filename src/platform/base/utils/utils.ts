import { readdirSync, watch } from 'fs'

export class Utils {
    /**
     * @description 输出形如yyyy_mm_dd格式的日期字符串
     * @param date
     */
    static formatDateYMD(date: Date) {
        let monthN = date.getMonth() + 1
        let month = monthN.toString()
        if (monthN < 10) month = '0' + month
        let dayN = date.getDate()
        let day = dayN.toString()
        if (dayN < 10) day = '0' + day
        return `date_${date.getFullYear()}_${month}_${day}`
    }

    static formatDateYM(date: Date) {
        let monthN = date.getMonth() + 1
        let month = monthN.toString()
        if (monthN < 10) month = '0' + month
        let dayN = date.getDate().valueOf()
        let day = dayN.toString()
        if (dayN < 10) day = '0' + day
        return `month_${date.getFullYear()}_${month}`
    }

    static formatDateYMW(date: Date) {
        let day = date.getDay()
        let d = date.getDate()
        return `week_${date.getFullYear()}_${date.getMonth() + 1}_${Math.ceil((d + 6 - day) / 7)}`
    }

    static formatDateY(date: Date) {
        let year = date.getFullYear()
        return `year_${year}`
    }

    static validateDbName(name: any) {
        if (typeof name === 'string') {
            let reg = new RegExp('^[\u4E00-\u9FA5A-Za-z_]+[\u4E00-\u9FA5a-z0-9_]{2,15}$')
            return reg.test(name)
        } else {
            return false
        }
    }
}

export class FileUtils {
    constructor() {}

    static makeDir() {
        // mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
        //     mkdir(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => {})
        // })
    }

    static openFolder(fileName: string) {
        return readdirSync(fileName)
    }

    static watchFolder(path: string) {
        watch(
            path,
            {
                persistent: true,
            },
            (event, filename) => {}
        )
    }
}
