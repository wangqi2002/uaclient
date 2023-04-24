import { workspace } from './../../../client/workspace/workspace.js'

export interface IProject {
    workspace: workspace
    storagePath: string
    projectName: string
    projectType: string
}
type projectNameWithType = string
// export interface IProjectManager{

// }
export class ProjectManagerFactory {
    static currentManager: ProjectManager
    static currentProject: IProject

    constructor() {}

    static produceProjectManager(project: IProject) {
        let manager = new ProjectManager(project)
        ProjectManagerFactory.currentProject = project
        ProjectManagerFactory.currentManager = manager
        return manager
    }

    static getCurrentProject() {
        return ProjectManagerFactory.currentProject
    }
}

export class ProjectManager {
    constructor(project: IProject) {}
}
