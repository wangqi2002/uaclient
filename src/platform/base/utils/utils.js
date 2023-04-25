"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = exports.Utils = void 0;
const fs_1 = require("fs");
class Utils {
    /**
     * @description 输出形如yyyy_mm_dd格式的日期字符串
     * @param date
     */
    static formatDateYMD(date) {
        let monthN = date.getMonth() + 1;
        let month = monthN.toString();
        if (monthN < 10)
            month = '0' + month;
        let dayN = date.getDate();
        let day = dayN.toString();
        if (dayN < 10)
            day = '0' + day;
        return `date_${date.getFullYear()}_${month}_${day}`;
    }
    static formatDateYM(date) {
        let monthN = date.getMonth() + 1;
        let month = monthN.toString();
        if (monthN < 10)
            month = '0' + month;
        let dayN = date.getDate().valueOf();
        let day = dayN.toString();
        if (dayN < 10)
            day = '0' + day;
        return `month_${date.getFullYear()}_${month}`;
    }
    static formatDateYMW(date) {
        let day = date.getDay();
        let d = date.getDate();
        return `week_${date.getFullYear()}_${date.getMonth() + 1}_${Math.ceil((d + 6 - day) / 7)}`;
    }
    static formatDateY(date) {
        let year = date.getFullYear();
        return `year_${year}`;
    }
    static validateDbName(name) {
        if (typeof name === 'string') {
            let reg = new RegExp('^[\u4E00-\u9FA5A-Za-z_]+[\u4E00-\u9FA5a-z0-9_]{2,15}$');
            return reg.test(name);
        }
        else {
            return false;
        }
    }
}
exports.Utils = Utils;
class FileUtils {
    constructor() { }
    static makeDir() {
        // mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
        //     mkdir(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => {})
        // })
    }
    static openFolder(fileName) {
        return (0, fs_1.readdirSync)(fileName);
    }
    static openFolderWithChild(fileName) {
        let files = (0, fs_1.readdirSync)(fileName);
        let results = [];
        files.forEach((file) => {
            if ((0, fs_1.statSync)(fileName + '/' + file).isDirectory()) {
                results.push({ name: file, child: (0, fs_1.readdirSync)(fileName + '/' + file) });
            }
            else {
                results.push({ name: file, child: null });
            }
        });
        return results;
    }
    static watchFolder(path) {
        (0, fs_1.watch)(path, {
            persistent: true,
        }, (event, filename) => { });
    }
}
exports.FileUtils = FileUtils;
