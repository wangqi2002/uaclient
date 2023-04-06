import { IMainExtension } from "./extend"
import child_process from "child_process"
import { NodeVM, NodeVMOptions } from "vm2"

export class ExtensionActivator {
    static sandbox: NodeVM

    constructor(options?: NodeVMOptions) {
        if (options) {
            ExtensionActivator.sandbox = new NodeVM(options)
        } else {
            ExtensionActivator.sandbox = new NodeVM({
                require: {
                    builtin: ["*"],
                    external: true,
                },
            })
        }
    }
    //通过vm2沙箱执行插件文件
    static async activateExtension(extension: IMainExtension) {
        child_process.fork(".//run.js", {
            execArgv: ["F:\\idea_projects\\uaclient\\src\\plugins\\ua.client\\ua.servant\\ua.servant.js"],
        })
    }

    static runFile(path: string) {
        ExtensionActivator.sandbox.runFile(path)
    }
}
