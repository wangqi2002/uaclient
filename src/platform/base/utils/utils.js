"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils;
(function (Utils) {
    /**
     * @description 输出形如yyyy_mm_dd格式的日期字符串
     * @param date
     */
    function formatDateYMD(date) {
        let monthN = date.getMonth() + 1;
        let month = monthN.toString();
        if (monthN < 10)
            month = "0" + month;
        let dayN = date.getDate();
        let day = dayN.toString();
        if (dayN < 10)
            day = "0" + day;
        return `date_${date.getFullYear()}_${month}_${day}`;
    }
    Utils.formatDateYMD = formatDateYMD;
    function formatDateYM(date) {
        let monthN = date.getMonth() + 1;
        let month = monthN.toString();
        if (monthN < 10)
            month = "0" + month;
        let dayN = date.getDate().valueOf();
        let day = dayN.toString();
        if (dayN < 10)
            day = "0" + day;
        return `month_${date.getFullYear()}_${month}`;
    }
    Utils.formatDateYM = formatDateYM;
    function formatDateYMW(date) {
        let day = date.getDay();
        let d = date.getDate();
        return `week_${date.getFullYear()}_${date.getMonth() + 1}_${Math.ceil((d + 6 - day) / 7)}`;
    }
    Utils.formatDateYMW = formatDateYMW;
    function formatDateY(date) {
        let year = date.getFullYear();
        return `year_${year}`;
    }
    Utils.formatDateY = formatDateY;
    function validateDbName(name) {
        if (typeof name === "string") {
            let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z_]+[\u4E00-\u9FA5a-z0-9_]{2,15}$");
            return reg.test(name);
        }
        else {
            return false;
        }
    }
    Utils.validateDbName = validateDbName;
})(Utils = exports.Utils || (exports.Utils = {}));
