import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
export var FileTransfer;
(function (FileTransfer) {
    function dirname(importMeta) {
        return pathDirname(filename(importMeta));
    }
    FileTransfer.dirname = dirname;
    function filename(importMeta) {
        return importMeta.url ? fileURLToPath(importMeta.url) : '';
    }
    FileTransfer.filename = filename;
})(FileTransfer || (FileTransfer = {}));
