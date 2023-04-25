"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.FileTransfer = void 0;
const url_1 = require("url");
const path_1 = require("path");
var FileTransfer;
(function (FileTransfer) {
    function dirname(importMeta) {
        return (0, path_1.dirname)(filename(importMeta));
    }

    FileTransfer.dirname = dirname;

    function filename(importMeta) {
        return importMeta.url ? (0, url_1.fileURLToPath)(importMeta.url) : '';
    }

    FileTransfer.filename = filename;
})(FileTransfer = exports.FileTransfer || (exports.FileTransfer = {}));
