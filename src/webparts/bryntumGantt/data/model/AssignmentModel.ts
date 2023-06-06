import { AssignmentModel } from '@bryntum/gantt';

export default class MyAssignmentModel extends AssignmentModel {

    // We do not store assignment units in the TaskList or other list in this demo.
    static get fields() {
        return [
            { name : 'units', readOnly : true }
        ];
    }
}
