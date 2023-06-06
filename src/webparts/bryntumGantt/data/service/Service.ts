import BaseService from './BaseService';

import { getSP } from '../../pnpjsConfig';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users';
import '@pnp/sp/fields';
import { CalendarType, DateTimeFieldFormatType } from '@pnp/sp/fields/types';

import TaskList from './proxy/TaskList';
import MyTaskModel from '../model/TaskModel';
import MyResourceModel from '../model/ResourceModel';
import MyAssignmentModel from '../model/AssignmentModel';
import MyDependencyModel from '../model/DependencyModel';

import DemoData from './DemoData';

/**
 * Service used on the Tenant
 */
export default class Service extends BaseService {

    constructor() {

        super({
            resourceModelClass   : MyResourceModel,
            taskModelClass       : MyTaskModel,
            assignmentModelClass : MyAssignmentModel,
            dependencyModelClass : MyDependencyModel
        });

        this.proxy = new TaskList();
    }

    /**
     * Create a new tasklist with demo data.
     *
     * @param name
     * @param sampleData
     */
    public ensureList(name: string, sampleData: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            const sp = getSP();
            sp.web.lists.ensure(name, 'Bryntum demo', 171, true, {
                AllowContentTypes : true,
                EnableAttachments : true
            }).then(async listEnsureResult => {

                const list = listEnsureResult.list;
                const data = await list();

                if (listEnsureResult.created) {

                    const fieldsToAdd = MyTaskModel.additionalFields;

                    try {
                        for (let i = 0; i < fieldsToAdd.length; i++) {
                            const field = fieldsToAdd[i];
                            switch (field.type) {
                                case 'number':
                                    await list.fields.addNumber(field.dataSource);
                                    break;
                                case 'date':
                                    await list.fields.addDateTime(field.dataSource, {DisplayFormat : DateTimeFieldFormatType.DateTime, DateTimeCalendarType: CalendarType.Gregorian});
                                    break;
                                case 'boolean':
                                    await list.fields.addBoolean(field.dataSource);
                                    break;
                                default:
                                    await list.fields.addText(field.dataSource);
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        reject(err);
                    }

                    // Add demo data
                    const demoData = new DemoData();
                    if (sampleData === 'fulldemo') {
                        await demoData.createFullExample(this.proxy, data.Id);
                    }
                    else {
                        await demoData.createSingleProjectTask(this.proxy, data.Id);
                    }
                }
                resolve(data.Id);
            }).catch(() => {});
        });
    }

    /**
     * Get all SharePoint tasklists.
     */
    public getTaskLists(): Promise<{ key: string; text: string }[]> {
        return new Promise((resolve, reject) => {
            const sp = getSP();
            // Template id 171 is the default for a SharePoint TaskList
            sp.web.lists.filter('BaseTemplate eq 171')().then((lists: any) => {
                if (lists.length > 0) {
                    // We filter on `Bryntum demo`.
                    resolve(lists.filter(item => item.Description === 'Bryntum demo').map((list: any) => {
                        return { key : list.Id, text : list.Title };
                    }));
                }
                else {
                    reject({ code : 2, message : 'Please create a tasklist.' });
                }
            }).catch(reject);
        });
    }
}
