"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertUtils = exports.DbUtils = exports.JsonUtils = void 0;
const fs_1 = require("fs");
const Log = require('../../../../platform/base/log');
var JsonUtils;
(function (JsonUtils) {
    /**
     * @description nodeToModify应该传入一个字符串数组,按顺序描述json节点,
     * 前后节点之间应当为父子关系,本函数将最后一个节点的值改为dataToReplace,并写入原json文件
     * @throws Error('no such node'),ErrnoException
     * @param path
     * @param nodeToModify
     * @param dataToReplace
     * @example
     * modifyJsonFile('./configs.json', ['nodeGrandpa', 'nodeFather', 'nodeSon'], 4)
     * @author hhj
     */
    function modifyJsonNode(path, nodeToModify, dataToReplace) {
        if ((0, fs_1.existsSync)(path)) {
            (0, fs_1.readFile)(path, (err, data) => {
                if (err) {
                    Log.error(err.message);
                }
                else {
                    if (data.length === 0) {
                        let temp = `{"${nodeToModify}":` + JSON.stringify(dataToReplace) + '}';
                        (0, fs_1.writeFile)(path, temp, 'utf-8', (err) => {
                            if (err) {
                                Log.error(err.message);
                                throw err;
                            }
                        });
                    }
                    else {
                        let result = JSON.parse(data.toString());
                        let temp = result;
                        for (let i = 0; i < nodeToModify.length - 1; i++) {
                            temp = temp[nodeToModify[i]];
                        }
                        if (temp[nodeToModify[nodeToModify.length - 1]]) {
                            temp[nodeToModify[nodeToModify.length - 1]] = dataToReplace;
                            (0, fs_1.writeFile)(path, JSON.stringify(result), 'utf-8', (err) => {
                                if (err) {
                                    Log.error(err.message);
                                    throw err;
                                }
                            });
                        }
                        else {
                            Log.error('no such node');
                            throw Error('no such node');
                        }
                    }
                }
            });
        }
        else {
            let temp = `{"${nodeToModify}":` + JSON.stringify(dataToReplace) + '}';
            (0, fs_1.writeFile)(path, temp, 'utf-8', (err) => {
                if (err) {
                    Log.error(err.message);
                    throw err;
                }
            });
        }
    }
    JsonUtils.modifyJsonNode = modifyJsonNode;
    /**
     * @description 用于读取json文件中的指定节点,并返回目标对象/值,
     * nodeToModify应该传入一个字符串数组,按顺序描述json节点,前后节点之间应当为父子关系
     * @param path
     * @param nodeToSelect
     * @example
     * let node = getJsonNode('./configs.json', ['nodeGrandpa', 'nodeFather', 'nodeSon'])
     * @throws Error('empty file'),
     * Error('no such node'),
     * Error('no such file')
     * @author hhj
     */
    function getJsonNode(path, nodeToSelect) {
        if ((0, fs_1.existsSync)(path)) {
            let data = (0, fs_1.readFileSync)(path).toString();
            if (data.length === 0) {
                Log.error('empty file');
                throw Error('empty file');
            }
            else {
                let temp = JSON.parse(data.toString());
                for (let i = 0; i < nodeToSelect.length - 1; i++) {
                    temp = temp[nodeToSelect[i]];
                }
                if (temp[nodeToSelect[nodeToSelect.length - 1]]) {
                    return temp[nodeToSelect[nodeToSelect.length - 1]];
                }
                else {
                    Log.error('no such node');
                    throw Error('no such node');
                }
            }
        }
        else {
            Log.error('no such file');
            throw Error('no such file');
        }
    }
    JsonUtils.getJsonNode = getJsonNode;
})(JsonUtils = exports.JsonUtils || (exports.JsonUtils = {}));
var DbUtils;
(function (DbUtils) {
    /**
     * @description 输出形如yyyy_mm_dd格式的日期字符串
     * @param date
     */
    function formatDateYMD(date) {
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
    DbUtils.formatDateYMD = formatDateYMD;
    function formatDateYM(date) {
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
    DbUtils.formatDateYM = formatDateYM;
    function formatDateYMW(date) {
        let day = date.getDay();
        let d = date.getDate();
        return `week_${date.getFullYear()}_${date.getMonth() + 1}_${Math.ceil((d + 6 - day) / 7)}`;
    }
    DbUtils.formatDateYMW = formatDateYMW;
    function formatDateY(date) {
        let year = date.getFullYear();
        return `year_${year}`;
    }
    DbUtils.formatDateY = formatDateY;
    function validateDbName(name) {
        if (typeof name === 'string') {
            let reg = new RegExp('^[\u4E00-\u9FA5A-Za-z_]+[\u4E00-\u9FA5a-z0-9_]{2,15}$');
            return reg.test(name);
        }
        else {
            return false;
        }
    }
    DbUtils.validateDbName = validateDbName;
})(DbUtils = exports.DbUtils || (exports.DbUtils = {}));
var CertUtils;
(function (CertUtils) {
    function validateCertOptions(param) {
        if (!(typeof param.subject === 'string')) {
            if (param.subject.country) {
                if (param.subject.country.length > 2) {
                    return false;
                }
            }
        }
        else {
            return true;
        }
    }
    CertUtils.validateCertOptions = validateCertOptions;
})(CertUtils = exports.CertUtils || (exports.CertUtils = {}));
