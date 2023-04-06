"use strict";
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
exports.ExtensionActivator = void 0;
const child_process_1 = __importDefault(require("child_process"));
const vm2_1 = require("vm2");
class ExtensionActivator {
    constructor(options) {
        if (options) {
            ExtensionActivator.sandbox = new vm2_1.NodeVM(options);
        }
        else {
            ExtensionActivator.sandbox = new vm2_1.NodeVM({
                require: {
                    builtin: ["*"],
                    external: true,
                },
            });
        }
    }
    //通过vm2沙箱执行插件文件
    static activateExtension(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            child_process_1.default.fork(".//run.js", {
                execArgv: ["F:\\idea_projects\\uaclient\\src\\plugins\\ua.client\\ua.servant\\ua.servant.js"],
            });
        });
    }
    static runFile(path) {
        ExtensionActivator.sandbox.runFile(path);
    }
}
exports.ExtensionActivator = ExtensionActivator;
