"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalWorkspaceManager = exports.WorkspaceManager = void 0;
const store_1 = require("./../../platform/base/store/store");
const fs_1 = require("fs");
class WorkspaceManager {
    constructor(ws) {
        this.workspace = ws.workspace;
        this.projects = ws.projects;
    }
    createProject() { }
    deleteProject() { }
    loadProject() { }
    loadProjectOptions() { }
    openFolder(path) {
        (0, fs_1.readdir)();
    }
}
exports.WorkspaceManager = WorkspaceManager;
class GlobalWorkspaceManager {
    constructor() {
        this.workspaces = new Map();
        store_1.ClientStore.create({
            name: "workspace",
            fileExtension: "json",
            // cwd: app.getPath("appData"),
            cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
            clearInvalidConfig: true,
        });
    }
    loadAllWorkspaces() {
        let ws = store_1.ClientStore.get("workspace", "workspaces");
        let current = store_1.ClientStore.get("workspace", "currentWS");
        if (ws) {
            ws.workspaces.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns);
            });
        }
        if (current) {
            this.currentWS = new WorkspaceManager(current);
        }
    }
    createDirAsWorkspace(dirPath, workspaceName) {
        (0, fs_1.mkdir)(dirPath + `//${workspaceName}`, () => {
            (0, fs_1.mkdir)(dirPath + "//.client", () => { });
        });
        store_1.ClientStore.set("workspace", "workspaces", {
            workspace: {
                workspaceName: workspaceName,
                storagePath: dirPath + workspaceName,
            },
            projects: [],
        });
    }
}
exports.GlobalWorkspaceManager = GlobalWorkspaceManager;
// new ClientStore()
