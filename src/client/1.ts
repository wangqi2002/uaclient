// let c = [{ str: 'nice' }, { str: 'ok' }]

import path from 'path'

// console.log(c.includes({ str: 'nice' }))
let a = async () => {
    let addHook = require('pirates').addHook
    //匹配者:只针对extension.js文件进行api的替换
    const matcher = (fileName: string) => {
        if (fileName.endsWith('extension.js')) return true
        return false
    }
    let p = path.posix.join(__dirname, '/3.js')
    p = p.replace(/\\/g, '/')
    addHook(
        (code: string, filename: string) => {
            return code.replace(/require\((['"])uniclient\1\)/, () => {
                return `require('${p}')`
            })
        },
        { exts: ['.js'], matcher }
    )
    let { extension } = await require('./extension')
}
a()
// let p = path.posix.join(__dirname, '/3.js')
// require(p)
