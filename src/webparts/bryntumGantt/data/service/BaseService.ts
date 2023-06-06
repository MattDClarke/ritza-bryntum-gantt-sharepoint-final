import TaskListModel from '../model/TaskListModel';
import ITaskList from './proxy/ITaskList';
import { DateHelper } from '@bryntum/gantt';
import { UpdatePackage } from './proxy/UpdatePackage';
import { Response } from './proxy/Response';

/**
 * This class interacts between gantt's projectmodel and the SharePoint tasklist by using a list proxy. It tunnels sync- and load requests between the model and the tasklist,
 * by creating and translating update- and response packages.
 */
export default class BaseService {

    private _listId: string;
    private revision = 0;
    private range = 1;

    protected model: TaskListModel;
    protected proxy: ITaskList;
    protected fields: any;
    protected modelConfig: any;

    public ganttRef: any;

    constructor(modelConfig: any = {}) {
        this.modelConfig = modelConfig;
        this.model = this.createTaskListModel();
    }

    /**
     * Returns the reference to the gantt view
     * https://bryntum.com/products/gantt/docs/api/Gantt/view/Gantt
     */
    get gantt() {
        return this.ganttRef.current.instance;
    }

    /**
     * Sets the listId (guid), loads the model and sets the timespan.
     * @param id
     */
    set listId(id) {
        if (id && id !== this._listId) {
            this._listId = id;
            if (this.gantt) {
                this.model.load().then(() => {
                    this.setTimeSpan(this.model.startDate, this.range);
                }).catch(() => {});
            }
        }
    }

    // Retrieve current list guid
    get listId() {
        return this._listId;
    }

    // Set the timespan on the gantt view
    public setTimeSpan(startDate, range) {
        const gantt = this.gantt;
        this.range = range;
        if (gantt) {
            gantt.setTimeSpan(startDate, DateHelper.add(startDate, range, 'month'));
        }
    }

    /**
     * Creates a package with update actions for the proxy.
     */
    private getTaskListUpdatePackage(): UpdatePackage {

        const updatePackage = new UpdatePackage();

        const getChanges = (modifications = []) => {
            const fields = Object.keys(modifications);
            const modified = {};
            fields.forEach(field => {
                if (this.fields[field]) {
                    modified[field] = modifications[field];
                }
            });
            if (Object.keys(modified).length) {
                return modified;
            }
        };

        // Get the changes from the taskStore with the original records
        const tasks: any = this.model.taskStore.changes || { added : [], modified : [], removed : [] };

        // Concat added and modified since modified can contain new/phantom records
        tasks.added
            .concat(tasks.modified)
            .forEach(task => {
                if (task.parentId !== this.model.id) {
                    updatePackage.addActionToUpdatePackage(task, getChanges(task.modificationData || []));
                }
            }, this);

        // Process the removed records
        tasks.removed.forEach(task => updatePackage.addActionToUpdatePackage(task, {}, true));
        return updatePackage;
    }

    // Pass the proxy response to the projectmodel
    private finish(request, response: Response) {

        response.requestId = request.data.requestId;
        response.type = request.type;
        response.revision = ++this.revision;

        if (response.success) {
            //success?.call(request.thisObj || me, responseRaw, fetchOptions, request);
            request.success.call(this.model, response, null, request);
        }
        else {
            request.failure.call(this.model, response, null, request);
        }

        return response;
    }

    // Handle a proxy sync failure
    private handleFail(request, error: any) {
        const response = new Response();
        response.success = false;
        response.message = error;
        return this.finish(request, response);
    }

    /**
     * The sync request is called by the TaskList project model when changes are detected.
     * @param request
     */
    public sync(request: any): Promise<Response> {

        // Create an update package for the proxy/list to handle
        const updatePackage: UpdatePackage = this.getTaskListUpdatePackage();
        const response = new Response();
        const data = request.data;

        if (data.dependencies) {
            response.addNonPersistedDependencyChanges(data.dependencies);
        }

        if (data.assignments) {
            response.addNonPersistedAssignmentChanges(data.assignments);
        }

        return new Promise((resolve, reject) => {

            const handleFail = (error) => {
                reject(this.handleFail(request, error));
            };

            this.proxy.deleteTaskListItems(this.listId, updatePackage.remove).then(removed => {
                response.addTaskRemoved(removed);
                this.proxy.addTaskListItems(this.listId, updatePackage.add).then(added => {
                    response.addTaskRows(added);
                    this.proxy.updateTaskListItems(this.listId, updatePackage.update).then(updated => {
                        response.addTaskRows(updated);
                        resolve(this.finish(request, response));
                    }).catch(handleFail);
                }).catch(handleFail);
            }).catch(handleFail);
        });
    }

    /**
     * The load request is called by the TaskList project model when load is called.
     * @param request
     */
    public load(request: any): Promise<Response> {
        // Set auto sync to false during loading to prevent getting `dataset` changes
        this.model.autoSync = false;

        return new Promise((resolve, reject) => {

            const handleFail = (error) => {
                reject(this.handleFail(request, error));
            };

            this.proxy.getTaskListItems(this.listId).then(response => {
                resolve(this.finish(request, response));
                // Auto sync is set to true to automatically persist changes
                this.model.autoSync = true;
            }).catch(handleFail);
        });
    }

    /**
     * SharePoint only expects data for fields defined in the tasklist. In this case we take the field dataSources defined in the TaskModel.
     */
    private getUpdateFields() {
        const fieldName = field => field.dataSource || field.name;
        const fields = (<any> this.model.taskStore.modelClass).fields || [];
        // eslint-disable-next-line no-return-assign,no-sequences
        this.fields = fields.reduce((fieldObj, field) => (fieldObj[fieldName(field)] = true, fieldObj), {});
    }

    // Create a tasklist model / data proxy on the model
    private createTaskListModel() {
        this.model = this.model || new TaskListModel((<any>Object).assign({
            service : this
        }, this.modelConfig));
        this.getUpdateFields();
        return this.model;
    }

    public getTaskListModel(): TaskListModel {
        return this.model;
    }

    public ensureList(name: string, sampleData = 'single'): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            resolve({});
        });
    }

    public getTaskLists(): Promise<{ key: string; text: string }[]> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
}
