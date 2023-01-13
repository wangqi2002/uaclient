const dotenv = require('dotenv')
let path=require('path')
export module Config{
    dotenv.config({
        path: path.join(__dirname, "..", "..", ".env")
    })
    export let port=process.env.APP_PORT
}