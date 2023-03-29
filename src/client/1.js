const { DataTypes } = require("sequelize")

let defaultAttributes = {
    server: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "server",
    },
    nodeId: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "nodeId",
    },
    displayName: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "displayName",
    },
    value: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "value",
    },
    dataType: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "dataType",
    },
    sourceTimestamp: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "sourceTimestamp",
    },
    serverTimestamp: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "serverTimestamp",
    },
    statusCode: {
        type: "DataTypes.STRING",
        allowNull: false,
        field: "statusCode",
    },
}
console.log(JSON.stringify(defaultAttributes))
