# Details

Date : 2023-04-06 11:47:19

Directory f:\\idea_projects\\uaclient\\src

Total : 47 files,  2842 codes, 323 comments, 284 blanks, all 3449 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/client/client.ts](/src/client/client.ts) | TypeScript | 107 | 7 | 11 | 125 |
| [src/client/error/error.ts](/src/client/error/error.ts) | TypeScript | 16 | 0 | 2 | 18 |
| [src/client/extend/activator.ts](/src/client/extend/activator.ts) | TypeScript | 26 | 1 | 4 | 31 |
| [src/client/extend/extend.ts](/src/client/extend/extend.ts) | TypeScript | 213 | 6 | 26 | 245 |
| [src/client/extend/run.ts](/src/client/extend/run.ts) | TypeScript | 6 | 0 | 2 | 8 |
| [src/client/product.json](/src/client/product.json) | JSON | 3 | 0 | 1 | 4 |
| [src/client/workspace/workspace.ts](/src/client/workspace/workspace.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [src/platform/base/broker/broker.ts](/src/platform/base/broker/broker.ts) | TypeScript | 69 | 84 | 13 | 166 |
| [src/platform/base/log/log.ts](/src/platform/base/log/log.ts) | TypeScript | 101 | 6 | 15 | 122 |
| [src/platform/base/persist/persistence.ts](/src/platform/base/persist/persistence.ts) | TypeScript | 61 | 2 | 9 | 72 |
| [src/platform/base/postbox/postbox.ts](/src/platform/base/postbox/postbox.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/platform/base/store/store.ts](/src/platform/base/store/store.ts) | TypeScript | 71 | 0 | 10 | 81 |
| [src/platform/ipc/events/ipc.events.ts](/src/platform/ipc/events/ipc.events.ts) | TypeScript | 33 | 0 | 7 | 40 |
| [src/platform/ipc/handlers/ipc.handler.ts](/src/platform/ipc/handlers/ipc.handler.ts) | TypeScript | 57 | 3 | 9 | 69 |
| [src/plugins/ua.client/common/ua.enums.ts](/src/plugins/ua.client/common/ua.enums.ts) | TypeScript | 94 | 9 | 11 | 114 |
| [src/plugins/ua.client/config/config.default.ts](/src/plugins/ua.client/config/config.default.ts) | TypeScript | 95 | 0 | 9 | 104 |
| [src/plugins/ua.client/ua.servant/controllers/certificate.controller.ts](/src/plugins/ua.client/ua.servant/controllers/certificate.controller.ts) | TypeScript | 53 | 0 | 4 | 57 |
| [src/plugins/ua.client/ua.servant/controllers/client.controller.ts](/src/plugins/ua.client/ua.servant/controllers/client.controller.ts) | TypeScript | 87 | 0 | 8 | 95 |
| [src/plugins/ua.client/ua.servant/controllers/db.controller.ts](/src/plugins/ua.client/ua.servant/controllers/db.controller.ts) | TypeScript | 53 | 0 | 4 | 57 |
| [src/plugins/ua.client/ua.servant/controllers/session.controller.ts](/src/plugins/ua.client/ua.servant/controllers/session.controller.ts) | TypeScript | 138 | 1 | 12 | 151 |
| [src/plugins/ua.client/ua.servant/controllers/subscript.controller.ts](/src/plugins/ua.client/ua.servant/controllers/subscript.controller.ts) | TypeScript | 89 | 0 | 9 | 98 |
| [src/plugins/ua.client/ua.servant/middlewares/agent.middleware.ts](/src/plugins/ua.client/ua.servant/middlewares/agent.middleware.ts) | TypeScript | 335 | 3 | 8 | 346 |
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
| [src/plugins/ua.client/ua.servant/services/db.service.ts](/src/plugins/ua.client/ua.servant/services/db.service.ts) | TypeScript | 123 | 21 | 6 | 150 |
| [src/plugins/ua.client/ua.servant/services/session.service.ts](/src/plugins/ua.client/ua.servant/services/session.service.ts) | TypeScript | 124 | 10 | 12 | 146 |
| [src/plugins/ua.client/ua.servant/services/subscript.service.ts](/src/plugins/ua.client/ua.servant/services/subscript.service.ts) | TypeScript | 116 | 15 | 10 | 141 |
| [src/plugins/ua.client/ua.servant/ua.servant.ts](/src/plugins/ua.client/ua.servant/ua.servant.ts) | TypeScript | 34 | 2 | 3 | 39 |
| [src/plugins/ua.client/ua.servant/utils/util.ts](/src/plugins/ua.client/ua.servant/utils/util.ts) | TypeScript | 128 | 27 | 9 | 164 |
| [src/workbench/assets/dash.svg](/src/workbench/assets/dash.svg) | XML | 4 | 0 | 0 | 4 |
| [src/workbench/assets/fullscreen.svg](/src/workbench/assets/fullscreen.svg) | XML | 4 | 0 | 0 | 4 |
| [src/workbench/assets/list.svg](/src/workbench/assets/list.svg) | XML | 5 | 0 | 0 | 5 |
| [src/workbench/assets/x.svg](/src/workbench/assets/x.svg) | XML | 3 | 0 | 0 | 3 |
| [src/workbench/css/common.css](/src/workbench/css/common.css) | CSS | 24 | 1 | 4 | 29 |
| [src/workbench/css/index.css](/src/workbench/css/index.css) | CSS | 139 | 4 | 4 | 147 |
| [src/workbench/element-ui/css/index.css](/src/workbench/element-ui/css/index.css) | CSS | 1 | 0 | 0 | 1 |
| [src/workbench/index.html](/src/workbench/index.html) | HTML | 23 | 25 | 0 | 48 |
| [src/workbench/workbench.ts](/src/workbench/workbench.ts) | TypeScript | 89 | 13 | 10 | 112 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)