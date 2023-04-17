"use strict";
// let c = [{ str: 'nice' }, { str: 'ok' }]
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// console.log(c.includes({ str: 'nice' }))
let a = () => __awaiter(void 0, void 0, void 0, function* () {
    let addHook = require('pirates').addHook;
    //匹配者:只针对extension.js文件进行api的替换
    const matcher = (fileName) => {
        if (fileName.endsWith('extension.js'))
            return true;
        return false;
    };
    let p = path_1.default.posix.join(__dirname, '/3.js');
    p = p.replace(/\\/g, '/');
    addHook((code, filename) => {
        return code.replace(/require\((['"])uniclient\1\)/, () => {
            return `require('${p}')`;
        });
    }, { exts: ['.js'], matcher });
    let { extension } = yield require('./extension');
});
a();
// let p = path.posix.join(__dirname, '/3.js')
// require(p)
