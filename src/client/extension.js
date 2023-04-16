let api = require('uniclient')
module.exports = {
    extension: {
        activate: () => {
            //做一些注册之类的事情
            console.log('activate')
        },
        beforeClose: () => {
            console.log('即将结束')
        },
        workerEntrance: 'WorkerEntranceAbsolutePath',
    },
    nice: 'nice',
}
