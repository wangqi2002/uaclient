"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalWorkspaceManager = exports.WorkspaceManager = void 0;
const store_1 = require("../store/store");
const fs_1 = require("fs");
const electron_1 = require("electron");
class WorkspaceManager {
    constructor(ws) {
        this.workspace = ws.workspace;
        this.projects = ws.projects;
    }
    createProject(projectName, projectType) {
        (0, fs_1.mkdir)(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            (0, fs_1.mkdir)(this.workspace.storagePath + `\\${projectName}` + "\\.client", () => { });
        });
    }
    deleteProject() { }
    loadProject(projectName) {
        electron_1.ipcMain.emit("加载了project");
    }
    loadProjectOptions() { }
    watchFolder(path) {
        (0, fs_1.watch)(path, {
            persistent: true,
        }, (event, filename) => { });
    }
    openFolder(projectName) {
        let files = [];
        (0, fs_1.readdir)(this.workspace.storagePath + `\\${projectName}`, (err, list) => {
            files.push(...list);
        });
        return files;
    }
}
exports.WorkspaceManager = WorkspaceManager;
class GlobalWorkspaceManager {
    constructor() {
        this.workspaces = new Map();
        // GlobalWorkspaceManager.projectExtend = []
        store_1.ClientStore.create({
            name: "workspace",
            fileExtension: "json",
            // cwd: app.getPath("appData"),
            cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
            clearInvalidConfig: true,
        });
        this.loadAllWorkspaces();
    }
    loadAllWorkspaces() {
        let ws = store_1.ClientStore.get("workspace", "workspaces");
        let current = store_1.ClientStore.get("workspace", "currentWS");
        GlobalWorkspaceManager.projectExtend = store_1.ClientStore.get("workspace", "projectExtend");
        if (ws) {
            ws.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns);
            });
        }
        if (current) {
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(current);
        }
    }
    createDirAsWorkspace(dirPath, workspaceName) {
        if (!this.workspaces.has(workspaceName)) {
            (0, fs_1.mkdir)(dirPath + `//${workspaceName}`, () => {
                (0, fs_1.mkdir)(dirPath + "//.ws", () => { });
            });
            let w = {
                workspace: {
                    workspaceName: workspaceName,
                    storagePath: dirPath + workspaceName,
                },
                projects: [],
            };
            this.workspaces.set(workspaceName, w);
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(w);
        }
    }
    switchWorkspace(workspaceName) {
        let ws = this.workspaces.get(workspaceName);
        if (ws) {
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(ws);
        }
    }
    static addProjectExtend(projects) {
        GlobalWorkspaceManager.projectExtend.push(...projects);
    }
    static getProjectExtend() {
        return GlobalWorkspaceManager.projectExtend;
    }
    static getCurrentWSNames() {
        return GlobalWorkspaceManager.currentWS.workspace;
    }
    updateStore() {
        store_1.ClientStore.set("workspace", "workspaces", [...this.workspaces.values()]);
    }
    beforeClose() {
        this.updateStore();
    }
}
exports.GlobalWorkspaceManager = GlobalWorkspaceManager;
// new ClientStore()
