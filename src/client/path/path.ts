import { fileURLToPath } from 'url'
import { dirname as pathDirname } from 'path'

export module FileTransfer {
    export function dirname(importMeta: any) {
        return pathDirname(filename(importMeta))
    }

    export function filename(importMeta: any) {
        return importMeta.url ? fileURLToPath(importMeta.url) : ''
    }
}
