import { ProjectManagerFactory, ProjectManager, IProject } from './../../platform/base/project/project'
import { moduleStoreNames } from './../enums'
import { ClientStore } from '../store/store'
import { mkdir, readdir, watch } from 'fs'
import { ipcMain } from 'electron'
import { eventsBind, mainEmit } from '../../platform/ipc/handlers/ipc.handler'
import { FileUtils } from '../../platform/base/utils/utils'

enum storeNames {
    workspaceManager = 'workspaceManagers',
    currentManager = 'currentManager',
    projectExtend = 'projectExtend',
}

export type workspace = {
    workspaceName: string
    storagePath: string
}

export interface IWorkspaceManager {
    workspace: workspace
    projects: string[]
    onStart: string | null
}

export interface IGlobalWorkSpaceInfo {
    workspaces: IWorkspaceManager[]
    currentManager: IWorkspaceManager
    projectExtend: string[]
}

export interface IGlobalWorkSpaceManager {
    workspaces: Map<string, IWorkspaceManager>
}

export class WorkspaceManager implements IWorkspaceManager {
    workspace: workspace
    projects: string[]
    onStart: string | null

    constructor(ws: IWorkspaceManager) {
        this.workspace = ws.workspace
        this.projects = ws.projects
        this.onStart = ws.onStart
        eventsBind.on('extension:ready', () => {
            this.startUp()
        })
    }

    startUp() {
        if (this.onStart) {
            this.loadProject(this.workspace.storagePath + '/' + this.onStart)
        }
    }

    createProject(projectName: string, projectType: string) {
        mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            mkdir(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => {})
        })
    }
    deleteProject() {}
    loadProject(fileName: string) {
        GlobalWorkspaceManager.projectExtend.forEach((projectType: string) => {
            if (fileName.endsWith(projectType)) {
                mainEmit.emit('project:' + projectType)
            }
        })
        let files = FileUtils.openFolder(fileName)
        mainEmit.emit('folder:open', files)
        if (files.includes('project.json')) {
            let project: IProject = require(fileName + '/project.json')
            ProjectManagerFactory.produceProjectManager(project)
        }
    }
    loadProjectOptions() {}
}

export class GlobalWorkspaceManager implements IGlobalWorkSpaceManager {
    workspaces: Map<string, IWorkspaceManager>
    static currentManager: IWorkspaceManager
    static projectExtend: string[]

    constructor() {
        this.workspaces = new Map()
        GlobalWorkspaceManager.projectExtend = []
        ClientStore.create({
            name: moduleStoreNames.workspace,
            fileExtension: 'json',
            clearInvalidConfig: true,
        })
        this.loadAllWorkspaces()
    }

    loadAllWorkspaces() {
        let ws: IWorkspaceManager[] = ClientStore.get(moduleStoreNames.workspace, storeNames.workspaceManager)
        let current: IWorkspaceManager = ClientStore.get(moduleStoreNames.workspace, storeNames.currentManager)
        GlobalWorkspaceManager.projectExtend = ClientStore.get(moduleStoreNames.workspace, storeNames.projectExtend)
        if (ws) {
            ws.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns)
            })
        }
        if (current) {
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(current)
        }
    }

    createDirAsWorkspace(dirPath: string, workspaceName: string) {
        if (!this.workspaces.has(workspaceName)) {
            mkdir(dirPath + `//${workspaceName}`, () => {
                mkdir(dirPath + '//.ws', () => {})
            })
            let w = {
                workspace: {
                    workspaceName: workspaceName,
                    storagePath: dirPath + workspaceName,
                },
                projects: [],
                onStart: null,
            }
            this.workspaces.set(workspaceName, w)
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(w)
        }
    }

    switchWorkspace(workspaceName: string) {
        let ws = this.workspaces.get(workspaceName)
        if (ws) {
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(ws)
        }
    }

    static addProjectExtend(projects: string[]) {
        GlobalWorkspaceManager.projectExtend.push(...projects)
    }

    static getProjectExtend() {
        return GlobalWorkspaceManager.projectExtend
    }

    static getCurrentWSNames() {
        return GlobalWorkspaceManager.currentManager.workspace
    }

    static changeWorkspace() {}

    updateStore() {
        ClientStore.set('workspace', 'workspaces', [...this.workspaces.values()])
    }

    beforeClose() {
        this.updateStore()
    }
}
// new ClientStore()
