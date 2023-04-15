import {ClientStore} from "../store/store"
import {mkdir, readdir, watch} from "fs"
import {ipcMain} from "electron"

export type workspace = {
    workspaceName: string
    storagePath: string
}

export interface IWorkspace {
    workspace: workspace
    projects: string[]
}

export interface WsGlobalManager {
    workspaces: IWorkspace[]
    currentWS: IWorkspace
    projectExtend: string[]
}

export class WorkspaceManager implements IWorkspace {
    workspace: workspace
    projects: string[]

    constructor(ws: IWorkspace) {
        this.workspace = ws.workspace
        this.projects = ws.projects
    }

    createProject(projectName: string, projectType: string) {
        mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            mkdir(this.workspace.storagePath + `\\${projectName}` + "\\.client", () => {})
        })
    }
    deleteProject() {}
    loadProject(projectName: string) {
        ipcMain.emit("加载了project")
    }
    loadProjectOptions() {}
    watchFolder(path: string) {
        watch(
            path,
            {
                persistent: true,
            },
            (event, filename) => {}
        )
    }
    openFolder(projectName: string) {
        let files: string[] = []
        readdir(this.workspace.storagePath + `\\${projectName}`, (err, list) => {
            files.push(...list)
        })
        return files
    }
}

export class GlobalWorkspaceManager {
    workspaces: Map<string, IWorkspace>
    static currentWS: IWorkspace
    static projectExtend: string[]

    constructor() {
        this.workspaces = new Map()
        // GlobalWorkspaceManager.projectExtend = []
        ClientStore.create({
            name: "workspace",
            fileExtension: "json",
            // cwd: app.getPath("appData"),
            cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
            clearInvalidConfig: true,
        })
        this.loadAllWorkspaces()
    }

    loadAllWorkspaces() {
        let ws: IWorkspace[] = ClientStore.get("workspace", "workspaces")
        let current: IWorkspace = ClientStore.get("workspace", "currentWS")
        GlobalWorkspaceManager.projectExtend = ClientStore.get("workspace", "projectExtend")
        if (ws) {
            ws.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns)
            })
        }
        if (current) {
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(current)
        }
    }

    createDirAsWorkspace(dirPath: string, workspaceName: string) {
        if (!this.workspaces.has(workspaceName)) {
            mkdir(dirPath + `//${workspaceName}`, () => {
                mkdir(dirPath + "//.ws", () => {})
            })
            let w = {
                workspace: {
                    workspaceName: workspaceName,
                    storagePath: dirPath + workspaceName,
                },
                projects: [],
            }
            this.workspaces.set(workspaceName, w)
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(w)
        }
    }

    switchWorkspace(workspaceName: string) {
        let ws = this.workspaces.get(workspaceName)
        if (ws) {
            GlobalWorkspaceManager.currentWS = new WorkspaceManager(ws)
        }
    }

    static addProjectExtend(projects: string[]) {
        GlobalWorkspaceManager.projectExtend.push(...projects)
    }

    static getProjectExtend() {
        return GlobalWorkspaceManager.projectExtend
    }

    static getCurrentWSNames() {
        return GlobalWorkspaceManager.currentWS.workspace
    }

    updateStore() {
        ClientStore.set("workspace", "workspaces", [...this.workspaces.values()])
    }

    beforeClose() {
        this.updateStore()
    }
}
// new ClientStore()
