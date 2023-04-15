let api = require('uniclient')

module.exports = {
    activate: () => {
        //做一些注册之类的事情
        console.log('activate')
    },
    beforeClose: () => {
        return true
    },
    actualEntrance: 'actualEntranceAbsolutePath',
}
