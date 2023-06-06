import { ResourceModel } from '@bryntum/gantt';

export default class MyResourceModel extends ResourceModel {

    public static idField = 'Id';

    static get fields() {
        return [
            { name : 'name', dataSource : 'Title' },
            { name : 'email', dataSource : 'Email' }
        ];
    }

}
