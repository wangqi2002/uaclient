export module Utils {
    /**
     * @description 输出形如yyyy_mm_dd格式的日期字符串
     * @param date
     */
    export function formatDateYMD(date: Date) {
        let monthN = date.getMonth() + 1
        let month = monthN.toString()
        if (monthN < 10) month = "0" + month
        let dayN = date.getDate()
        let day = dayN.toString()
        if (dayN < 10) day = "0" + day
        return `date_${date.getFullYear()}_${month}_${day}`
    }

    export function formatDateYM(date: Date) {
        let monthN = date.getMonth() + 1
        let month = monthN.toString()
        if (monthN < 10) month = "0" + month
        let dayN = date.getDate().valueOf()
        let day = dayN.toString()
        if (dayN < 10) day = "0" + day
        return `month_${date.getFullYear()}_${month}`
    }

    export function formatDateYMW(date: Date) {
        let day = date.getDay()
        let d = date.getDate()
        return `week_${date.getFullYear()}_${date.getMonth() + 1}_${Math.ceil((d + 6 - day) / 7)}`
    }

    export function formatDateY(date: Date) {
        let year = date.getFullYear()
        return `year_${year}`
    }

    export function validateDbName(name: any) {
        if (typeof name === "string") {
            let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z_]+[\u4E00-\u9FA5a-z0-9_]{2,15}$")
            return reg.test(name)
        } else {
            return false
        }
    }
}
