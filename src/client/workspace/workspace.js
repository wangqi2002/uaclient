"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.GlobalWorkspaceManager = exports.WorkspaceManager = void 0;
const project_js_1 = require("./../../platform/base/project/project.js");
const enums_js_1 = require("./../enums.js");
const store_js_1 = require("../store/store.js");
const fs_1 = require("fs");
const ipc_handler_js_1 = require("../../platform/ipc/handlers/ipc.handler.js");
const utils_js_1 = require("../../platform/base/utils/utils.js");
const events_1 = __importDefault(require("events"));
var storeNames;
(function (storeNames) {
    storeNames["workspaceManager"] = "workspaceManagers";
    storeNames["currentManager"] = "currentManager";
    storeNames["projectExtend"] = "projectExtend";
})(storeNames || (storeNames = {}));

class WorkspaceManager {
    workspace;
    events;
    projects;
    onStart;

    constructor(ws) {
        this.events = new events_1.default();
        this.workspace = ws.workspace;
        this.projects = ws.projects;
        this.onStart = ws.onStart;
        this.initBind();
        ipc_handler_js_1.ipcClient.on('extension:ready', () => {
            this.toStart();
        });
    }

    initBind() {
        ipc_handler_js_1.ipcClient.on('project:load', (event, fileName) => {
            console.log(fileName);
            this.loadProject(fileName);
        });
    }

    toStart() {
        if (this.onStart) {
            ipc_handler_js_1.ipcClient.emit('project:load', this.workspace.storagePath + '/' + this.onStart);
        }
    }

    createProject(projectName, projectType) {
        (0, fs_1.mkdir)(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            (0, fs_1.mkdir)(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => {
            });
        });
    }

    deleteProject() {
    }

    loadProject(fileName) {
        GlobalWorkspaceManager.projectExtend.forEach((projectType) => {
            if (fileName.endsWith(projectType)) {
                ipc_handler_js_1.ipcClient.emit('project:activate.' + projectType);
            }
        });
        let project = require(fileName + '/project.json');
        project_js_1.ProjectManagerFactory.produceProjectManager(project);
    }
}

exports.WorkspaceManager = WorkspaceManager;

class GlobalWorkspaceManager {
    workspaces;
    static currentManager;
    static projectExtend;

    constructor() {
        this.workspaces = new Map();
        GlobalWorkspaceManager.projectExtend = [];
        store_js_1.ClientStore.create({
            name: enums_js_1.moduleStoreNames.workspace,
            fileExtension: 'json',
            clearInvalidConfig: true,
        });
        this.initBind();
        this.loadAllWorkspaces();
        // ipcClient.emit('workspace:ready')
    }

    initBind() {
        ipc_handler_js_1.ipcClient.handle('folder:open', (event, fileName) => {
            let files = utils_js_1.FileUtils.openFolder(fileName);
            if (files.includes('project.json')) {
                ipc_handler_js_1.ipcClient.emit('project:load', fileName, files);
                return null;
            } else {
                return files;
            }
        });
    }

    loadAllWorkspaces() {
        let ws = store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.workspace, storeNames.workspaceManager);
        let current = store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.workspace, storeNames.currentManager);
        GlobalWorkspaceManager.projectExtend = store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.workspace, storeNames.projectExtend);
        if (current) {
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(current);
        }
        if (ws) {
            ws.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns);
            });
        }
    }

    createDirAsWorkspace(dirPath, workspaceName) {
        if (!this.workspaces.has(workspaceName)) {
            (0, fs_1.mkdir)(dirPath + `//${workspaceName}`, () => {
                (0, fs_1.mkdir)(dirPath + '//.ws', () => {
                });
            });
            let w = {
                workspace: {
                    workspaceName: workspaceName,
                    storagePath: dirPath + workspaceName,
                },
                projects: [],
                onStart: null,
            };
            this.workspaces.set(workspaceName, w);
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(w);
        }
    }

    switchWorkspace(workspaceName) {
        let ws = this.workspaces.get(workspaceName);
        if (ws) {
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(ws);
        }
    }

    static addProjectExtend(projects) {
        GlobalWorkspaceManager.projectExtend.push(...projects);
    }

    static getProjectExtend() {
        return GlobalWorkspaceManager.projectExtend;
    }

    static getCurrentWSNames() {
        return GlobalWorkspaceManager.currentManager.workspace;
    }

    static changeWorkspace() {
    }

    updateStore() {
        store_js_1.ClientStore.set('workspace', 'workspaces', [...this.workspaces.values()]);
    }

    beforeClose() {
        this.updateStore();
    }
}

exports.GlobalWorkspaceManager = GlobalWorkspaceManager;
// new ClientStore()
