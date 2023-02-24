const dotenv = require('dotenv')
let Path = require('path')
export module Config {
    dotenv.config({
        path: Path.join(__dirname, "..", "..", ".env").toString()
    })
    export let port = process.env.APP_PORT
        ? process.env.APP_PORT
        : 3030
    export let mqLength = process.env.MQ_LENGTH
        ? process.env.MQ_LENGTH
        : 200
    export let dbPath = Path.join(__dirname, "..", "..", process.env.DB_PATH)
        ? Path.join(__dirname, "..", "..", process.env.DB_PATH).toString()
        : Path.join(__dirname, "..", '..', "/db/data.db").toString()
}