import { ProjectModel, ProjectModelConfig, TaskModel } from '@bryntum/gantt';
import Service from '../service/Service';
import LookupTaskModel from './LookupTaskModel';

/**
 * The Project model for the gantt chart
 * https://bryntum.com/products/gantt/docs/api/Gantt/model/ProjectModel
 */
export default class TaskListModel extends ProjectModel {

    public autoSync: boolean;// Is set to true after loading

    private service: Service;

    constructor(config?: Partial<ProjectModelConfig>) {
        super(config);
        this.service = config['service'];
        // Any change in the dependency store needs to be reflected to the taskStore in the task PredecessorId field.
        this.dependencyStore.on('change', this.onDependencyChange.bind(this));
        // Only support F-S types for the default SharePoint SPTaskList
        this.dependencyStore.isValidDependency = async(dependencyOrFromId, toId, type) => {
            return type === 2;
        };
        // Any change in the assignment store needs to be reflected to the taskStore in the task AssignedToId field.
        this.assignmentStore.on('change', this.onAssignmentChange.bind(this));
    }

    protected getTask(idOrTask: TaskModel | number): LookupTaskModel {
        if (idOrTask) {
            return (idOrTask instanceof TaskModel ? idOrTask : this.taskStore.getById(idOrTask)) as LookupTaskModel;
        }
    }

    private onAssignmentChange(source: any) {
        const records = source.records || (source.record ? [source.record] : []);
        records.forEach(record => {
            const id = record.resource ? record.resourceId : null;
            const task = this.getTask(record.task || record.event);
            task.setFieldChangeToLookupField(source.action, 'assignedToId', id);
        });
    }

    private onDependencyChange(source: any) {
        const records = source.records || (source.record ? [source.record] : []);
        records.forEach(record => {
            const id = record.fromTask ? record.fromTask.id : null;
            const task = this.getTask(record.toTask);
            if (task) {
                task.setFieldChangeToLookupField(source.action, 'predecessorId', id);
            }
        });
    }

    // Override of the crudmanager to bypass Ajax response, no decoding needed
    public decode(response: any): any {
        return response;
    }

    // Override of the crudmanager to bypass Ajax response, no encoding needed
    public encode(requestConfig: any): string {
        return requestConfig;
    }

    /**
     * Use the List Proxy instead of the default AjaxRequest
     * @param request
     */
    public sendRequest(request: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const end = (response) => {
                // eslint-disable-next-line no-void
                void this.trigger?.('responseReceived', { success : response.success });

                if (response.success) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }

            switch (request.type) {
                case 'load':
                    this.service.load(request).then(end).catch(end);
                    break;
                case 'sync':
                    this.service.sync(request).then(end).catch(end);
                    break;
            }
        });
    }

}
