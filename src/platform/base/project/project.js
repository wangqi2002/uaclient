"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = exports.ProjectManagerFactory = void 0;
// export interface IProjectManager{
// }
class ProjectManagerFactory {
    constructor() { }
    static produceProjectManager(project) {
        let manager = new ProjectManager(project);
        ProjectManagerFactory.currentProject = project;
        ProjectManagerFactory.currentManager = manager;
        return manager;
    }
}
exports.ProjectManagerFactory = ProjectManagerFactory;
class ProjectManager {
    constructor(project) { }
}
exports.ProjectManager = ProjectManager;
