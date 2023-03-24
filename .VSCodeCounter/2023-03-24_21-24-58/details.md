# Details

Date : 2023-03-24 21:24:58

Directory f:\\idea_projects\\uaclient

Total : 74 files,  58483 codes, 532 comments, 10428 blanks, all 69443 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.idea/ApifoxUploaderProjectSetting.xml](/.idea/ApifoxUploaderProjectSetting.xml) | XML | 6 | 0 | 0 | 6 |
| [.idea/dataSources.xml](/.idea/dataSources.xml) | XML | 12 | 0 | 0 | 12 |
| [.idea/jsLibraryMappings.xml](/.idea/jsLibraryMappings.xml) | XML | 6 | 0 | 0 | 6 |
| [.idea/libraries/file_txt.xml](/.idea/libraries/file_txt.xml) | XML | 9 | 0 | 0 | 9 |
| [.idea/misc.xml](/.idea/misc.xml) | XML | 17 | 0 | 0 | 17 |
| [.idea/modules.xml](/.idea/modules.xml) | XML | 8 | 0 | 0 | 8 |
| [.idea/uaclient.iml](/.idea/uaclient.iml) | XML | 9 | 0 | 0 | 9 |
| [.idea/vcs.xml](/.idea/vcs.xml) | XML | 6 | 0 | 0 | 6 |
| [package-lock.json](/package-lock.json) | JSON | 15,866 | 0 | 1 | 15,867 |
| [package.json](/package.json) | JSON | 56 | 0 | 1 | 57 |
| [src/client/app.ts](/src/client/app.ts) | TypeScript | 0 | 0 | 2 | 2 |
| [src/client/client.ts](/src/client/client.ts) | TypeScript | 60 | 0 | 9 | 69 |
| [src/main.ts](/src/main.ts) | TypeScript | 45 | 6 | 5 | 56 |
| [src/platform/base/broker.ts](/src/platform/base/broker.ts) | TypeScript | 62 | 93 | 13 | 168 |
| [src/platform/base/clipboard.ts](/src/platform/base/clipboard.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/platform/base/config.ts](/src/platform/base/config.ts) | TypeScript | 26 | 0 | 7 | 33 |
| [src/platform/base/error.ts](/src/platform/base/error.ts) | TypeScript | 16 | 0 | 3 | 19 |
| [src/platform/base/extend.ts](/src/platform/base/extend.ts) | TypeScript | 22 | 2 | 3 | 27 |
| [src/platform/base/log.ts](/src/platform/base/log.ts) | TypeScript | 92 | 5 | 14 | 111 |
| [src/platform/base/operations.ts](/src/platform/base/operations.ts) | TypeScript | 12 | 15 | 5 | 32 |
| [src/platform/base/persistence.ts](/src/platform/base/persistence.ts) | TypeScript | 52 | 1 | 10 | 63 |
| [src/platform/base/postbox.ts](/src/platform/base/postbox.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/platform/ipc/ipc.events.ts](/src/platform/ipc/ipc.events.ts) | TypeScript | 6 | 1 | 0 | 7 |
| [src/platform/ipc/ipc.handler.ts](/src/platform/ipc/ipc.handler.ts) | TypeScript | 51 | 0 | 8 | 59 |
| [src/platform/product.json](/src/platform/product.json) | JSON | 0 | 0 | 1 | 1 |
| [src/plugins/ua.client/common/ua.enums.ts](/src/plugins/ua.client/common/ua.enums.ts) | TypeScript | 94 | 9 | 11 | 114 |
| [src/plugins/ua.client/config/config.default.ts](/src/plugins/ua.client/config/config.default.ts) | TypeScript | 95 | 0 | 9 | 104 |
| [src/plugins/ua.client/ua.servant/controllers/certificate.controller.ts](/src/plugins/ua.client/ua.servant/controllers/certificate.controller.ts) | TypeScript | 53 | 0 | 4 | 57 |
| [src/plugins/ua.client/ua.servant/controllers/client.controller.ts](/src/plugins/ua.client/ua.servant/controllers/client.controller.ts) | TypeScript | 87 | 0 | 8 | 95 |
| [src/plugins/ua.client/ua.servant/controllers/db.controller.ts](/src/plugins/ua.client/ua.servant/controllers/db.controller.ts) | TypeScript | 53 | 0 | 4 | 57 |
| [src/plugins/ua.client/ua.servant/controllers/session.controller.ts](/src/plugins/ua.client/ua.servant/controllers/session.controller.ts) | TypeScript | 138 | 1 | 12 | 151 |
| [src/plugins/ua.client/ua.servant/controllers/subscript.controller.ts](/src/plugins/ua.client/ua.servant/controllers/subscript.controller.ts) | TypeScript | 89 | 0 | 9 | 98 |
| [src/plugins/ua.client/ua.servant/middlewares/agent.middleware.ts](/src/plugins/ua.client/ua.servant/middlewares/agent.middleware.ts) | TypeScript | 320 | 3 | 8 | 331 |
| [src/plugins/ua.client/ua.servant/middlewares/error.middleware.ts](/src/plugins/ua.client/ua.servant/middlewares/error.middleware.ts) | TypeScript | 24 | 0 | 2 | 26 |
| [src/plugins/ua.client/ua.servant/models/message.model.ts](/src/plugins/ua.client/ua.servant/models/message.model.ts) | TypeScript | 27 | 3 | 2 | 32 |
| [src/plugins/ua.client/ua.servant/models/params.model.ts](/src/plugins/ua.client/ua.servant/models/params.model.ts) | TypeScript | 57 | 12 | 9 | 78 |
| [src/plugins/ua.client/ua.servant/models/response.model.ts](/src/plugins/ua.client/ua.servant/models/response.model.ts) | TypeScript | 11 | 9 | 2 | 22 |
| [src/plugins/ua.client/ua.servant/routers/certificate.router.ts](/src/plugins/ua.client/ua.servant/routers/certificate.router.ts) | TypeScript | 13 | 0 | 2 | 15 |
| [src/plugins/ua.client/ua.servant/routers/client.router.ts](/src/plugins/ua.client/ua.servant/routers/client.router.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/plugins/ua.client/ua.servant/routers/db.router.ts](/src/plugins/ua.client/ua.servant/routers/db.router.ts) | TypeScript | 13 | 4 | 2 | 19 |
| [src/plugins/ua.client/ua.servant/routers/session.router.ts](/src/plugins/ua.client/ua.servant/routers/session.router.ts) | TypeScript | 18 | 0 | 4 | 22 |
| [src/plugins/ua.client/ua.servant/routers/subscript.router.ts](/src/plugins/ua.client/ua.servant/routers/subscript.router.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [src/plugins/ua.client/ua.servant/services/certificate.service.ts](/src/plugins/ua.client/ua.servant/services/certificate.service.ts) | TypeScript | 41 | 53 | 9 | 103 |
| [src/plugins/ua.client/ua.servant/services/client.service.ts](/src/plugins/ua.client/ua.servant/services/client.service.ts) | TypeScript | 80 | 2 | 11 | 93 |
| [src/plugins/ua.client/ua.servant/services/db.service.ts](/src/plugins/ua.client/ua.servant/services/db.service.ts) | TypeScript | 123 | 20 | 5 | 148 |
| [src/plugins/ua.client/ua.servant/services/session.service.ts](/src/plugins/ua.client/ua.servant/services/session.service.ts) | TypeScript | 124 | 10 | 12 | 146 |
| [src/plugins/ua.client/ua.servant/services/subscript.service.ts](/src/plugins/ua.client/ua.servant/services/subscript.service.ts) | TypeScript | 116 | 15 | 10 | 141 |
| [src/plugins/ua.client/ua.servant/ua.servant.ts](/src/plugins/ua.client/ua.servant/ua.servant.ts) | TypeScript | 32 | 1 | 2 | 35 |
| [src/plugins/ua.client/ua.servant/utils/util.ts](/src/plugins/ua.client/ua.servant/utils/util.ts) | TypeScript | 128 | 27 | 9 | 164 |
| [src/workbench/assets/dash.svg](/src/workbench/assets/dash.svg) | XML | 4 | 0 | 0 | 4 |
| [src/workbench/assets/fullscreen.svg](/src/workbench/assets/fullscreen.svg) | XML | 4 | 0 | 0 | 4 |
| [src/workbench/assets/list.svg](/src/workbench/assets/list.svg) | XML | 5 | 0 | 0 | 5 |
| [src/workbench/assets/x.svg](/src/workbench/assets/x.svg) | XML | 3 | 0 | 0 | 3 |
| [src/workbench/bootstrap/css/bootstrap-grid.css](/src/workbench/bootstrap/css/bootstrap-grid.css) | CSS | 4,027 | 6 | 1,153 | 5,186 |
| [src/workbench/bootstrap/css/bootstrap-grid.min.css](/src/workbench/bootstrap/css/bootstrap-grid.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap-grid.rtl.css](/src/workbench/bootstrap/css/bootstrap-grid.rtl.css) | CSS | 4,027 | 6 | 1,153 | 5,186 |
| [src/workbench/bootstrap/css/bootstrap-grid.rtl.min.css](/src/workbench/bootstrap/css/bootstrap-grid.rtl.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap-reboot.css](/src/workbench/bootstrap/css/bootstrap-reboot.css) | CSS | 512 | 14 | 77 | 603 |
| [src/workbench/bootstrap/css/bootstrap-reboot.min.css](/src/workbench/bootstrap/css/bootstrap-reboot.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap-reboot.rtl.css](/src/workbench/bootstrap/css/bootstrap-reboot.rtl.css) | CSS | 518 | 6 | 78 | 602 |
| [src/workbench/bootstrap/css/bootstrap-reboot.rtl.min.css](/src/workbench/bootstrap/css/bootstrap-reboot.rtl.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap-utilities.css](/src/workbench/bootstrap/css/bootstrap-utilities.css) | CSS | 4,638 | 8 | 1,351 | 5,997 |
| [src/workbench/bootstrap/css/bootstrap-utilities.min.css](/src/workbench/bootstrap/css/bootstrap-utilities.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap-utilities.rtl.css](/src/workbench/bootstrap/css/bootstrap-utilities.rtl.css) | CSS | 4,634 | 6 | 1,350 | 5,990 |
| [src/workbench/bootstrap/css/bootstrap-utilities.rtl.min.css](/src/workbench/bootstrap/css/bootstrap-utilities.rtl.min.css) | CSS | 1 | 5 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap.css](/src/workbench/bootstrap/css/bootstrap.css) | CSS | 10,906 | 32 | 2,510 | 13,448 |
| [src/workbench/bootstrap/css/bootstrap.min.css](/src/workbench/bootstrap/css/bootstrap.min.css) | CSS | 2 | 4 | 0 | 6 |
| [src/workbench/bootstrap/css/bootstrap.rtl.css](/src/workbench/bootstrap/css/bootstrap.rtl.css) | CSS | 10,908 | 6 | 2,510 | 13,424 |
| [src/workbench/bootstrap/css/bootstrap.rtl.min.css](/src/workbench/bootstrap/css/bootstrap.rtl.min.css) | CSS | 2 | 4 | 0 | 6 |
| [src/workbench/css/bottom.bar.css](/src/workbench/css/bottom.bar.css) | CSS | 0 | 0 | 1 | 1 |
| [src/workbench/css/side.bar.css](/src/workbench/css/side.bar.css) | CSS | 0 | 0 | 1 | 1 |
| [src/workbench/css/top.bar.css](/src/workbench/css/top.bar.css) | CSS | 39 | 0 | 7 | 46 |
| [src/workbench/index.html](/src/workbench/index.html) | HTML | 23 | 27 | 0 | 50 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 19 | 91 | 0 | 110 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)