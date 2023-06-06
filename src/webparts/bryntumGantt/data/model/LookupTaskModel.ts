import { TaskModel } from '@bryntum/gantt';

/**
 * Model with helper functions to set values to a SharePoint Lookup field like AssignToId and PredecessorId.
 */
export default class LookupTaskModel extends TaskModel {

    public isTask : true;

    // Value stored as comma separated string.
    private getValueAsIntArray(value: string) : number[] {
        return value === '' ? [] : value.split(',').map(id => parseInt(id));
    }

    // Used for updating sharepoint lookup fields
    private serializeMultiLookupValue(value): object {
        return this.getValueAsIntArray(value);
    }

    // We store lookup values as a string to detect changes on the model, convert back to original int array
    public getMultiLookupList(field: string): number[] {
        const value = this.get(field) || '';
        return this.getValueAsIntArray(value);
    }

    // Add/update or remove an item in the multi lookup field
    public setFieldChangeToLookupField(action: string, field: string, id: number) : void {

        const value = this.getMultiLookupList(field);

        switch (action) {
            case 'remove':
                if (value.indexOf(id) !== -1) {
                    value.splice(value.indexOf(id), 1);
                    this.set(field, value);
                }
                break;
            case 'add':
            case 'update':
                if (value.indexOf(id) === -1) {
                    value.push(id);
                    this.set(field, value);
                }
                break;
        }
    }

    // We store multi lookup [int] values as string to detect changes on the model
    public static setIntArrayAsStringValue(value : any) {
        if (Array.isArray(value)) {
            return value.join(',');
        }

        if (value && value.results) {
            return value.results.join(',');
        }

        return (value === null) ? '' : value;
    }
}
