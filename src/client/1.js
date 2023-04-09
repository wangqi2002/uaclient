const { NodeVM } = require("vm2")
const { Worker } = require("worker_threads")
const sandbox = new NodeVM({
    require: {
        builtin: ["con"],
        mock: {
            con: {
                show(str) {
                    console.log(str)
                },
            },
        },
    },
})
// sandbox.runFile("F:\\idea_projects\\uaclient\\src\\client\\2.js")
let w = new Worker("./3.js")
w.on("error", (error) => {
    console.log(error)
})
module.exports = {
    sandbox: sandbox,
}
