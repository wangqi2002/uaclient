import {ProjectManagerFactory, IProject} from './../../platform/base/project/project.js'
import {moduleStoreNames} from './../enums.js'
import {ClientStore} from '../store/store.js'
import {mkdir} from 'fs'
import {ipcClient} from '../../platform/ipc/handlers/ipc.handler.js'
import {FileUtils} from '../../platform/base/utils/utils.js'
import EventEmitter from 'events'

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
    events: EventEmitter
    projects: string[]
    onStart: string | null

    constructor(ws: IWorkspaceManager) {
        this.events = new EventEmitter()
        this.workspace = ws.workspace
        this.projects = ws.projects
        this.onStart = ws.onStart
        this.initBind()
        ipcClient.on('extension:ready', () => {
            this.toStart()
        })
    }

    initBind() {
        ipcClient.on('project:load', (event, fileName: string) => {
            console.log(fileName)
            this.loadProject(fileName)
        })
    }

    toStart() {
        if (this.onStart) {
            ipcClient.emitToRender('project:load', this.workspace.storagePath + '/' + this.onStart)
        }
    }

    createProject(projectName: string, projectType: string) {
        mkdir(this.workspace.storagePath + `\\${projectName}` + `\\.${projectType}`, () => {
            mkdir(this.workspace.storagePath + `\\${projectName}` + '\\.client', () => {
            })
        })
    }

    deleteProject() {
    }

    loadProject(fileName: string) {
        GlobalWorkspaceManager.projectExtend.forEach((projectType: string) => {
            if (fileName.endsWith(projectType)) {
                ipcClient.emitToRender('project:activate.' + projectType)
            }
        })
        let project: IProject = require(fileName + '/project.json')
        ProjectManagerFactory.produceProjectManager(project)
    }
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
        this.initBind()
        this.loadAllWorkspaces()
        // ipcClient.emit('workspace:ready')
    }

    initBind() {
        ipcClient.handle('folder:open', (event, fileName: string) => {
            let files = FileUtils.openFolder(fileName)
            if (files.includes('project.json')) {
                ipcClient.emitToRender('project:load', fileName, files)
                return null
            } else {
                return files
            }
        })
    }

    loadAllWorkspaces() {
        let ws: IWorkspaceManager[] = ClientStore.get(moduleStoreNames.workspace, storeNames.workspaceManager)
        let current: IWorkspaceManager = ClientStore.get(moduleStoreNames.workspace, storeNames.currentManager)
        GlobalWorkspaceManager.projectExtend = ClientStore.get(moduleStoreNames.workspace, storeNames.projectExtend)
        if (current) {
            GlobalWorkspaceManager.currentManager = new WorkspaceManager(current)
        }
        if (ws) {
            ws.forEach((wsIns) => {
                this.workspaces.set(wsIns.workspace.workspaceName, wsIns)
            })
        }
    }

    createDirAsWorkspace(dirPath: string, workspaceName: string) {
        if (!this.workspaces.has(workspaceName)) {
            mkdir(dirPath + `//${workspaceName}`, () => {
                mkdir(dirPath + '//.ws', () => {
                })
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

    static changeWorkspace() {
    }

    updateStore() {
        ClientStore.set('workspace', 'workspaces', [...this.workspaces.values()])
    }

    beforeClose() {
        this.updateStore()
    }
}

// new ClientStore()
