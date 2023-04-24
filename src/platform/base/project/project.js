// export interface IProjectManager{
// }
export class ProjectManagerFactory {
    static currentManager;
    static currentProject;
    constructor() { }
    static produceProjectManager(project) {
        let manager = new ProjectManager(project);
        ProjectManagerFactory.currentProject = project;
        ProjectManagerFactory.currentManager = manager;
        return manager;
    }
    static getCurrentProject() {
        return ProjectManagerFactory.currentProject;
    }
}
export class ProjectManager {
    constructor(project) { }
}
