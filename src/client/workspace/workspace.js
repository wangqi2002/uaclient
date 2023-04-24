import { ProjectManagerFactory } from './../../platform/base/project/project.js';
import { moduleStoreNames } from './../enums.js';
import { ClientStore } from '../store/store.js';
import { mkdir } from 'fs';
import { ipcClient } from '../../platform/ipc/handlers/ipc.handler.js';
import { FileUtils } from '../../platform/base/utils/utils.js';
import EventEmitter from 'events';
var storeNames;
(function (storeNames) {
    storeNames["workspaceManager"] = "workspaceManagers";
    storeNames["currentManager"] = "currentManager";
    storeNames["projectExtend"] = "projectExtend";
})(storeNames || (storeNames = {}));
export class WorkspaceManager {
    workspace;
    events;
    projects;
    onStart;
    constructor(ws) {
        this.events = new EventEmitter();
        this.workspace = ws.workspace;
        this.projects = ws.projects;
        this.onStart = ws.onStart;
        this.initBind();
        ipcClient.on('extension:ready', () => {
            this.toStart();
        });
    }
    initBind() {
        ipcClient.on('project:load', (event, fileName) => {
            console.log(fileName);
            this.loadProject(fileName);
        });
    }
    toStart() {
        if (this.onStart) {
            ipcClient.emit('project:load', this.workspace.storagePath + '/' + this.onStart);
        }
    }
    createProject(projectName, projectType) {
        mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            mkdir(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => { });
        });
    }
    deleteProject() { }
    loadProject(fileName) {
        GlobalWorkspaceManager.projectExtend.forEach((projectType) => {
            if (fileName.endsWith(projectType)) {
                ipcClient.emit('project:activate.' + projectType);
            }
        });
        let project = require(fileName + '/project.json');
        ProjectManagerFactory.produceProjectManager(project);
    }
}
export class GlobalWorkspaceManager {
    workspaces;
    static currentManager;
    static projectExtend;
    constructor() {
        this.workspaces = new Map();
        GlobalWorkspaceManager.projectExtend = [];
        ClientStore.create({
            name: moduleStoreNames.workspace,
            fileExtension: 'json',
            clearInvalidConfig: true,
        });
        this.initBind();
        this.loadAllWorkspaces();
        ipcClient.emit('workspace:ready');
    }
    initBind() {
        ipcClient.handle('folder:open', (event, fileName) => {
            let files = FileUtils.openFolder(fileName);
            if (files.includes('project.json')) {
                ipcClient.emit('project:load', fileName, files);
                return null;
            }
            else {
                return files;
            }
        });
    }
    loadAllWorkspaces() {
        let ws = ClientStore.get(moduleStoreNames.workspace, storeNames.workspaceManager);
        let current = ClientStore.get(moduleStoreNames.workspace, storeNames.currentManager);
        GlobalWorkspaceManager.projectExtend = ClientStore.get(moduleStoreNames.workspace, storeNames.projectExtend);
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
            mkdir(dirPath + `//${workspaceName}`, () => {
                mkdir(dirPath + '//.ws', () => { });
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
    static changeWorkspace() { }
    updateStore() {
        ClientStore.set('workspace', 'workspaces', [...this.workspaces.values()]);
    }
    beforeClose() {
        this.updateStore();
    }
}
// new ClientStore()
