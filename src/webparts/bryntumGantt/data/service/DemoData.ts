import { DateHelper } from '@bryntum/gantt';
import ITaskList from './proxy/ITaskList';
import { UpdateAction } from './proxy/UpdatePackage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ganttProject: any = require('../../resources/data/launch-saas.json');

export default class DemoData {

    /**
     * Create a single project task to start with
     * @param taskList
     * @param listId
     */
    public createSingleProjectTask(taskList: ITaskList, listId: string): Promise<any> {
        const startDate = new Date();
        const endDate = DateHelper.add(startDate, 7, 'days');
        const actions = [new UpdateAction({}, { StartDate : startDate, DueDate : endDate, Title : 'Project start' })];

        return taskList.addTaskListItems(listId, actions);
    }

    /**
     * Create a full blown example based on `launch-saas.json`.
     *
     * @param taskList
     * @param listId
     */
    public createFullExample(taskList: ITaskList, listId: string): Promise<any> {
        const mockData: any = ganttProject;
        const tasks = mockData.tasks.rows;
        const dependencies = mockData.dependencies.rows;
        console.log({tasks})
        const generatedIdMap = {};

        const iterateTasks = async(children, parent) => {

            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    console.log('child ', i);
                    const newStartDate = new Date(child.startDate);
                    let newEndDate;

                    if (child.endDate) {
                        newEndDate = new Date(child.endDate);
                    } else {
                        if (child.duration) {
                            newEndDate = DateHelper.add(newStartDate, child.duration, 'days');
                            console.log('newEndDate: duration ', newEndDate);
                        } else if (child.children.length > 0) {
                            // If no duration is set, but there are children, calculate the end date based on the children
                            let grandChildMaxEndDateTimeStamp = 0;
                            child.children.forEach((grandChild) => {
                                const grandChildStartDate = new Date(grandChild.startDate);
                                if (grandChild.endDate) {
                                    const grandChildEndDateTimeStamp = new Date(grandChild.endDate).valueOf();
                                    if (grandChildEndDateTimeStamp > grandChildMaxEndDateTimeStamp) {
                                        grandChildMaxEndDateTimeStamp = grandChildEndDateTimeStamp;
                                    }  
                                } else if (grandChild.duration) {
                                    console.log('newEndDate for grandchild: duration ', newEndDate);
                                    const grandChildEndDateTimeStamp = DateHelper.add(grandChildStartDate, grandChild.duration, 'days').valueOf();
                                    if (grandChildEndDateTimeStamp > grandChildMaxEndDateTimeStamp) {
                                        grandChildMaxEndDateTimeStamp = grandChildEndDateTimeStamp;
                                    }  
                                } else {
                                    const grandChildEndDateTimeStamp = new Date(grandChildStartDate).valueOf();
                                    if (grandChildEndDateTimeStamp > grandChildMaxEndDateTimeStamp) {
                                        grandChildMaxEndDateTimeStamp = grandChildEndDateTimeStamp;
                                    }                                  
                                }                        
                            });
                            newEndDate = new Date(grandChildMaxEndDateTimeStamp);
                        } else {
                            newEndDate = newStartDate;
                        }
                    }

                    // Persist as percentage
                    // Bryntum: out of 100, SharePoint List: out of 1
                    const percentComplete = child.percentDone / 100;
                    
                    const data = {
                        Title           : child.name,
                        StartDate       : newStartDate,
                        DueDate         : newEndDate,
                        PercentComplete : percentComplete,
                        ManuallyScheduled: true,
                        // Category        : child.category,
                        ResourceAssignment: child.resourceAssignment,
                    };
                    
                    if (parent) {
                        data['ParentIDId'] = parent.id;
                    }
                    
                    console.log({data})

                    const dependency = dependencies.filter(item => {
                        return item.toTask === child.id;
                    });

                    if (dependency.length > 0) {
                        data['PredecessorsId'] = dependency.map(item => generatedIdMap[item.fromTask]);
                    }

                    const addResult: UpdateAction[] = await taskList.addTaskListItems(listId, [new UpdateAction({}, data)]);
                    generatedIdMap[child.id] = addResult[0].data.id;
                    child.id = addResult[0].data.id;
                    await iterateTasks(child.children, child);
                }
            }
        };

        return new Promise((resolve, reject) => {
            iterateTasks(tasks, null).then(resolve).catch(reject);
        });
    }
}
